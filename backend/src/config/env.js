import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

const jwtAccessSecret = required("JWT_ACCESS_SECRET");
if (jwtAccessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must be at least 32 characters long.");
}

// Every setting of the server is read here, once. The rest of the code imports "env".
export const env = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: required("MONGODB_URI"),
  // Optional. Only needed when your internet provider's DNS cannot reach MongoDB Atlas.
  // Example: DNS_SERVERS=8.8.8.8,1.1.1.1
  dnsServers: (process.env.DNS_SERVERS ?? "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean),
  jwtAccessSecret,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  // The website addresses that are allowed to talk to this server (comma separated)
  clientOrigins: required("CLIENT_ORIGIN")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  // "lax" works while frontend and backend run on localhost.
  // Use "none" only when they are on different domains in production (it also needs HTTPS).
  cookieSameSite: process.env.COOKIE_SAMESITE ?? "lax",

  // AI. These are optional: without them the server still runs, and AI requests answer
  // "The AI service is not set up yet." The model name is NOT written in the code on purpose,
  // because AI companies rename and retire models often.
  aiProvider: process.env.AI_PROVIDER ?? "gemini",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "",
});