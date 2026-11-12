"use client";

import React from "react";
import I18NReady from "../components/I18NReady";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

interface ThirdPartyLib {
  name: string;
  version: string;
  license: string;
  url: string;
  description: string;
  usedIn: string;
}

type CreditsTexts = {
  title: string;
  subtitle: string;
  compliance: string;
  usedInVarious: string;
  usedInShowcase: string;
  usedInForms: string;
  rhfDescription: string;
  reactDescription: string;
  nextDescription: string;
  animateDescription: string;
};

const CREDITS_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es" | "fr", CreditsTexts> = {
  "pt-BR": {
    title: "Créditos e Bibliotecas de Terceiros",
    subtitle:
      "Listagem de todas as bibliotecas open-source utilizadas nos componentes da SeedGrid, com suas respectivas licenças e links de referência.",
    compliance:
      "Todas as bibliotecas listadas acima são distribuídas sob licenças compatíveis com uso open-source e comercial. Os créditos acima são fornecidos conforme exigido por cada licenca.",
    usedInVarious: "Vários componentes",
    usedInShowcase: "App showcase",
    usedInForms: "Campos de formulário",
    rhfDescription:
      "Gerenciamento de formulários para React com validação, usado por baixo dos campos (Controller). Peer dependency do pacote.",
    reactDescription: "Biblioteca para construir interfaces de usuário; base de todos os componentes.",
    nextDescription: "Framework React usado pelo app showcase.",
    animateDescription: "Plugin do Tailwind com utilitários de animação (animate-in, fade, slide) usados nas transições do app showcase."
  },
  "pt-PT": {
    title: "Créditos e Bibliotecas de Terceiros",
    subtitle:
      "Lista de todas as bibliotecas open-source usadas nos componentes da SeedGrid, com as respetivas licenças e links de referência.",
    compliance:
      "Todas as bibliotecas acima são distribuídas sob licenças compatíveis com uso open-source e comercial. Estes créditos são apresentados conforme exigido por cada licenca.",
    usedInVarious: "Vários componentes",
    usedInShowcase: "App showcase",
    usedInForms: "Campos de formulário",
    rhfDescription:
      "Gestão de formulários para React com validação, usada por baixo dos campos (Controller). Peer dependency do pacote.",
    reactDescription: "Biblioteca para construir interfaces de utilizador; base de todos os componentes.",
    nextDescription: "Framework React usada pela app showcase.",
    animateDescription: "Plugin do Tailwind com utilitários de animação (animate-in, fade, slide) usados nas transições da app showcase."
  },
  "en-US": {
    title: "Credits and Third-Party Libraries",
    subtitle:
      "List of all open-source libraries used by SeedGrid components, with their licenses and reference links.",
    compliance:
      "All libraries listed above are distributed under licenses compatible with open-source and commercial use. Credits are provided as required by each license.",
    usedInVarious: "Various components",
    usedInShowcase: "Showcase app",
    usedInForms: "Form fields",
    rhfDescription:
      "Form state management and validation for React, used under the hood by the form fields (Controller). Peer dependency of the package.",
    reactDescription: "Library for building user interfaces; the foundation of every component.",
    nextDescription: "React framework used by the Showcase app.",
    animateDescription: "Tailwind plugin with animation utilities (animate-in, fade, slide) used for the Showcase app transitions."
  },
  es: {
    title: "Créditos y Bibliotecas de Terceros",
    subtitle:
      "Listado de todas las bibliotecas open-source usadas en los componentes de SeedGrid, con sus licencias y enlaces de referencia.",
    compliance:
      "Todas las bibliotecas listadas arriba se distribuyen con licencias compatibles con uso open-source y comercial. Los créditos se muestran según lo exigido por cada licencia.",
    usedInVarious: "Varios componentes",
    usedInShowcase: "App showcase",
    usedInForms: "Campos de formulario",
    rhfDescription:
      "Gestión de formularios para React con validación, usada por debajo de los campos (Controller). Peer dependency del paquete.",
    reactDescription: "Biblioteca para construir interfaces de usuario; base de todos los componentes.",
    nextDescription: "Framework de React usado por la app showcase.",
    animateDescription: "Plugin de Tailwind con utilidades de animación (animate-in, fade, slide) usadas en las transiciones de la app showcase."
  },
  fr: {
    title: "Crédits et bibliothèques tierces",
    subtitle:
      "Liste de toutes les bibliothèques open-source utilisées par les composants SeedGrid, avec leurs licences et leurs liens de référence.",
    compliance:
      "Toutes les bibliothèques listées ci-dessus sont distribuées sous des licences compatibles avec un usage open-source et commercial. Les crédits sont fournis comme exigé par chaque licence.",
    usedInVarious: "Divers composants",
    usedInShowcase: "Application vitrine",
    usedInForms: "Champs de formulaire",
    rhfDescription:
      "Gestion de formulaires et validation pour React, utilisee en interne par les champs (Controller). Peer dependency du paquet.",
    reactDescription: "Bibliotheque pour construire des interfaces utilisateur ; base de tous les composants.",
    nextDescription: "Framework React utilisé par l'application vitrine.",
    animateDescription: "Plugin Tailwind avec des utilitaires d'animation (animate-in, fade, slide) utilises pour les transitions de l'application vitrine."
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof CREDITS_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es" || locale === "fr";
}

const LICENSE_COLORS: Record<string, string> = {
  MIT: "bg-emerald-100 text-emerald-800",
  "Apache-2.0": "bg-sky-100 text-sky-800",
  ISC: "bg-violet-100 text-violet-800"
};

export default function CreditsPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof CREDITS_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = CREDITS_TEXTS[locale];

  const thirdPartyLibs: ThirdPartyLib[] = [
    {
      name: "react-hook-form",
      version: "7.x",
      license: "MIT",
      url: "https://react-hook-form.com/",
      description: texts.rhfDescription,
      usedIn: texts.usedInForms
    },
    {
      name: "react",
      version: "18.2+ / 19",
      license: "MIT",
      url: "https://react.dev/",
      description: texts.reactDescription,
      usedIn: texts.usedInVarious
    },
    {
      name: "next",
      version: "15.x",
      license: "MIT",
      url: "https://nextjs.org/",
      description: texts.nextDescription,
      usedIn: texts.usedInShowcase
    },
    {
      name: "@pqina/flip",
      version: "1.8.4",
      license: "MIT",
      url: "https://pqina.nl/flip/",
      description: "Beautifully animated flip clock component. Powers the flip animation in SgFlipDigit.",
      usedIn: "SgFlipDigit"
    },
    {
      name: "@codesandbox/sandpack-react",
      version: "2.x",
      license: "Apache-2.0",
      url: "https://sandpack.codesandbox.io/",
      description: "In-browser code editor and live preview used in the interactive playground.",
      usedIn: "SgPlayground"
    },
    {
      name: "tailwindcss",
      version: "3.x",
      license: "MIT",
      url: "https://tailwindcss.com/",
      description: "Utility-first CSS framework used by the Showcase app.",
      usedIn: texts.usedInShowcase
    },
    {
      name: "tailwindcss-animate",
      version: "1.x",
      license: "MIT",
      url: "https://github.com/jamiebuilds/tailwindcss-animate",
      description: texts.animateDescription,
      usedIn: texts.usedInShowcase
    },
    {
      name: "qrcode.react",
      version: "4.x",
      license: "ISC",
      url: "https://github.com/zpao/qrcode.react",
      description: "Browser-safe React QR code renderer (SVG/Canvas).",
      usedIn: "SgQRCode"
    },
    {
      name: "@tiptap/react",
      version: "2.x",
      license: "MIT",
      url: "https://tiptap.dev/",
      description: "Headless, framework-agnostic rich text editor built on ProseMirror.",
      usedIn: "SgTextEditor"
    },
    {
      name: "lucide-react",
      version: "0.468+",
      license: "ISC",
      url: "https://lucide.dev/",
      description: "Clean and consistent icon library used throughout the component set.",
      usedIn: texts.usedInVarious
    },
    {
      name: "@dnd-kit/core",
      version: "6.x",
      license: "MIT",
      url: "https://dndkit.com/",
      description: "Lightweight, performant drag and drop toolkit with Pointer Events support, enabling mobile-friendly drag interactions.",
      usedIn: texts.usedInVarious
    }
  ];

  return (
    <I18NReady>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{texts.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{texts.subtitle}</p>
        </div>

        <div className="space-y-4">
          {thirdPartyLibs.map((lib) => (
            <div
              key={lib.name}
              className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <a
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-base font-semibold text-primary hover:underline"
                  >
                    {lib.name}
                  </a>
                  <span className="text-xs text-muted-foreground">v{lib.version}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "rounded px-2 py-0.5 text-xs font-medium",
                      LICENSE_COLORS[lib.license] ?? "bg-gray-100 text-gray-700"
                    ].join(" ")}
                  >
                    {lib.license}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {lib.usedIn}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{lib.description}</p>
              <a
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                {lib.url}
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p>{texts.compliance}</p>
        </div>
      </div>
    </I18NReady>
  );
}
