import { executer } from "../llm/executer.ts";

export const generate = async (): Promise<string> => {
  const prompt = {
    prompt: `大喜利のお題を一つ考えてください。`,
    response: {
      result: {
        example: "こんなスタバは嫌だ、何が出てくる？",
        description: "お題",
      },
    },
  } as const;

  const result = await executer.execute(prompt);
  return result.result;
};
