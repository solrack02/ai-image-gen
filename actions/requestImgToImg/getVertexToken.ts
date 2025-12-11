const VERTEX_SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

const isNodeRuntime =
  typeof process !== "undefined" &&
  !!(process.release?.name === "node" || process.versions?.node);

/**
 * Obtains an OAuth access token for Vertex requests.
 * Checks common env vars first, then falls back to ADC via google-auth-library (Node only).
 */
export const getVertexToken = async (): Promise<string> => {
  const directToken =
    process.env.VERTEX_ACCESS_TOKEN ||
    process.env.GOOGLE_VERTEX_ACCESS_TOKEN ||
    process.env.ACCESS_TOKEN ||
    process.env.EXPO_PUBLIC_VERTEX_ACCESS_TOKEN ||
    process.env.EXPO_PUBLIC_VERTEX_TOKEN_BCK ||
    process.env.VERTEX_TOKEN_BCK;

  if (directToken) return directToken;

  if (!isNodeRuntime) {
    throw new Error(
      "Token de acesso Vertex ausente. Defina VERTEX_ACCESS_TOKEN (browser/Expo)."
    );
  }

  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({ scopes: VERTEX_SCOPES });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;

  if (!token) {
    throw new Error("Nao foi possivel obter access token para Vertex.");
  }

  return token;
};
