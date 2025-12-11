import { getVertexToken } from "./getVertexToken";

type RequestImgToImgParams = {
  prompt: string;
  aspectRatio?: string;
  references?: string[]; // data URIs (image/png;base64,...)
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
  const projectId =
    process.env.VERTEX_PROJECT_ID ||
    process.env.EXPO_PUBLIC_VERTEX_PROJECT_ID;
  const location =
    process.env.VERTEX_LOCATION ||
    process.env.EXPO_PUBLIC_VERTEX_LOCATION ||
    "us-central1";

  if (!projectId) {
    throw new Error("VERTEX_PROJECT_ID nao configurada");
  }

  const bearer = await getVertexToken();

  const IMAGE_MODEL = "imagegeneration@002";
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${IMAGE_MODEL}:predict`;

  const firstRef = parseDataUri(references[0]);
  if (!firstRef) {
    throw new Error(
      "Referencia precisa ser enviada como data URI para img-to-img."
    );
  }

  const logParams = {
    aspectRatio,
    promptLength: prompt?.length || 0,
    hasImage: !!firstRef?.data,
    imageBytesLen: firstRef?.data?.length || 0,
    mimeType: firstRef?.mimeType,
    maskProvided: false,
    location,
    projectId,
  };

  // Vertex img-to-img expects `bytesBase64Encoded` (or imageBytes) + mimeType.
  const body = {
    instances: [
      {
        prompt,
        image: {
          bytesBase64Encoded: firstRef.data,
          mimeType: firstRef.mimeType || "image/png",
        },
      },
    ],
    parameters: {
      aspectRatio,
      outputMimeType: "image/png",
      sampleCount: 1,
    },
  };

  console.log("Vertex img-to-img request:", logParams);

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
    throw new Error(
      `Erro na chamada de imagem (img-to-img): ${response.status} - ${text}`
    );
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
