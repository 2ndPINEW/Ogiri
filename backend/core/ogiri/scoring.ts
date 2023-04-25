import { executer } from "../llm/executer.ts";

export const scoring = async (
  odai: string,
  answer: string
): Promise<{
  score: string;
  reason: string;
}> => {
  const prompt = {
    prompt: `以下の大喜利を採点してください、採点理由はなるべく褒めて伸ばすようにしてください
    [お題]
    ${odai}
    
    [回答]
    ${answer}`,
    exampleDescription: "こんなスタバは嫌だというお題に対しての解答例",
    response: {
      score: {
        example: "70",
        description: "0 ~ 100",
      },
      reason: {
        example: "家系ラーメンが出てくる",
        description: "採点理由",
      },
    },
  } as const;

  const result = await executer.execute(prompt);
  return result;
};
