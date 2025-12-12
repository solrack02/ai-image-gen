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
    process.env.VERTEX_PROJECT_ID || process.env.EXPO_PUBLIC_VERTEX_PROJECT_ID;
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
    referenceType: "REFERENCE_TYPE_STYLE",
    referenceId: 1,
    referenceImage: {
      bytesBase64Encoded: ref.data,
    },
    styleImageConfig: {
      styleDescription:
        "Personagem  humanoide 2D de lado caminhando para direita [1]. Pode ser um homem ou mulher, ou robô ou um alienígena ou um monstrinho.",
      styleType: "SUBJECT_TYPE_PERSON",
    },
  }));

  // subjectType: "SUBJECT_TYPE_PERSON"
  // subjectType: "SUBJECT_TYPE_ANIMAL"
  // subjectType: "SUBJECT_TYPE_OBJECT"
  // subjectType: "SUBJECT_TYPE_UNSPECIFIED"

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
        prompt: `
Transformar o personagem [1] em um novo estilo descrito no prompt.

IMPORTANTE:
- Manter exatamente o mesmo layout da imagem de referência [1]
- Manter o mesmo número de poses [1]
- Manter as mesmas posições corporais e ângulos [1]
- É um sprite sheet 2D para jogos
- Recriar todas as poses com o novo estilo especificado no prompt: (ex: cartoon, dark fantasy, robô azul, monstrinho etc.)
- O personagem deve ser o mesmo em TODAS as poses (consistente  entre as poses)
- Fundo simples ou sólido

NÃO gerar imagem única.
Gerar sprite sheet completo.
Manter a variação de poses igual à referência.
O prompt é:` + prompt,
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

  console.log("Vertex subject-customization response status:", response);

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Erro na chamada de imagem (subject-customization): ${response.status} - ${text}`
    );
  }

  const json = JSON.parse(text);

  console.log("Vertex subject-customization response status:", json);

  const predictions = Array.isArray(json?.predictions) ? json.predictions : [];
  const images =
    predictions
      .map(
        (p: any) =>
          p?.bytesBase64Encoded || p?.byteBase64Encoded || p?.inlineData?.data
      )
      .filter(Boolean) || [];

  console.log("Vertex subject-customization response status:", { images });
  return { images, raw: json };
};
