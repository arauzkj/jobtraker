import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Orden de fallback: si el primero falla o está rate-limiteado, probamos el siguiente
export const FALLBACK_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-26b-a4b-it:free",
] as const;


export async function callOpenRouterJSON(prompt: string): Promise<unknown> {
  let lastError: unknown;

  for (const modelId of FALLBACK_MODELS) {
    try {
      const model = openrouter(modelId);

      const result = await model.doGenerate({
        prompt: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }],
          },
        ],
        temperature: 0.1,
      });

      const textPart = result.content.find(
        (part): part is { type: "text"; text: string } => part.type === "text",
      );

      if (!textPart) {
        lastError = new Error(`Modelo ${modelId} no devolvió texto`);
        continue;
      }

      const cleaned = textPart.text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError ?? new Error("Todos los modelos de OpenRouter fallaron");
}