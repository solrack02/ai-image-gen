type RequestImagesParams = {
  prompt: string;
};

type RequestImagesResult = {
  images: string[];
  raw: any;
};

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export const requestImages = async ({
  prompt,
}: RequestImagesParams): Promise<RequestImagesResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY não configurada");
  }

  const buildBody = (withImage = true) => ({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    ...(withImage
      ? {
          generationConfig: {
            responseMimeType: "image/png",
          },
        }
      : {}),
  });

  const callGemini = async (withImage = true) => {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildBody(withImage)),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(
        `Erro na chamada Gemini (${withImage ? "image" : "text"}): ${response.status} - ${text}`
      );
    }

    return JSON.parse(text);
  };

  let json: any;
  try {
    json = await callGemini(true);
  } catch (err: any) {
    if (String(err?.message || "").includes("response_mime_type")) {
      json = await callGemini(false);
    } else {
      throw err;
    }
  }

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
