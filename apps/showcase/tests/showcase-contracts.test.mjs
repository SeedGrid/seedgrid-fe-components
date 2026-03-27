import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupBoxPagePath = path.resolve(__dirname, "../src/app/components/sg-group-box/page.tsx");

test("sg-group-box showcase page types react-hook-form control as FieldValues for SeedGrid inputs", () => {
  const source = fs.readFileSync(groupBoxPagePath, "utf8");

  assert.match(source, /import\s*\{\s*useForm,\s*type\s+FieldValues\s*\}\s*from\s*"react-hook-form";/);
  assert.match(source, /useForm<FieldValues>\s*\(/);
});
