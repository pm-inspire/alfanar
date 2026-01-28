import fs from "fs";
import path from "path";

const CONFIG_PATH = path.resolve(process.cwd(), "server/storage/config.json");

export function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      aiSearchEnabled: parsed.aiSearchEnabled !== false,
    };
  } catch {
    return {
      aiSearchEnabled: true,
    };
  }
}

export function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

