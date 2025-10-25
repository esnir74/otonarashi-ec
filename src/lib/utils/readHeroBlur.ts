import fs from "node:fs";
export function readHeroBlur(filePath: string): string | undefined {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return undefined;
  }
}
