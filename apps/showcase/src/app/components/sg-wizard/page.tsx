"use client";

import React from "react";
import { MapPin, Tag, Send } from "lucide-react";
import {
  SgInputEmail,
  SgInputPhone,
  SgInputText,
  SgWizard,
  SgWizardPage,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

/** Demo de `nextDisabled`: checagem assincrona que, ao terminar, mantem o avanco bloqueado. */
function NextDisabledDemo() {
  const i18n = useShowcaseI18n();
  const [codigo, setCodigo] = React.useState("");
  const [checando, setChecando] = React.useState(false);
  const [jaUsado, setJaUsado] = React.useState(false);

  async function verificarCodigo() {
    if (!codigo.trim()) return;
    setChecando(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setJaUsado(codigo.trim().toUpperCase() === "SG-123");
    setChecando(false);
  }

  return (
    <SgWizard nextDisabled={jaUsado} onFinish={() => undefined}>
      <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.inviteStep")}>
        <SgInputText
          id="wizard-codigo-convite"
          label={t(i18n, "showcase.component.wizard.demo.inviteCodeLabel")}
          error={jaUsado ? t(i18n, "showcase.component.wizard.demo.codeUsed") : undefined}
          onChange={(value) => {
            setCodigo(value);
            setJaUsado(false);
          }}
          onExit={() => void verificarCodigo()}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {checando
            ? t(i18n, "showcase.component.wizard.demo.checkingCode")
            : t(i18n, "showcase.component.wizard.demo.codeHint")}
        </p>
      </SgWizardPage>
      <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.conclusionStep")}>
        <div className="rounded border border-border bg-foreground/5 p-4">
          <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.demo.codeAccepted")}</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(i18n, "showcase.component.wizard.demo.codeAcceptedText")}
          </p>
        </div>
      </SgWizardPage>
    </SgWizard>
  );
}

const WIZARD_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "ReactNode (SgWizardPage[])", defaultValue: "-", description: "Paginas renderizadas em ordem dentro do wizard." },
  { prop: "initialStep", type: "number", defaultValue: "0", description: "Indice inicial da etapa ativa." },
  { prop: "stepper", type: "\"numbered\" | \"icons\" | \"none\"", defaultValue: "\"none\"", description: "Modo visual do stepper." },
  { prop: "stepNavigation", type: "\"none\" | \"previous\" | \"previous-and-next\"", defaultValue: "\"previous-and-next\"", description: "Controla quais etapas do stepper podem ser clicadas." },
  { prop: "labels", type: "{ next, previous, finish }", defaultValue: "interno", description: "Override dos textos dos botoes de navegacao." },
  { prop: "validateStep", type: "(stepIndex) => boolean", defaultValue: "-", description: "Valida uma etapa antes de avancar." },
  { prop: "onBeforeNext", type: "(stepIndex) => boolean | Promise<boolean>", defaultValue: "-", description: "Hook antes de avancar para a proxima etapa. So age no clique; enquanto e aguardado, o botao fica desabilitado." },
  { prop: "onBeforeFinish", type: "(stepIndex) => boolean | Promise<boolean>", defaultValue: "-", description: "Hook antes de concluir o wizard." },
  { prop: "enabled", type: "boolean", defaultValue: "true", description: "Habilita o wizard como um todo. Com false, Anterior, Proximo, Concluir e os passos do stepper nao respondem; a etapa atual segue visivel." },
  { prop: "nextDisabled", type: "boolean", defaultValue: "false", description: "Desabilita o avanco de forma declarativa (botao Proximo + etapas seguintes no stepper). Use quando o bloqueio JA e conhecido, em vez de deixar o botao com aparencia de clicavel. Nao afeta o botao da ultima etapa." },
  { prop: "onStepChange", type: "(stepIndex) => void", defaultValue: "-", description: "Callback ao trocar de etapa." },
  { prop: "onFinish", type: "() => void | Promise<void>", defaultValue: "-", description: "Disparado quando o usuario conclui o wizard." },
  { prop: "className / style", type: "string / React.CSSProperties", defaultValue: "-", description: "Classes e estilo inline do container do wizard." },
  { prop: "SgWizardPage.className / SgWizardPage.style", type: "string / React.CSSProperties", defaultValue: "-", description: "Customizacao visual por pagina do wizard." }
];

export default function SgWizardPageDemo() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgWizard");
  const aiWizardPageComponent = useAiManifestComponent("SgWizardPage");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [submitted, setSubmitted] = React.useState<Record<string, string> | null>(null);
  const [step, setStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    phone: ""
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.wizard.title")}
          subtitle={t(i18n, "showcase.component.wizard.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, "showcase.component.wizard.sections.autoValidation.title")}
        description={t(i18n, "showcase.component.wizard.sections.autoValidation.description")}
      >
        <SgWizard
          stepper="numbered"
          initialStep={0}
          stepNavigation="previous-and-next"
          onStepChange={(i) => setStep(i)}
          onFinish={async () => {
            setSubmitted(null);
            await new Promise((r) => setTimeout(r, 800));
            setSubmitted({ ...formValues });
          }}
        >
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step1Title")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step1Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step1Desc")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputText
                  id="wizard-name"
                  label={t(i18n, "showcase.component.wizard.labels.name")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredName")}
                  inputProps={{
                    value: formValues.name,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }}
                />
                <SgInputEmail
                  id="wizard-email"
                  label={t(i18n, "showcase.component.wizard.labels.email")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredEmail")}
                  invalidMessage={t(i18n, "showcase.component.wizard.messages.invalidEmail")}
                  inputProps={{
                    value: formValues.email,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
                  }}
                />
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step2Title")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step2Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step2Desc")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputPhone
                  id="wizard-phone"
                  label={t(i18n, "showcase.component.wizard.labels.phone")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredPhone")}
                  lengthMessage={t(i18n, "showcase.component.wizard.messages.invalidPhone")}
                  inputProps={{
                    value: formValues.phone,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                  }}
                />
                <div className="rounded border border-border bg-background p-3 text-xs text-foreground/70">
                  <div className="font-semibold">{t(i18n, "showcase.component.wizard.labels.summary")}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone || "-"}</div>
                </div>
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step3Title")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step3Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step3Desc")}</p>
              <div className="mt-3 rounded border border-border bg-background p-3 text-sm text-foreground/80">
                <div>{t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name || "-"}</div>
                <div>{t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email || "-"}</div>
                <div>{t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone || "-"}</div>
              </div>
            </div>
          </SgWizardPage>
        </SgWizard>
        <div className="mt-3 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.wizard.labels.currentStep", { step: step + 1 })}
        </div>
        {submitted ? (
          <div className="mt-3 rounded-lg border border-border bg-background p-4 text-xs text-foreground/80">
            <div className="mb-2 text-sm font-semibold text-foreground">{t(i18n, "showcase.component.wizard.labels.payloadTitle")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        ) : null}
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/validacao-automatica.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.stepNavigation.title")}
        description={t(i18n, "showcase.component.wizard.sections.stepNavigation.description")}
      >
        <SgWizard
          stepper="numbered"
          initialStep={2}
          stepNavigation="previous"
          onFinish={() => {}}
        >
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.introTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">1. {t(i18n, "showcase.component.wizard.demo.introTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.navIntroText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.detailsTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">2. {t(i18n, "showcase.component.wizard.demo.detailsTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.navDetailsText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.reviewTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">3. {t(i18n, "showcase.component.wizard.demo.reviewTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.navReviewText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.confirmTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">4. {t(i18n, "showcase.component.wizard.demo.confirmTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.navConfirmText")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/stepnavigation.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.stepperIcons.title")}
        description={t(i18n, "showcase.component.wizard.sections.stepperIcons.description")}
      >
        <SgWizard
          stepper="icons"
          onFinish={() => {}}
          style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 14, padding: 12 }}
        >
          <SgWizardPage
            title={t(i18n, "showcase.component.wizard.demo.iconsPosition")}
            icon={<MapPin className="size-5" />}
            style={{ backgroundColor: "rgba(59, 130, 246, 0.06)" }}
          >
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.demo.stepLabel", { n: 1, name: t(i18n, "showcase.component.wizard.demo.iconsPosition") })}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.positionText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.iconsCategory")} icon={<Tag className="size-5" />}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.demo.stepLabel", { n: 2, name: t(i18n, "showcase.component.wizard.demo.iconsCategory") })}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.categoryText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.iconsSend")} icon={<Send className="size-5" />}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.demo.stepLabel", { n: 3, name: t(i18n, "showcase.component.wizard.demo.iconsSend") })}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.sendText")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/stepper-com-icones.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.stepperNumbered.title")}
        description={t(i18n, "showcase.component.wizard.sections.stepperNumbered.description")}
      >
        <SgWizard
          stepper="numbered"
          onFinish={() => {}}
        >
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.introTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">1. {t(i18n, "showcase.component.wizard.demo.introTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.numberedIntroText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.detailsTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">2. {t(i18n, "showcase.component.wizard.demo.detailsTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.numberedDetailsText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.reviewTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">3. {t(i18n, "showcase.component.wizard.demo.reviewTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.numberedReviewText")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.confirmTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">4. {t(i18n, "showcase.component.wizard.demo.confirmTitle")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.demo.numberedConfirmText")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/stepper-numerado.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.customLabels.title")}
        description={t(i18n, "showcase.component.wizard.sections.customLabels.description")}
      >
        <SgWizard
          labels={{
            next: t(i18n, "showcase.component.wizard.labels.next"),
            previous: t(i18n, "showcase.component.wizard.labels.previous"),
            finish: t(i18n, "showcase.component.wizard.labels.finish")
          }}
          onFinish={() => {}}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.customStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.customStep1Desc")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.customStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.customStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/labels-customizados.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.beforeNext.title")}
        description={t(i18n, "showcase.component.wizard.sections.beforeNext.description")}
      >
        <SgWizard
          onBeforeNext={async () => {
            await new Promise((r) => setTimeout(r, 600));
            return true;
          }}
          onFinish={async () => {
            await new Promise((r) => setTimeout(r, 400));
          }}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.beforeNextStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.beforeNextStep1Desc")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.beforeNextStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.beforeNextStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/onbeforenext-async.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.validateStep.title")}
        description={t(i18n, "showcase.component.wizard.sections.validateStep.description")}
      >
        <SgWizard
          validateStep={(index) => {
            if (index === 0) {
              return Boolean(formValues.name.trim()) && Boolean(formValues.email.trim());
            }
            return true;
          }}
          onFinish={() => {}}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.validateStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(i18n, "showcase.component.wizard.labels.validateStep1Desc")}
              </p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.validateStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.validateStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/validatestep.tsx.sample" />
      </Section>
      <Section
        title={t(i18n, "showcase.component.wizard.sections.nextDisabled.title")}
        description={t(i18n, "showcase.component.wizard.sections.nextDisabled.description")}
      >
        <NextDisabledDemo />
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/nextdisabled.tsx.sample" />
      </Section>
      <Section
        title={t(i18n, "showcase.common.sections.enabled.title")}
        description={t(i18n, "showcase.component.wizard.sections.enabled.description")}
      >
        <SgWizard stepper="numbered" initialStep={1} enabled={false} onFinish={() => {}}>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.enabledData")}>
            <div className="rounded border border-border bg-foreground/5 p-4">{t(i18n, "showcase.component.wizard.demo.enabledFirst")}</div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.reviewTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">{t(i18n, "showcase.component.wizard.demo.enabledSecond")}</div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.demo.confirmTitle")}>
            <div className="rounded border border-border bg-foreground/5 p-4">{t(i18n, "showcase.component.wizard.demo.enabledThird")}</div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-wizard/samples/enabled.tsx.sample" />
      </Section>
      <Section
        title="Playground"
        description={t(i18n, "showcase.component.wizard.demo.playgroundDescription")}
      >
        <SgPlayground
          title="SgWizard Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-wizard/sg-wizard.tsx.playground"
          height={640}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={WIZARD_PROPS} />
      {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      {aiWizardPageComponent ? <ComponentAiPropsTable component={aiWizardPageComponent} /> : null}
      {aiWizardPageComponent ? <ComponentAiSummary component={aiWizardPageComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}



