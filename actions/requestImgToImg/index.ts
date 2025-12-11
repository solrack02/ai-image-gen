type RequestImgToImgParams = {
  prompt: string;
  aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3";
  references?: string[]; // expects data URIs for conditioning
};

type RequestImgToImgResult = {
  images: string[];
  raw: any;
};

const parseDataUri = (input?: string | null) => {
  if (!input) return null;
  const match = input.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return null;
  const [, mimeType, data] = match;
  return { mimeType, data };
};

export const requestImgToImg = async ({
  prompt,
  aspectRatio = "1:1",
  references = [],
}: RequestImgToImgParams): Promise<RequestImgToImgResult> => {
  const projectId = process.env.VERTEX_PROJECT_ID;
  const location = process.env.VERTEX_LOCATION || "us-central1";
  const bearer =
    process.env.VERTEX_ACCESS_TOKEN ||
    process.env.GOOGLE_VERTEX_ACCESS_TOKEN ||
    process.env.ACCESS_TOKEN;

  if (!projectId) {
    throw new Error("VERTEX_PROJECT_ID nao configurada");
  }
  if (!bearer) {
    throw new Error(
      "Token de acesso Vertex ausente. Defina VERTEX_ACCESS_TOKEN ou GOOGLE_VERTEX_ACCESS_TOKEN."
    );
  }

  const IMAGE_MODEL = "imagegeneration";
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${IMAGE_MODEL}:predict`;

  const firstRef = parseDataUri(references[0]);
  if (!firstRef) {
    throw new Error("Referencia precisa ser enviada como data URI para img-to-img.");
  }

  const body = {
    instances: [
      {
        prompt,
        image: {
          inlineData: firstRef,
        },
      },
    ],
    parameters: {
      aspectRatio,
      outputMimeType: "image/png",
      sampleCount: 1,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Erro na chamada de imagem (img-to-img): ${response.status} - ${text}`);
  }

  const json = JSON.parse(text);
  const predictions = Array.isArray(json?.predictions) ? json.predictions : [];
  const images =
    predictions
      .map(
        (p: any) =>
          p?.bytesBase64Encoded ||
          p?.byteBase64Encoded ||
          p?.inlineData?.data
      )
      .filter(Boolean) || [];

  return { images, raw: json };
};
