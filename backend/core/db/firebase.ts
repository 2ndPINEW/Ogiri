import { initializeApp } from "firebase-app";
import { getFirestore } from "firebase-firestore";
import { initDotEnv } from "../../util/dotenv.ts";

// MEMO: Initialize が Firebaseの初期化前に必ず実行されるようにする
await initDotEnv();

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
});

export const db = getFirestore(app);
