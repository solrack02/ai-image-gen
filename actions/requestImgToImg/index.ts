import { getVertexToken } from "./getVertexToken";

type RequestImgToImgParams = {
  prompt: string;
  aspectRatio?: string;
  references?: string[]; // data URIs (image/png;base64,...)
  sampleCount?: number;
  outputMimeType?: string;
  negativePrompt?: string;
  seed?: number;
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
  sampleCount = 1,
  outputMimeType = "image/png",
  negativePrompt,
  seed,
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

  // Modelo correto para subject customization (few-shot)
  const IMAGE_MODEL = "imagen-3.0-capability-001";
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${IMAGE_MODEL}:predict`;

  // Converte todas as referências válidas
  const parsedRefs = references
    .map(parseDataUri)
    .filter((r): r is { mimeType: string; data: string } => !!r);

  if (parsedRefs.length === 0) {
    throw new Error(
      "Referencia precisa ser enviada como data URI para subject customization."
    );
  }

  // Cada imagem de referência entra como REFERENCE_TYPE_SUBJECT.
  // Todos com referenceId = 1 (mesmo sujeito).
  const referenceImages = parsedRefs.map((ref) => ({
    referenceType: "REFERENCE_TYPE_SUBJECT",
    referenceId: 1,
    referenceImage: {
      bytesBase64Encoded: ref.data,
    },
    subjectImageConfig: {
      // descrição simples do sujeito da foto
      // subjectDescription: "homem de oculos e barba [1]",
      subjectDescription: prompt,
      subjectType: "SUBJECT_TYPE_PERSON",
    },
  }));

  const logParams = {
    aspectRatio,
    promptLength: prompt?.length || 0,
    referenceCount: referenceImages.length,
    sampleCount,
    outputMimeType,
    hasNegativePrompt: !!negativePrompt,
    seed,
    location,
    projectId,
  };

  const body = {
    instances: [
      {
        // IMPORTANTE: usar [1] na prompt, ex: "homem [1] sorrindo..."
        prompt,
        referenceImages,
      },
    ],
    parameters: {
      aspectRatio,
      sampleCount,
      seed,
      negativePrompt,
      language: "pt",
      outputOptions: {
        mimeType: outputMimeType,
      },
    },
  };

  console.log("Vertex subject-customization request:", logParams);

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
      `Erro na chamada de imagem (subject-customization): ${response.status} - ${text}`
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
