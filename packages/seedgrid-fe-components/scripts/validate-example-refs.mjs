/**
 * Valida que todo `examples[].file` do manifesto de IA existe no disco.
 *
 * Existe porque essa classe de erro passou despercebida por muito tempo: metas apontando para
 * arquivos de exemplo que nunca existiram, ou que foram renomeados/movidos depois. Nada quebra
 * em build nem em runtime — o consumidor (e o seedgrid-components-mcp) so' recebe uma referencia
 * morta, e quem confia nela vai procurar um arquivo que nao esta la'.
 *
 * O `apps/showcase/scripts/validate-showcase-snippets.mjs` valida a direcao CONTRARIA
 * (sample -> pagina que o renderiza) e por isso nunca pegou nada disto.
 *
 * Roda sobre o manifesto GERADO, e nao sobre os `*.meta.ts`, de proposito: e' exatamente o
 * arquivo que o MCP serve.
 *
 * ## Baseline
 *
 * Quando este check nasceu havia 44 referencias quebradas ja' no repositorio. Reprovar o build
 * por causa delas so' faria o time desligar o check. Entao:
 *
 *   - referencia quebrada QUE ESTA no baseline  -> aviso, nao reprova
 *   - referencia quebrada QUE NAO ESTA          -> ERRO, reprova o build
 *   - entrada do baseline que ja' foi corrigida -> aviso pedindo para remover do baseline
 *
 * O baseline so' encolhe. Para regerar do zero (por exemplo depois de um mutirao de limpeza):
 *   node scripts/validate-example-refs.mjs --write-baseline
 */
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
// Os `file` do manifesto sao relativos a raiz do monorepo (ex.: "apps/showcase/src/...").
const repoRoot = path.resolve(packageRoot, "..", "..");
const manifestPath = path.join(packageRoot, "dist", "ai", "seedgrid-components.manifest.json");
const baselinePath = path.join(__dirname, "example-refs-baseline.json");

const writeBaseline = process.argv.includes("--write-baseline");

async function exists(absolutePath) {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

/** O manifesto pode expor os componentes como array ou como mapa; aceita os dois. */
function componentsOf(manifest) {
  const raw = manifest?.components ?? manifest;
  return Array.isArray(raw) ? raw : Object.values(raw ?? {});
}

/** Chave estavel de uma referencia, para casar com o baseline. */
function keyOf(componentName, file) {
  return `${componentName}::${file}`;
}

async function loadBaseline() {
  try {
    const parsed = JSON.parse(await readFile(baselinePath, "utf8"));
    return new Set(parsed.knownBroken ?? []);
  } catch {
    return new Set();
  }
}

async function main() {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    console.error(
      `[validate-example-refs] manifesto ausente em ${manifestPath}; rode build-ai-manifest.mjs antes.`
    );
    process.exit(1);
  }

  const baseline = await loadBaseline();
  const brokenKeys = [];
  const novos = [];
  let checked = 0;

  for (const component of componentsOf(manifest)) {
    const name = component?.exportName ?? component?.componentId ?? "(sem nome)";
    for (const example of component?.sgMeta?.examples ?? []) {
      if (!example?.file) continue;
      checked += 1;
      if (await exists(path.join(repoRoot, example.file))) continue;

      const key = keyOf(name, example.file);
      brokenKeys.push(key);
      if (!baseline.has(key)) {
        novos.push({ component: name, id: example.id ?? "(sem id)", file: example.file });
      }
    }
  }

  if (writeBaseline) {
    await writeFile(
      baselinePath,
      `${JSON.stringify(
        {
          _comentario:
            "Referencias de exemplo quebradas ja' existentes quando o check nasceu. O check reprova apenas referencias NOVAS; estas ficam como aviso ate' serem corrigidas. Esta lista so' deve encolher.",
          knownBroken: brokenKeys.sort()
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    console.log(`[validate-example-refs] baseline regravado com ${brokenKeys.length} referencia(s).`);
    return;
  }

  // Entradas do baseline que ja' foram corrigidas: pede limpeza, mas nao reprova.
  const corrigidas = [...baseline].filter((key) => !brokenKeys.includes(key));
  if (corrigidas.length > 0) {
    console.warn(
      `[validate-example-refs] ${corrigidas.length} entrada(s) do baseline ja' foram corrigidas. ` +
        "Rode com --write-baseline para limpar."
    );
  }

  if (novos.length > 0) {
    console.error(
      `\n[validate-example-refs] ${novos.length} referencia(s) NOVA(S) de exemplo apontam para arquivos que nao existem:\n`
    );
    for (const { component, id, file } of novos) {
      console.error(`  ${component} -> examples[id="${id}"]`);
      console.error(`    ${file}\n`);
    }
    console.error("Corrija o `file` no *.meta.ts do componente, ou crie o sample.\n");
    process.exit(1);
  }

  const conhecidas = brokenKeys.length;
  console.log(
    `[validate-example-refs] ${checked} referencia(s) conferidas; nenhuma quebra nova.` +
      (conhecidas > 0 ? ` ${conhecidas} pendencia(s) conhecida(s) no baseline.` : "")
  );
}

await main();
