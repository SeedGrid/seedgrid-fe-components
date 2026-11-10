import type { ThemeVars } from "./ThemeConfig";
import { adjustBgForOnColor, pickOnColor, rgbToHex, toRgbVarValue } from "./colorUtils";

/**
 * Generate component-level tokens from base palette tokens.
 * This creates semantic aliases like --sg-btn-primary-bg, --sg-input-border, etc.
 * so components can use consistent tokens without choosing specific stops (600/700) manually.
 */
export function generateComponentTokens(baseVars: ThemeVars): ThemeVars {
  const componentVars: ThemeVars = {};

  // Helper to wrap RGB values
  const rgb = (varName: string) => {
    const value = baseVars[varName];
    return value ? `rgb(${value})` : "";
  };

  // Botao de severidade: fundo (tom 600), hover (700) e active (800). Se o melhor texto sobre o fundo ficar < 4,5:1,
  // o fundo e ajustado (adjustBgForOnColor) e o texto de cada estado e escolhido por contraste sobre o PROPRIO
  // fundo daquele estado. Sem fundo valido, cai no --sg-on-* informado (normal) ou no texto do estado normal.
  const parseRgb = (varName: string) => /^\s*(\d+)\s+(\d+)\s+(\d+)\s*$/.exec(baseVars[varName] ?? "");
  const stateColors = (varName: string) => {
    const m = parseRgb(varName);
    if (!m) return null;
    const bgHex = adjustBgForOnColor(rgbToHex(Number(m[1]), Number(m[2]), Number(m[3])));
    return { bg: `rgb(${toRgbVarValue(bgHex)})`, fg: `rgb(${toRgbVarValue(pickOnColor(bgHex))})` };
  };
  const severity = (token: string, scale: string, fallbackOnVarName: string) => {
    const normal = stateColors(`--sg-${scale}-600`);
    const hover = stateColors(`--sg-${scale}-700`);
    const active = stateColors(`--sg-${scale}-800`);
    const normalBg = normal?.bg ?? rgb(`--sg-${scale}-600`);
    const normalFg = normal?.fg ?? rgb(fallbackOnVarName);
    componentVars[`--sg-btn-${token}-bg`] = normalBg;
    componentVars[`--sg-btn-${token}-fg`] = normalFg;
    componentVars[`--sg-btn-${token}-border`] = normalBg;
    componentVars[`--sg-btn-${token}-hover-bg`] = hover?.bg ?? rgb(`--sg-${scale}-700`);
    componentVars[`--sg-btn-${token}-hover-fg`] = hover?.fg ?? normalFg;
    componentVars[`--sg-btn-${token}-active-bg`] = active?.bg ?? rgb(`--sg-${scale}-800`);
    componentVars[`--sg-btn-${token}-active-fg`] = active?.fg ?? normalFg;
    componentVars[`--sg-btn-${token}-ring`] = rgb(`--sg-${scale}-400`);
  };

  severity("primary", "primary", "--sg-on-primary");
  severity("secondary", "secondary", "--sg-on-secondary");
  severity("success", "success", "--sg-on-success");
  severity("info", "info", "--sg-on-info");
  severity("warning", "warning", "--sg-on-warning");
  severity("danger", "error", "--sg-on-error");
  // Help usa o terciario, para melhor visibilidade.
  severity("help", "tertiary", "--sg-on-tertiary");

  // Plain/Ghost button
  componentVars["--sg-btn-plain-bg"] = "transparent";
  componentVars["--sg-btn-plain-fg"] = rgb("--sg-text");
  componentVars["--sg-btn-plain-border"] = rgb("--sg-border");
  componentVars["--sg-btn-plain-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-btn-plain-active-bg"] = rgb("--sg-border");
  componentVars["--sg-btn-plain-ring"] = rgb("--sg-ring");

  // Input tokens
  componentVars["--sg-input-bg"] = rgb("--sg-surface");
  componentVars["--sg-input-fg"] = rgb("--sg-text");
  componentVars["--sg-input-border"] = rgb("--sg-border");
  componentVars["--sg-input-border-hover"] = rgb("--sg-primary-400");
  componentVars["--sg-input-border-focus"] = rgb("--sg-primary-600");
  componentVars["--sg-input-ring"] = rgb("--sg-ring");
  componentVars["--sg-input-placeholder"] = rgb("--sg-muted");
  componentVars["--sg-input-disabled-bg"] = rgb("--sg-disabled");
  componentVars["--sg-input-disabled-fg"] = rgb("--sg-on-disabled");

  // Card tokens
  componentVars["--sg-card-bg"] = rgb("--sg-surface");
  componentVars["--sg-card-fg"] = rgb("--sg-text");
  componentVars["--sg-card-border"] = rgb("--sg-border");
  componentVars["--sg-card-header-bg"] = rgb("--sg-muted-surface");

  // Alert/Banner tokens
  componentVars["--sg-alert-info-bg"] = rgb("--sg-info-100");
  componentVars["--sg-alert-info-fg"] = rgb("--sg-info-700");
  componentVars["--sg-alert-info-border"] = rgb("--sg-info-300");

  componentVars["--sg-alert-success-bg"] = rgb("--sg-success-100");
  componentVars["--sg-alert-success-fg"] = rgb("--sg-success-700");
  componentVars["--sg-alert-success-border"] = rgb("--sg-success-300");

  componentVars["--sg-alert-warning-bg"] = rgb("--sg-warning-100");
  componentVars["--sg-alert-warning-fg"] = rgb("--sg-warning-700");
  componentVars["--sg-alert-warning-border"] = rgb("--sg-warning-300");

  componentVars["--sg-alert-error-bg"] = rgb("--sg-error-100");
  componentVars["--sg-alert-error-fg"] = rgb("--sg-error-700");
  componentVars["--sg-alert-error-border"] = rgb("--sg-error-300");

  // Badge tokens
  componentVars["--sg-badge-bg"] = rgb("--sg-badge");
  componentVars["--sg-badge-fg"] = rgb("--sg-on-badge");

  // Tooltip tokens
  componentVars["--sg-tooltip-bg"] = rgb("--sg-tooltip");
  componentVars["--sg-tooltip-fg"] = rgb("--sg-on-tooltip");

  // Modal/Dialog tokens
  componentVars["--sg-modal-bg"] = rgb("--sg-surface");
  componentVars["--sg-modal-fg"] = rgb("--sg-text");
  componentVars["--sg-modal-overlay"] = "rgb(0 0 0)";

  // Dropdown/Menu tokens
  componentVars["--sg-menu-bg"] = rgb("--sg-surface");
  componentVars["--sg-menu-fg"] = rgb("--sg-text");
  componentVars["--sg-menu-border"] = rgb("--sg-border");
  componentVars["--sg-menu-item-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-menu-item-active-bg"] = rgb("--sg-primary-100");

  // Table tokens
  componentVars["--sg-table-bg"] = rgb("--sg-surface");
  componentVars["--sg-table-fg"] = rgb("--sg-text");
  componentVars["--sg-table-border"] = rgb("--sg-border");
  componentVars["--sg-table-header-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-table-row-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-table-row-selected-bg"] = rgb("--sg-primary-100");

  return componentVars;
}

