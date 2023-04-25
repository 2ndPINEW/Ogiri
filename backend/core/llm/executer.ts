import { PromptExecuter } from "simple-prompt-executer";
import { initDotEnv } from "../../util/dotenv.ts";

// MEMO: Initialize が 初期化前に必ず実行されるようにする
await initDotEnv();

export const executer = new PromptExecuter({
  openAiApiKey: Deno.env.get("OPENAI_API_KEY")!,
});
