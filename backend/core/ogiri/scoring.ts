import { executer } from "../llm/executer.ts";

export const scoring = async (
  odai: string,
  answer: string
): Promise<{
  score: string;
  reason: string;
}> => {
  const prompt = {
    prompt: `以下の大喜利を採点してください、得点少し厳し目に、採点理由はなるべく褒めて伸ばすようにしてください
    [お題]
    ${odai}
    
    [回答]
    ${answer}`,
    exampleDescription:
      "こんなスタバは嫌だというお題に対して「家系ラーメンが出てくる」と回答があった時の採点",
    response: {
      score: {
        example: "70",
        description: "0 ~ 100の特典",
      },
      reason: {
        example: "独創的なアイデアな上に意外性もあってよかったです。",
        description: "採点理由",
      },
    },
  } as const;

  const result = await executer.execute(prompt);
  return result;
};
