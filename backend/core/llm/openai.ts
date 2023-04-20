const fetchApi = async (opt: { prompt: string; modelName?: string }) => {
  const body = {
    messages: [
      {
        role: "user",
        content: opt.prompt,
      },
    ],
    model: opt.modelName ?? "gpt-3.5-turbo",
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("OpenAI API error");
  }

  const json = await res.json();
  return json.choices[0].message.content;
};

type Prompt = {
  readonly command: string;
  readonly response: {
    readonly [key: string]: string;
  };
  model?: string;
};

export const executePrompt = async <T extends Prompt>(
  opt: T
): Promise<{ [k in keyof T["response"]]: string }> => {
  const responseFormats = Object.keys(opt.response)
    .map((key) => {
      return `${key}: ${opt.response[key]}`;
    })
    .join("\n");

  const prompt = `${opt.command}


  以下の形式で回答してください
  \`\`\`
  ${responseFormats}
  \`\`\``;

  const result = await fetchApi({ prompt });
  const resultLines = result.split("\n");
  const response = {} as { [k in keyof T["response"]]: string };
  Object.keys(opt.response).forEach((key) => {
    const line = resultLines.find((line: string) =>
      line.startsWith(`${key}: `)
    );
    if (!line) {
      throw new Error("Invalid response format");
    }
    response[key] = line.replace(`${key}: `, "");
  });

  return response;
};
