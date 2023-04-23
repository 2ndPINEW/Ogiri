import { executePrompt } from "../llm/openai.ts";

export const generate = async (): Promise<string> => {
  const prompt = {
    command: `大喜利のお題を一つ考えてください。`,
    response: {
      result: "お題",
    },
  } as const;

  const result = await executePrompt(prompt);
  return result.result;
};
