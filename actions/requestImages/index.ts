type RequestImagesParams = {
  prompt: string;
};

type RequestImagesResult = {
  images: string[];
  raw: any;
};

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

export const requestImages = async ({
  prompt,
}: RequestImagesParams): Promise<RequestImagesResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY não configurada");
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "image/png",
      // Ajuste conforme o modelo suportar imagens (ex.: tamanho, topK, topP).
    },
  };

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na chamada Gemini: ${response.status} - ${errorText}`);
  }

  const json = await response.json();
  const images =
    json?.candidates
      ?.flatMap((candidate: any) =>
        candidate?.content?.parts
          ?.map((part: any) => part?.inlineData?.data)
          ?.filter(Boolean)
      )
      ?.filter(Boolean) ?? [];

  return { images, raw: json };
};
