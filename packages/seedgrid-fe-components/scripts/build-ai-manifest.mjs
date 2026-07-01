import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const distRoot = path.join(packageRoot, "dist");
const manifestOutputPath = path.join(distRoot, "ai", "seedgrid-components.manifest.json");
const generatedPropsPath = path.join(packageRoot, "src", "ai-meta", "generated-props.json");

// Props extraidos do TIPO `<Export>Props` (fonte da verdade), gerados por scripts/extract-props.mjs.
async function loadGeneratedProps() {
  try {
    return JSON.parse(await readFile(generatedPropsPath, "utf8"));
  } catch {
    console.warn(`[build-ai-manifest] generated-props.json ausente em ${generatedPropsPath}; rode extract-props.mjs.`);
    return {};
  }
}

// Une a CURADORIA do .meta.ts (semanticRole/bindable/default/descricao curada) com os props
// EXTRAIDOS do tipo. Curados vem primeiro (ordem/importancia autoral) e ganham nos campos que
// possuem; os demais props reais do tipo entram em seguida — garantindo que nenhuma prop publica
// fique de fora do manifesto (e, por tabela, do MCP e da tabela de props do showcase).
function mergeProps(curated = [], generated = []) {
  const generatedByName = new Map(generated.map((p) => [p.name, p]));
  const seen = new Set();
  const out = [];
  for (const c of curated) {
    const g = generatedByName.get(c.name);
    seen.add(c.name);
    out.push({
      name: c.name,
      type: c.type ?? g?.type,
      required: c.required ?? g?.required ?? false,
      ...(c.default !== undefined ? { default: c.default } : {}),
      ...((c.description ?? g?.description) ? { description: c.description ?? g.description } : {}),
      ...(c.semanticRole ? { semanticRole: c.semanticRole } : {}),
      ...(c.bindable !== undefined ? { bindable: c.bindable } : {}),
    });
  }
  for (const g of generated) {
    if (seen.has(g.name)) continue;
    out.push({ name: g.name, type: g.type, required: g.required, ...(g.description ? { description: g.description } : {}) });
  }
  return out;
}

async function loadPackageVersion() {
  const packageJsonPath = path.join(packageRoot, "package.json");
  const packageJsonRaw = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonRaw);
  return String(packageJson.version ?? "0.0.0");
}

async function loadComponentMeta(relativeModulePath) {
  const moduleUrl = pathToFileURL(path.join(distRoot, relativeModulePath)).href;
  const module = await import(moduleUrl);

  return {
    componentId: module.sgMeta.componentId,
    exportName: module.sgMeta.exportName,
    sgMeta: module.sgMeta,
    aiHints: module.aiHints
  };
}

async function main() {
  const packageVersion = await loadPackageVersion();
  const components = await Promise.all([
    loadComponentMeta(path.join("inputs", "SgAutocomplete.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputBirthDate.meta.js")),
    loadComponentMeta(path.join("inputs", "SgCheckboxGroup.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCNPJ.meta.js")),
    loadComponentMeta(path.join("inputs", "SgCombobox.meta.js")),
    loadComponentMeta(path.join("inputs", "SgMultiSelect.meta.js")),
    loadComponentMeta(path.join("inputs", "SgMultiSelectChips.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCPF.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCPFCNPJ.meta.js")),
    loadComponentMeta(path.join("inputs", "SgDatatable.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputText.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputTextSearch.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputNumber.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCurrency.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputDate.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputEmail.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputOTP.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPassword.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPhone.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPostalCode.meta.js")),
    loadComponentMeta(path.join("inputs", "SgOrderList.meta.js")),
    loadComponentMeta(path.join("inputs", "SgPeriodSelector.meta.js")),
    loadComponentMeta(path.join("inputs", "SgPickList.meta.js")),
    loadComponentMeta(path.join("inputs", "SgRadioGroup.meta.js")),
    loadComponentMeta(path.join("inputs", "SgRating.meta.js")),
    loadComponentMeta(path.join("inputs", "SgSlider.meta.js")),
    loadComponentMeta(path.join("inputs", "SgStepperInput.meta.js")),
    loadComponentMeta(path.join("inputs", "SgTextEditor.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputTextarea.meta.js")),
    loadComponentMeta(path.join("inputs", "SgToggleSwitch.meta.js")),
    loadComponentMeta(path.join("buttons", "SgButton.meta.js")),
    loadComponentMeta(path.join("buttons", "SgFloatActionButton.meta.js")),
    loadComponentMeta(path.join("buttons", "SgSplitButton.meta.js")),
    loadComponentMeta(path.join("commons", "SgAvatar.meta.js")),
    loadComponentMeta(path.join("commons", "SgAvatarGroup.meta.js")),
    loadComponentMeta(path.join("commons", "SgBadge.meta.js")),
    loadComponentMeta(path.join("commons", "SgBadgeOverlay.meta.js")),
    loadComponentMeta(path.join("commons", "SgSkeleton.meta.js")),
    loadComponentMeta(path.join("commons", "SgToaster.meta.js")),
    loadComponentMeta(path.join("commons", "SgToastHost.meta.js")),
    loadComponentMeta(path.join("commons", "SgWhistler.meta.js")),
    loadComponentMeta(path.join("commons", "SgWhistleHost.meta.js")),
    loadComponentMeta(path.join("commons", "toast.meta.js")),
    loadComponentMeta(path.join("commons", "dismissSgToast.meta.js")),
    loadComponentMeta(path.join("commons", "subscribeSgToasts.meta.js")),
    loadComponentMeta(path.join("commons", "whistle.meta.js")),
    loadComponentMeta(path.join("commons", "dismissSgWhistle.meta.js")),
    loadComponentMeta(path.join("commons", "subscribeSgWhistles.meta.js")),
    loadComponentMeta(path.join("overlay", "SgConfirmationDialog.meta.js")),
    loadComponentMeta(path.join("overlay", "SgDialog.meta.js")),
    loadComponentMeta(path.join("overlay", "SgPopup.meta.js")),
    loadComponentMeta(path.join("layout", "SgAccordion.meta.js")),
    loadComponentMeta(path.join("layout", "SgBreadcrumb.meta.js")),
    loadComponentMeta(path.join("layout", "SgCard.meta.js")),
    loadComponentMeta(path.join("layout", "SgCarousel.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockLayout.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockScreen.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockZone.meta.js")),
    loadComponentMeta(path.join("layout", "SgExpandablePanel.meta.js")),
    loadComponentMeta(path.join("layout", "SgGrid.meta.js")),
    loadComponentMeta(path.join("layout", "SgGroupBox.meta.js")),
    loadComponentMeta(path.join("layout", "SgMenu.meta.js")),
    loadComponentMeta(path.join("layout", "SgPageControl.meta.js")),
    loadComponentMeta(path.join("layout", "SgPageControlPage.meta.js")),
    loadComponentMeta(path.join("layout", "SgPanel.meta.js")),
    loadComponentMeta(path.join("layout", "SgScreen.meta.js")),
    loadComponentMeta(path.join("layout", "SgStack.meta.js")),
    loadComponentMeta(path.join("layout", "SgToolbarIconButton.meta.js")),
    loadComponentMeta(path.join("layout", "SgTreeView.meta.js")),
    loadComponentMeta(path.join("layout", "SgToolBar.meta.js")),
    loadComponentMeta(path.join("menus", "SgDockMenu.meta.js")),
    loadComponentMeta(path.join("wizard", "SgWizard.meta.js")),
    loadComponentMeta(path.join("wizard", "SgWizardPage.meta.js")),
    loadComponentMeta(path.join("gadgets", "calendar", "SgCalendar.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "SgClock.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "SgTimeProvider.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "useSgTime.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemePicker.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "useSgClockThemeResolver.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemePreview.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemeProvider.meta.js")),
    loadComponentMeta(path.join("gadgets", "gauge", "SgLinearGauge.meta.js")),
    loadComponentMeta(path.join("gadgets", "gauge", "SgRadialGauge.meta.js")),
    loadComponentMeta(path.join("gadgets", "qr-code", "SgQRCode.meta.js")),
    loadComponentMeta(path.join("gadgets", "string-animator", "SgStringAnimator.meta.js")),
    loadComponentMeta(path.join("digits", "discard-digit", "SgDiscardDigit.meta.js")),
    loadComponentMeta(path.join("digits", "fade-digit", "SgFadeDigit.meta.js")),
    loadComponentMeta(path.join("digits", "flip-digit", "SgFlipDigit.meta.js")),
    loadComponentMeta(path.join("digits", "matrix-digit", "SgMatrixDigit.meta.js")),
    loadComponentMeta(path.join("digits", "neon-digit", "SgNeonDigit.meta.js")),
    loadComponentMeta(path.join("digits", "roller3d-digit", "SgRoller3DDigit.meta.js")),
    loadComponentMeta(path.join("digits", "segment-digit", "SgSegmentDigit.meta.js")),
    loadComponentMeta(path.join("digits", "seven-segment-digit", "SgSevenSegmentDigit.meta.js")),
    loadComponentMeta(path.join("environment", "SgEnvironmentProvider.meta.js")),
    loadComponentMeta(path.join("environment", "useSgEnvironment.meta.js")),
    loadComponentMeta(path.join("environment", "useSgNamespaceProvider.meta.js")),
    loadComponentMeta(path.join("environment", "useSgPersistence.meta.js")),
    loadComponentMeta(path.join("environment", "useSgPersistentState.meta.js")),
    loadComponentMeta(path.join("i18n", "SgComponentsI18nProvider.meta.js")),
    loadComponentMeta(path.join("i18n", "useComponentsI18n.meta.js"))
  ]);

  // Enriquece cada componente unindo a curadoria do meta com os props extraidos do tipo TS.
  const generatedProps = await loadGeneratedProps();
  let enrichedCount = 0;
  const enrichedComponents = components.map((component) => {
    const generated = generatedProps[component.exportName];
    if (!generated) return component;
    enrichedCount += 1;
    return {
      ...component,
      sgMeta: { ...component.sgMeta, props: mergeProps(component.sgMeta.props ?? [], generated) }
    };
  });
  console.log(`[build-ai-manifest] props enriquecidos a partir dos tipos em ${enrichedCount}/${components.length} componentes.`);

  const manifest = {
    schemaVersion: "0.1",
    package: "@seedgrid/fe-components",
    packageVersion,
    components: enrichedComponents
  };

  await mkdir(path.dirname(manifestOutputPath), { recursive: true });
  await writeFile(manifestOutputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`AI manifest generated at ${manifestOutputPath}`);
}

await main();
