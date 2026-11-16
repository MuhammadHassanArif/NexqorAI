import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { createApp } from "./app.js";

async function start() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Could not start the server:", error);
  process.exit(1);
});