type RequestImagesParams = {
  prompt: string;
  aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3";
  references?: string[]; // data URIs or remote URLs for reference images
};

type RequestImagesResult = {
  images: string[]; // base64 (PNG/JPEG) strings without data URI prefix
  raw: any;
};

// Imagen 4 runs through the `predict` endpoint.
// Fast tier keeps latency/cost lower while we experiment.
const IMAGE_MODEL = "imagen-4.0-fast-generate-001";
const IMAGE_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict`;

export const requestTxtToImg = async ({
  prompt,
  aspectRatio = "1:1",
  references = [],
}: RequestImagesParams): Promise<RequestImagesResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY nao configurada");
  }

  const parsedReferences = references
    .map((ref) => {
      if (!ref) return null;
      if (ref.startsWith("data:")) {
        const match = ref.match(/^data:([^;]+);base64,(.*)$/);
        if (!match) return null;
        const [, mimeType, data] = match;
        return { inlineData: { data, mimeType } };
      }
      return { uri: ref };
    })
    .filter(Boolean);

  const body = {
    // Predict expects the prompt as a plain string.
    instances: [{ prompt, references: parsedReferences }],
    parameters: {
      // sampleCount 1 keeps costs down; adjust if you need variations.
      sampleCount: 1,
      aspectRatio,
      outputMimeType: "image/png",
    },
  } as const;

  const proxy = "https://proxymorfos-7o72j76u5q-ue.a.run.app/proxyCall?url=";
  const target = `${IMAGE_ENDPOINT}?key=${apiKey}`;
  const url = `${proxy}${encodeURIComponent(target)}`;

  console.log("Requisicao de imagem:", { url, body });

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

  console.log("Resposta de imagem:", JSON.stringify(json, null, 2));

  // Cloud predictor returns base64 under predictions; keep older fallbacks.
  const predictions = Array.isArray(json?.predictions) ? json.predictions : [];
  const images =
    predictions
      .map((p: any) => p?.bytesBase64Encoded || p?.byteBase64Encoded || p?.inlineData?.data)
      .filter(Boolean) ||
    json?.images?.map((img: any) => img?.base64Data).filter(Boolean) ||
    json?.candidates
      ?.map((c: any) => c?.image?.base64 || c?.image?.imageBytes)
      .filter(Boolean) ||
    [];

  console.log("Resposta de imagem:", { images });
  return { images, raw: json };
};
