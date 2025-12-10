type RequestImagesParams = {
  prompt: string;
  aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3";
};

type RequestImagesResult = {
  images: string[]; // base64 (PNG/JPEG) strings without data URI prefix
  raw: any;
};

// Image generation uses the Imagen endpoint, not Gemini generateContent.
const IMAGE_MODEL = "imagegeneration";
const IMAGE_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateImages`;

export const requestImages = async ({
  prompt,
  aspectRatio = "1:1",
}: RequestImagesParams): Promise<RequestImagesResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY não configurada");
  }

  const body = {
    prompt: { text: prompt },
    // Some models ignore aspect_ratio; still send a sane default.
    aspectRatio,
  };

  const proxy = "https://proxymorfos-7o72j76u5q-ue.a.run.app/proxyCall?url=";
  const target = `${IMAGE_ENDPOINT}?key=${apiKey}`;
  const url = `${proxy}${encodeURIComponent(target)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Erro na chamada de imagem: ${response.status} - ${text}`);
  }

  const json = JSON.parse(text);

  const images =
    json?.images?.map((img: any) => img?.base64Data).filter(Boolean) ??
    json?.candidates
      ?.map((c: any) => c?.image?.base64 || c?.image?.imageBytes)
      .filter(Boolean) ??
    [];

  return { images, raw: json };
};
