import fs from "fs";
import path from "path";

const SAMPLE_PRODUCTS_PATH = path.resolve(process.cwd(), "server/data/products.sample.json");

export async function loadProductsFromSampleFile() {
  const raw = fs.readFileSync(SAMPLE_PRODUCTS_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Invalid products.sample.json");
  return parsed;
}

export async function saveProductsToSampleFile(products) {
  const dir = path.dirname(SAMPLE_PRODUCTS_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SAMPLE_PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf8");
}

