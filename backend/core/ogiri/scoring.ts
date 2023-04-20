import { executePrompt } from "../llm/openai.ts";

export const scoring = async (
  odai: string,
  answer: string
): Promise<{
  score: string;
  reason: string;
}> => {
  const prompt = {
    command: `以下の大喜利を採点してください、採点理由はなるべく褒めて伸ばすようにしてください
    [お題]
    ${odai}
  
    [回答]
    ${answer}`,
    response: {
      score: "0 ~ 100",
      reason: "採点理由",
    },
  } as const;

  const result = await executePrompt(prompt);
  return result;
};
