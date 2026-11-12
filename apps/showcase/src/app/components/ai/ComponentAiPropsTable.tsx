"use client";

import React from "react";
import type { AiManifestComponent } from "../../lib/ai-manifest";
import { t, useShowcaseI18n } from "../../../i18n";
import { aiMetaText } from "../../../i18n/ai-meta";

type ComponentAiPropsTableProps = {
  component: AiManifestComponent;
};

export default function ComponentAiPropsTable(props: Readonly<ComponentAiPropsTableProps>) {
  const i18n = useShowcaseI18n();
  const rows = props.component.sgMeta.props ?? [];
  if (rows.length === 0) return null;

  return (
    <section className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border bg-muted/40 p-6">
      <h2 className="text-lg font-semibold">{t(i18n, "showcase.ai.propsTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(i18n, "showcase.ai.propsIntro")}
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.prop")}</th>
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.type")}</th>
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.required")}</th>
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.default")}</th>
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.semanticRole")}</th>
              <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.ai.col.bindable")}</th>
              <th className="pb-2 font-semibold">{t(i18n, "showcase.ai.col.description")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((prop) => (
              <tr key={prop.name}>
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="py-2 pr-4">{prop.type}</td>
                <td className="py-2 pr-4">{prop.required ? t(i18n, "showcase.ai.yes") : t(i18n, "showcase.ai.no")}</td>
                <td className="py-2 pr-4">{prop.default === undefined ? "-" : JSON.stringify(prop.default)}</td>
                <td className="py-2 pr-4">{prop.semanticRole ?? "-"}</td>
                <td className="py-2 pr-4">{prop.bindable === undefined ? "-" : prop.bindable ? t(i18n, "showcase.ai.yes") : t(i18n, "showcase.ai.no")}</td>
                <td className="py-2">{aiMetaText(i18n.locale, prop.description) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
