import type {
  FieldValues,
  RegisterOptions,
  UseFormRegister
} from "react-hook-form";

/**
 * Props de binding com react-hook-form comuns aos inputs Sg*.
 *
 * `control`/`register`/`rules` são tipados permissivamente (`any` como form
 * values) DE PROPÓSITO: o componente só repassa esses valores pro RHF — nunca
 * inspeciona nomes de campo — então o tipo concreto do formulário não precisa
 * fluir por aqui. A segurança de tipo que importa (shape dos valores em
 * `handleSubmit`/`getValues`/`watch`) continua no `useForm<T>()` do chamador.
 *
 * Sem isso, `UseFormRegister<T>` de um form tipado (ex.: `useForm<LoginForm>()`)
 * NÃO é atribuível a `UseFormRegister<FieldValues>` sob `strictFunctionTypes`:
 * os parâmetros `name`/`options` do register são contravariantes, então nenhum
 * tipo não-genérico único aceita o register de todo e qualquer formulário. Um
 * componente não-genérico só consegue aceitar todos via este widening.
 */
export type RhfFieldProps = {
  name?: string;
  // `control` é `any` de propósito: nem `Control<any, any, any>` aceita um
  // Control de form tipado, porque o `_options.validate` (ValidateForm) interno
  // da RHF usa tipos condicionais que não colapsam sobre `any`. Como o
  // componente só repassa o control pro <Controller>, `any` aqui não perde
  // segurança real (o shape dos valores vive no `useForm<T>()` do chamador).
  control?: any;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions<any>;
  error?: string;
};

export function resolveFieldError(...errors: Array<string | null | undefined>): string | undefined {
  for (const error of errors) {
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }
  return undefined;
}

export function mergeRequiredRule<TFieldValues extends FieldValues = FieldValues>(
  rules: RegisterOptions<TFieldValues> | undefined,
  required: boolean | undefined,
  message: string
): RegisterOptions<TFieldValues> | undefined {
  if (!required) return rules;
  if (!rules) return { required: message };
  if (rules.required === undefined || rules.required === false) {
    return { ...rules, required: message };
  }
  return rules;
}
