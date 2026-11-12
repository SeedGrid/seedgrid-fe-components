"use client";

import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgButton, SgGrid, SgStack, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import { t, useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const TOGGLE_SWITCH_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgToggleSwitchFromLib = (SeedGrid as Record<string, unknown>).SgToggleSwitch as
  | React.ComponentType<any>
  | undefined;

function LocalFallback(props: {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  enabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        id={props.id}
        type="checkbox"
        checked={Boolean(props.checked)}
        disabled={props.enabled === false}
        readOnly={props.readOnly}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
      <span>{props.label}</span>
    </label>
  );
}

export default function App() {
  const hasToggle = typeof SgToggleSwitchFromLib === "function";
  const Toggle = (hasToggle ? SgToggleSwitchFromLib : LocalFallback) as React.ComponentType<any>;
  const [checked, setChecked] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(true);
  const [captured, setCaptured] = React.useState("(none)");

  return (
    <div className="space-y-4 p-2">
      {!hasToggle ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgToggleSwitch ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <Toggle
        id="toggle-playground"
        label="Exemplo dinamico"
        checked={checked}
        onChange={(next: boolean) => {
          setChecked(next);
          setCaptured("onChange -> " + String(next));
        }}
        enabled={enabled}
        readOnly={readOnly}
        required={required}
        onIcon={showIcons ? "ON" : undefined}
        offIcon={showIcons ? "OFF" : undefined}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setChecked(true)}
        >
          Set true
        </button>
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setChecked(false)}
        >
          Set false
        </button>
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setChecked((prev) => !prev)}
        >
          Toggle
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          enabled
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
          required
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={showIcons} onChange={(e) => setShowIcons(e.target.checked)} />
          icons
        </label>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>value:</strong> {String(checked)}</div>
        <div><strong>captured:</strong> {captured}</div>
      </div>
    </div>
  );
}`;

const BASIC_SHOWCASE_CODE = `import * as React from "react";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(false);

  return (
    <div>
      <SgToggleSwitch
        id="demo-basic"
        label="Ativar notificações"
        checked={value}
        onChange={setValue}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const ICONS_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(true);

  return (
    <div>
      <SgToggleSwitch
        id="demo-icons"
        label="Status da conta"
        checked={value}
        onChange={setValue}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const REMOTE_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  const handleRemoteToggle = (nextValue: boolean) => {
    setValue(nextValue);
    setLoading(true);
    setTimeout(() => {
      setLog((prev) => ["value=" + String(nextValue), ...prev].slice(0, 8));
      setLoading(false);
    }, 450);
  };

  return (
    <div>
      <SgToggleSwitch
        id="demo-remote"
        label={loading ? "Salvando..." : "Publicar automaticamente"}
        checked={value}
        onChange={handleRemoteToggle}
        enabled={!loading}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <div>{log.map((entry, index) => <div key={index}>{entry}</div>)}</div>
    </div>
  );
}`;

const EXTERNAL_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [captured, setCaptured] = React.useState("(sem evento)");

  return (
    <div>
      <SgToggleSwitch
        id="demo-external"
        label="Permitir sincronização"
        checked={value}
        onChange={(next) => {
          setValue(next);
          setCaptured("onChange -> " + String(next));
        }}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button onClick={() => setValue(true)}>Setar true</button>
      <button onClick={() => setValue(false)}>Setar false</button>
      <button onClick={() => setValue((prev) => !prev)}>Toggle externo</button>
      <button onClick={() => setCaptured("captura manual -> " + String(value))}>Capturar agora</button>

      <p>capturado: {captured}</p>
    </div>
  );
}`;

const RHF_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { useForm, type FieldValues } from "react-hook-form";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [submitResult, setSubmitResult] = React.useState("-");
  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))}>
      <SgToggleSwitch
        id="demo-rhf-register"
        name="notifications"
        label="Receber notificações por email"
        register={register}
      />

      <SgToggleSwitch
        id="demo-rhf-control"
        name="active"
        label="Conta ativa"
        control={control}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button type="submit">Enviar</button>
      <p>watch.notifications: {String(watch("notifications"))}</p>
      <p>watch.active: {String(watch("active"))}</p>
      <p>Ultimo submit: {submitResult}</p>
    </form>
  );
}`;

const DISABLED_READONLY_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgGrid, SgToggleSwitch } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <div>
      <SgToggleSwitch
        id="demo-disabled"
        label="Disabled"
        checked
        enabled={false}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <SgToggleSwitch
        id="demo-readonly"
        label="ReadOnly"
        checked={false}
        readOnly
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
    </div>
  );
}`;


type ToggleTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
};

const TOGGLE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es" | "fr", ToggleTexts> = {
  "pt-BR": {
    subtitle: "Toggle switch com suporte a ícones, estados disabled/readonly e integração com react-hook-form.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Padrão",
    propsColDescription: "Descrição",
    sectionTitles: [
      "1) Básico",
      "2) Com ícones (on/off)",
      "3) Atualização remota",
      "4) Controlado externamente + captura do valor",
      "5) Dentro de um formulário",
      "6) Desabilitado e somente leitura",
      "7) Validação",
      "8) Erro externo e largura",
      "9) Estado inicial (defaultChecked)",
      "10) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo simples controlado por estado; clique no rótulo ou na chave (Tab foca e Espaço alterna).",
      "Variação visual com ícones dentro do thumb para indicar ligado e desligado.",
      "Ao alterar a chave, simulamos uma atualização remota para representar um fluxo comum de persistência.",
      "Valor controlado por estado externo e captura via onChange.",
      "Ligado ao formulário por name + control; o valor sai no envio.",
      "Demonstra os estados enabled: false e readOnly.",
      "required valida ao sair do campo (validateOnBlur) ou a cada mudança (validateOnBlur: false).",
      "error mostra uma mensagem vinda de fora; width limita a largura do componente.",
      "defaultChecked define o estado inicial; depois disso a chave controla a si mesma (modo não controlado).",
      "Ajuste as principais props do SgToggleSwitch."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  "pt-PT": {
    subtitle: "Toggle switch com suporte a ícones, estados disabled/readonly e integração com react-hook-form.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Padrão",
    propsColDescription: "Descrição",
    sectionTitles: [
      "1) Básico",
      "2) Com ícones (on/off)",
      "3) Atualização remota",
      "4) Controlado externamente + captura do valor",
      "5) Dentro de um formulário",
      "6) Desabilitado e somente leitura",
      "7) Validação",
      "8) Erro externo e largura",
      "9) Estado inicial (defaultChecked)",
      "10) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo simples controlado por estado; clique no rótulo ou no interruptor (Tab foca e Espaço alterna).",
      "Variação visual com ícones dentro do thumb para indicar ligado e desligado.",
      "Ao alterar o interruptor, simulamos uma atualização remota para representar um fluxo comum de persistência.",
      "Valor controlado por estado externo e captura via onChange.",
      "Ligado ao formulário por name + control; o valor sai no envio.",
      "Demonstra os estados enabled: false e readOnly.",
      "required valida ao sair do campo (validateOnBlur) ou a cada alteração (validateOnBlur: false).",
      "error mostra uma mensagem vinda de fora; width limita a largura do componente.",
      "defaultChecked define o estado inicial; depois disso o interruptor controla-se a si mesmo (modo não controlado).",
      "Ajuste as principais props do SgToggleSwitch."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  "en-US": {
    subtitle: "Toggle switch with icon support, disabled/readonly states, and react-hook-form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basic",
      "2) With icons (on/off)",
      "3) Remote update",
      "4) Externally controlled + captured value",
      "5) Inside a form",
      "6) Disabled and read-only",
      "7) Validation",
      "8) External error and width",
      "9) Initial state (defaultChecked)",
      "10) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Simple example controlled by state; click the label or the switch (Tab focuses and Space toggles).",
      "Visual variation with icons inside the thumb to indicate on and off.",
      "When toggled, simulates a remote update to represent a common persistence flow.",
      "Value controlled by external state and captured via onChange.",
      "Connected to the form through name + control; the value comes out on submit.",
      "Shows the enabled: false and readOnly states.",
      "required validates on blur (validateOnBlur) or on every change (validateOnBlur: false).",
      "error shows a message that comes from outside; width limits the component width.",
      "defaultChecked sets the initial state; after that the switch manages itself (uncontrolled mode).",
      "Adjust the main SgToggleSwitch props."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  es: {
    subtitle: "Toggle switch con soporte de iconos, estados disabled/readonly e integracion con react-hook-form.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Predeterminado",
    propsColDescription: "Descripcion",
    sectionTitles: [
      "1) Básico",
      "2) Con iconos (on/off)",
      "3) Actualización remota",
      "4) Controlado externamente + captura de valor",
      "5) Dentro de un formulario",
      "6) Deshabilitado y solo lectura",
      "7) Validación",
      "8) Error externo y ancho",
      "9) Estado inicial (defaultChecked)",
      "10) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Ejemplo simple controlado por estado; haz clic en la etiqueta o en el interruptor (Tab enfoca y Espacio alterna).",
      "Variación visual con iconos dentro del thumb para indicar encendido y apagado.",
      "Al cambiar el interruptor, simulamos una actualización remota para representar un flujo común de persistencia.",
      "Valor controlado por estado externo y captura mediante onChange.",
      "Conectado al formulario con name + control; el valor sale al enviar.",
      "Muestra los estados enabled: false y readOnly.",
      "required valida al salir del campo (validateOnBlur) o en cada cambio (validateOnBlur: false).",
      "error muestra un mensaje que viene de fuera; width limita el ancho del componente.",
      "defaultChecked define el estado inicial; después el interruptor se controla a sí mismo (modo no controlado).",
      "Ajusta las props principales de SgToggleSwitch."
    ],
    playgroundTitle: "SgToggleSwitch Playground"
  },
  fr: {
    subtitle: "Interrupteur a bascule avec prise en charge des icones, etats desactive/lecture seule et integration react-hook-form.",
    examplesLabel: "Exemples",
    propsLinkLabel: "Reference des props",
    propsTitle: "Reference des props",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Defaut",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basique",
      "2) Avec icônes (on/off)",
      "3) Mise à jour distante",
      "4) Contrôlé en externe + valeur capturée",
      "5) Dans un formulaire",
      "6) Désactivé et lecture seule",
      "7) Validation",
      "8) Erreur externe et largeur",
      "9) État initial (defaultChecked)",
      "10) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemple simple contrôlé par l'état ; cliquez sur le libellé ou l'interrupteur (Tab met le focus et Espace bascule).",
      "Variation visuelle avec des icônes dans le pouce pour indiquer activé et désactivé.",
      "Lors de la bascule, simule une mise à jour distante pour représenter un flux de persistance courant.",
      "Valeur contrôlée par un état externe et capturée via onChange.",
      "Relié au formulaire par name + control ; la valeur sort à l'envoi.",
      "Montre les états enabled: false et readOnly.",
      "required valide à la sortie du champ (validateOnBlur) ou à chaque changement (validateOnBlur: false).",
      "error affiche un message venu de l'extérieur ; width limite la largeur du composant.",
      "defaultChecked définit l'état initial ; ensuite l'interrupteur se gère lui-même (mode non contrôlé).",
      "Ajustez les principales props de SgToggleSwitch."
    ],
    playgroundTitle: "SgToggleSwitch Playground",
  },
};

function isSupportedToggleLocale(locale: ShowcaseLocale): locale is keyof typeof TOGGLE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es" || locale === "fr";
}
export default function SgToggleSwitchPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgToggleSwitch");
  const locale: keyof typeof TOGGLE_TEXTS = isSupportedToggleLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = TOGGLE_TEXTS[locale];
  const [basicValue, setBasicValue] = React.useState(false);
  const [iconValue, setIconValue] = React.useState(true);
  const [externalValue, setExternalValue] = React.useState(false);
  const [capturedValue, setCapturedValue] = React.useState<string>("(sem evento)");
  const [remoteValue, setRemoteValue] = React.useState(false);
  const [remoteLoading, setRemoteLoading] = React.useState(false);
  const [remoteLog, setRemoteLog] = React.useState<string[]>([]);
  const [submitResult, setSubmitResult] = React.useState<string>("-");
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  const watchedNotifications = Boolean(watch("notifications"));
  const watchedActive = Boolean(watch("active"));

  const handleRemoteToggle = (nextValue: boolean) => {
    setRemoteValue(nextValue);
    setRemoteLoading(true);
    window.setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      setRemoteLog((prev) => [`[${timestamp}] value=${String(nextValue)}`, ...prev].slice(0, 8));
      setRemoteLoading(false);
    }, 450);
  };

  const onSubmit = (data: FieldValues) => {
    setSubmitResult(JSON.stringify(data));
  };

  const handleExternalChange = React.useCallback((nextValue: boolean) => {
    setExternalValue(nextValue);
    setCapturedValue(`onChange -> ${String(nextValue)}`);
  }, []);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, []);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        const next = Math.max(0, window.scrollY + delta);
        window.scrollTo({ top: next, behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      const next = Math.max(0, container.scrollTop + delta);
      container.scrollTo({ top: next, behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  const exampleLinks = React.useMemo(() => texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })), [texts]);

  return (
    <I18NReady>
      <div
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgToggleSwitch"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        id="exemplo-1"
        title={texts.sectionTitles[0] ?? ""}
        description={texts.sectionDescriptions[0] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-basic"
            label={t(i18n, "showcase.component.toggleSwitch.labels.enableNotifications")}
            checked={basicValue}
            onChange={setBasicValue}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {t(i18n, "showcase.component.toggleSwitch.currentValueLabel")}: <code className="rounded bg-muted px-1">{String(basicValue)}</code>
          </p>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/basico.tsx.sample" />
      </Section>

      <Section
        id="exemplo-2"
        title={texts.sectionTitles[1] ?? ""}
        description={texts.sectionDescriptions[1] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-icons"
            label={t(i18n, "showcase.component.toggleSwitch.labels.accountStatus")}
            checked={iconValue}
            onChange={setIconValue}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {t(i18n, "showcase.component.toggleSwitch.currentValueLabel")}: <code className="rounded bg-muted px-1">{String(iconValue)}</code>
          </p>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/com-icones-on-off.tsx.sample" />
      </Section>

      <Section
        id="exemplo-3"
        title={texts.sectionTitles[2] ?? ""}
        description={texts.sectionDescriptions[2] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-remote"
            label={remoteLoading ? t(i18n, "showcase.component.toggleSwitch.labels.saving") : t(i18n, "showcase.component.toggleSwitch.labels.autoPublish")}
            checked={remoteValue}
            onChange={handleRemoteToggle}
            enabled={!remoteLoading}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="mt-3 h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {remoteLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.toggleSwitch.hints.changeToLog")}
              </span>
            ) : (
              remoteLog.map((entry, index) => <div key={index}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/remote-simulacao-de-update.tsx.sample" />
      </Section>

      <Section
        id="exemplo-4"
        title={texts.sectionTitles[3] ?? ""}
        description={texts.sectionDescriptions[3] ?? ""}
      >
        <div className="rounded-md border border-border p-4 space-y-3">
          <SgToggleSwitch
            id="demo-external"
            label={t(i18n, "showcase.component.toggleSwitch.labels.allowSync")}
            checked={externalValue}
            onChange={handleExternalChange}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <SgButton appearance="outline" size="sm" onClick={() => setExternalValue(true)}>
              {t(i18n, "showcase.component.toggleSwitch.buttons.setTrue")}
            </SgButton>
            <SgButton appearance="outline" size="sm" onClick={() => setExternalValue(false)}>
              {t(i18n, "showcase.component.toggleSwitch.buttons.setFalse")}
            </SgButton>
            <SgButton appearance="outline" size="sm" onClick={() => setExternalValue((prev) => !prev)}>
              {t(i18n, "showcase.component.toggleSwitch.buttons.toggleExternal")}
            </SgButton>
            <SgButton appearance="outline" size="sm" onClick={() => setCapturedValue(t(i18n, "showcase.component.toggleSwitch.manualCapture", { value: String(externalValue) }))}>
              {t(i18n, "showcase.component.toggleSwitch.buttons.captureNow")}
            </SgButton>
          </div>
          <div className="rounded border border-border bg-foreground/5 p-2 text-xs">
            <div>{t(i18n, "showcase.component.toggleSwitch.externalValueLabel")}: <code className="rounded bg-muted px-1">{String(externalValue)}</code></div>
            <div>{t(i18n, "showcase.component.toggleSwitch.capturedLabel")}: <code className="rounded bg-muted px-1">{capturedValue}</code></div>
          </div>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/controlado-externamente-captura-do-valor.tsx.sample" />
      </Section>

      <Section
        id="exemplo-5"
        title={texts.sectionTitles[4] ?? ""}
        description={texts.sectionDescriptions[4] ?? ""}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-rhf-register"
            name="notifications"
            label={t(i18n, "showcase.component.toggleSwitch.labels.emailNotifications")}
            register={register}
          />
          <SgToggleSwitch
            id="demo-rhf-control"
            name="active"
            label={t(i18n, "showcase.component.toggleSwitch.labels.activeAccount")}
            control={control}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              {t(i18n, "showcase.component.toggleSwitch.buttons.submit")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            watch.notifications: <code className="rounded bg-muted px-1">{String(watchedNotifications)}</code>
            {" | "}
            watch.active: <code className="rounded bg-muted px-1">{String(watchedActive)}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.toggleSwitch.lastSubmitLabel")}: <code className="rounded bg-muted px-1">{submitResult}</code>
          </p>
        </form>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/react-hook-form.tsx.sample" />
      </Section>

      <Section
        id="exemplo-6"
        title={texts.sectionTitles[5] ?? ""}
        description={texts.sectionDescriptions[5] ?? ""}
      >
        <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
          <SgToggleSwitch
            id="demo-disabled"
            label="Disabled"
            checked
            enabled={false}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <SgToggleSwitch
            id="demo-readonly"
            label="ReadOnly"
            checked={false}
            readOnly
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/estados-disabled-read-only.tsx.sample" />
      </Section>

      <Section
        id="exemplo-7"
        title={texts.sectionTitles[6] ?? ""}
        description={texts.sectionDescriptions[6] ?? ""}
      >
        <SgStack gap={12} align="start">
          <SgToggleSwitch
            id="termos"
            label={t(i18n, "showcase.component.toggleSwitch.labels.acceptTerms")}
            required
            requiredMessage={t(i18n, "showcase.component.toggleSwitch.messages.acceptTerms")}
          />
          <SgToggleSwitch
            id="regra"
            label={t(i18n, "showcase.component.toggleSwitch.labels.cannotTurnOn")}
            validateOnBlur={false}
            validation={(checked) => (checked ? t(i18n, "showcase.component.toggleSwitch.messages.mustStayOff") : null)}
          />
        </SgStack>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/validacao.tsx.sample" />
      </Section>

      <Section
        id="exemplo-8"
        title={texts.sectionTitles[7] ?? ""}
        description={texts.sectionDescriptions[7] ?? ""}
      >
        <SgToggleSwitch
          id="erro"
          label={t(i18n, "showcase.component.toggleSwitch.labels.acceptTerms")}
          error={t(i18n, "showcase.component.toggleSwitch.messages.acceptTerms")}
          width={280}
        />
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/erro-externo-e-largura.tsx.sample" />
      </Section>

      <Section
        id="exemplo-9"
        title={texts.sectionTitles[8] ?? ""}
        description={texts.sectionDescriptions[8] ?? ""}
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch id="demo-default" label={t(i18n, "showcase.component.toggleSwitch.labels.news")} defaultChecked />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toggle-switch/samples/estado-inicial-defaultchecked.tsx.sample" />
      </Section>

      <Section
        id="exemplo-10"
        title={texts.sectionTitles[9] ?? ""}
        description={texts.sectionDescriptions[9] ?? ""}
      >
        <SgPlayground
          title={texts.playgroundTitle}
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-toggle-switch/sg-toggle-switch.tsx.playground"
          height={560}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">{texts.propsTitle}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{texts.propsColProp}</th>
                <th className="pb-2 pr-4 font-semibold">{texts.propsColType}</th>
                <th className="pb-2 pr-4 font-semibold">{texts.propsColDefault}</th>
                <th className="pb-2 font-semibold">{texts.propsColDescription}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.label")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">checked / defaultChecked</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.checked")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(next: boolean) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.onChange")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onIcon / offIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.icons")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.interaction")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">register / control / name</td><td className="py-2 pr-4">react-hook-form</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.toggleSwitch.props.rows.rhf")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



