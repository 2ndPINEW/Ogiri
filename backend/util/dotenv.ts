import * as dotenv from "dotenv";

export const initDotEnv = async () => {
  await dotenv.config({
    export: true,
  });
};
