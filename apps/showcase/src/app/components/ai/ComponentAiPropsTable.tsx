"use client";

import React from "react";
import type { AiManifestComponent } from "../../lib/ai-manifest";

type ComponentAiPropsTableProps = {
  component: AiManifestComponent;
};

export default function ComponentAiPropsTable(props: Readonly<ComponentAiPropsTableProps>) {
  const rows = props.component.sgMeta.props ?? [];
  if (rows.length === 0) return null;

  return (
    <section className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-emerald-200 bg-emerald-50/40 p-6">
      <h2 className="text-lg font-semibold">Props from AI manifest</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pequena prova de que o manifesto ja consegue alimentar documentacao real sem substituir a tabela manual.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">Prop</th>
              <th className="pb-2 pr-4 font-semibold">Type</th>
              <th className="pb-2 pr-4 font-semibold">Required</th>
              <th className="pb-2 pr-4 font-semibold">Default</th>
              <th className="pb-2 pr-4 font-semibold">Semantic role</th>
              <th className="pb-2 pr-4 font-semibold">Bindable</th>
              <th className="pb-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((prop) => (
              <tr key={prop.name}>
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="py-2 pr-4">{prop.type}</td>
                <td className="py-2 pr-4">{prop.required ? "yes" : "no"}</td>
                <td className="py-2 pr-4">{prop.default === undefined ? "-" : JSON.stringify(prop.default)}</td>
                <td className="py-2 pr-4">{prop.semanticRole ?? "-"}</td>
                <td className="py-2 pr-4">{prop.bindable === undefined ? "-" : prop.bindable ? "yes" : "no"}</td>
                <td className="py-2">{prop.description ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
