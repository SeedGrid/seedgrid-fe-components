"use client";

import React from "react";
import type { AiManifestComponent } from "../../lib/ai-manifest";
import { t, useShowcaseI18n } from "../../../i18n";
import { aiMetaText } from "../../../i18n/ai-meta";

type ComponentAiSummaryProps = {
  component: AiManifestComponent;
};

export default function ComponentAiSummary(props: Readonly<ComponentAiSummaryProps>) {
  const { component } = props;
  const i18n = useShowcaseI18n();
  const tx = (text: string) => aiMetaText(i18n.locale, text);
  const defaultProps = component.sgMeta.sdui?.defaultProps;

  return (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-300 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
          IA-Ready Pilot
        </span>
        <span className="rounded-full border border-emerald-200 px-2 py-0.5 text-xs">
          {component.sgMeta.category}
          {component.sgMeta.subcategory ? ` / ${component.sgMeta.subcategory}` : ""}
        </span>
      </div>

      <p className="mt-3">{tx(component.sgMeta.description)}</p>

      {component.sgMeta.fieldSemantics && component.sgMeta.fieldSemantics.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{t(i18n, "showcase.ai.fieldSemantics")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {component.sgMeta.fieldSemantics.map((semantic) => (
              <span
                key={semantic}
                className="rounded-full border border-emerald-200 bg-white/70 px-2 py-0.5 text-xs"
              >
                {semantic}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{t(i18n, "showcase.ai.preferredUseCases")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {component.aiHints.preferredUseCases.map((useCase) => (
              <li key={useCase}>{tx(useCase)}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{t(i18n, "showcase.ai.avoidUseCases")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {(component.aiHints.avoidUseCases ?? []).map((useCase) => (
              <li key={useCase}>{tx(useCase)}</li>
            ))}
          </ul>
        </div>
      </div>

      {component.sgMeta.sdui ? (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white/60 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">SDUI</p>
          <p className="mt-2">
            <span className="font-medium">{t(i18n, "showcase.ai.renderer")}:</span> {component.sgMeta.sdui.rendererType}
          </p>
          {defaultProps ? (
            <div className="mt-2">
              <p>
                <span className="font-medium">{t(i18n, "showcase.ai.defaultProps")}:</span>
              </p>
              <pre className="mt-1 overflow-x-auto rounded bg-emerald-950/5 p-2 text-xs">
                {JSON.stringify(defaultProps, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
