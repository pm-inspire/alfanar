import OpenAI from "openai";

export function createOpenAiClient(apiKey) {
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function embedText({ client, model, input }) {
  if (!client) throw new Error("OpenAI client not configured");
  const resp = await client.embeddings.create({
    model,
    input,
  });
  const vec = resp.data?.[0]?.embedding;
  if (!Array.isArray(vec)) throw new Error("Invalid embedding response");
  return vec;
}

