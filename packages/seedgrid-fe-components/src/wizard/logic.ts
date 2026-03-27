export function clampWizardStep(initialStep: number | undefined, pageCount: number): number {
  const step = initialStep ?? 0;
  return Math.min(Math.max(step, 0), Math.max(pageCount - 1, 0));
}

export type WizardStepNavigation = "none" | "previous" | "previous-and-next";

export function canNavigateToWizardStep(args: {
  currentStep: number;
  targetStep: number;
  pageCount: number;
  stepNavigation?: WizardStepNavigation;
}): boolean {
  const { currentStep, targetStep, pageCount, stepNavigation = "previous-and-next" } = args;
  if (targetStep < 0 || targetStep >= pageCount || targetStep === currentStep) {
    return false;
  }

  if (targetStep < currentStep) {
    return stepNavigation === "previous" || stepNavigation === "previous-and-next";
  }

  return stepNavigation === "previous-and-next" && targetStep === currentStep + 1;
}

export type WizardGuardRunner = {
  validateCurrentPage: () => boolean | Promise<boolean>;
  validateStep?: (index: number) => boolean | Promise<boolean>;
  beforeAction?: (index: number) => boolean | Promise<boolean>;
  step: number;
};

export async function canProceedWizardAction(runner: WizardGuardRunner): Promise<boolean> {
  const pageValid = await runner.validateCurrentPage();
  if (!pageValid) return false;

  if (runner.validateStep) {
    const stepValid = await runner.validateStep(runner.step);
    if (!stepValid) return false;
  }

  if (runner.beforeAction) {
    const allowed = await runner.beforeAction(runner.step);
    if (!allowed) return false;
  }

  return true;
}
