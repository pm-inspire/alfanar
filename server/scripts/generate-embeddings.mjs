import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { createOpenAiClient, embedText } from "../lib/search/openai-embeddings.mjs";
import { normalizeArabic } from "../lib/search/arabic.mjs";

dotenv.config();

const args = process.argv.slice(2);
const sourceArg = args.find((a) => a.startsWith("--source=")) || "--source=sample";
const source = sourceArg.split("=", 2)[1];

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Set it in your .env file.");
  process.exit(1);
}

const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const openai = createOpenAiClient(process.env.OPENAI_API_KEY);

function buildSearchText(p) {
  const parts = [
    p.name_ar,
    p.description,
    p.part_number,
    p.brand,
    p.car_type,
    p.section_main,
    p.section_sub,
    ...(p.compatibility?.brands || []),
    ...(p.compatibility?.car_types || []),
    ...(p.compatibility?.years || []).map(String),
  ];
  return parts.filter(Boolean).join(" | ");
}

async function runForSample() {
  const filePath = path.resolve(process.cwd(), "server/data/products.sample.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(raw);
  if (!Array.isArray(products)) throw new Error("Invalid products.sample.json");

  console.log(`Generating embeddings (${model}) for ${products.length} products...`);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const text = buildSearchText(p);
    // Normalize a bit so Arabic tokens are stable
    const input = normalizeArabic(text) || text;
    const embedding = await embedText({ client: openai, model, input });
    p.embedding = embedding;
    console.log(`- [${i + 1}/${products.length}] embedded product id=${p.id}`);
  }

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
  console.log("Done. Updated server/data/products.sample.json");
}

async function main() {
  if (source === "sample") return runForSample();
  throw new Error(`Unsupported --source=${source}. Only 'sample' is supported in this repo demo.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

