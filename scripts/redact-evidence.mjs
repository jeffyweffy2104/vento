import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SECRET_KEY = /^(authorization|cookie|set-cookie|x-api-key|api[-_]?key|token|access[-_]?token|refresh[-_]?token|password|secret)$/i;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE = /(?<!\w)(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?!\w)/g;
const BEARER = /Bearer\s+[A-Za-z0-9._~+/=-]+/gi;

export function redactText(value) {
  return value
    .replace(BEARER, "Bearer [REDACTED]")
    .replace(EMAIL, "[REDACTED_EMAIL]")
    .replace(PHONE, "[REDACTED_PHONE]");
}

export function redactEvidence(value, key = "") {
  if (SECRET_KEY.test(key)) return "[REDACTED]";
  if (typeof value === "string") return redactText(value);
  if (Array.isArray(value)) return value.map((item) => redactEvidence(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, redactEvidence(child, childKey)]));
  }
  return value;
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    throw new Error("Usage: npm run evidence:redact -- <input.json> <output.json>");
  }
  const source = JSON.parse(await readFile(resolve(input), "utf8"));
  await writeFile(resolve(output), `${JSON.stringify(redactEvidence(source), null, 2)}\n`, { flag: "wx" });
}

if (process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
