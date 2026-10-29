"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { resolveFieldError } from "../rhf";
import { maskCpfCnpj } from "../masks";
import { isValidCnpj, isValidCpf } from "../validators";
import { t, useComponentsI18n } from "../i18n";
import { defaultPublicaCnpjFetch } from "./publicaCnpj";

export type SgInputCPFCNPJProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  /** Disparado ao receber foco — padrao seedgrid. */
  onEnter?: () => void;
  /** Disparado ao perder o foco (apos validacao) — padrao seedgrid. */
  onExit?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  lengthMessage?: string;
  invalidMessage?: string;
  validation?: (value: string) => string | null;
  onValidation?: (message: string | null) => void;
  validateOnBlur?: boolean;
  /** Quando o documento e um CNPJ numerico valido, confirma na base publica (publica.cnpj.ws) que ele existe. */
  validateWithPublicaCnpj?: boolean;
  /** Mensagem quando a base publica nao encontra o CNPJ. */
  publicaCnpjErrorMessage?: string;
  /** Consulta injetavel (testes sem rede). Padrao: https://publica.cnpj.ws. */
  publicaCnpjFetch?: (cnpj: string) => Promise<unknown | null>;
  /** Recebe o resultado da consulta (`null` quando nao achou). */
  onPublicaCnpjResult?: (data: unknown | null) => void;
  /** Chamado quando a consulta falha (rede ou limite da API); a validacao passa. */
  onPublicaCnpjError?: (error: unknown) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function onlyAlnumUpper(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

export function SgInputCPFCNPJ(props: SgInputCPFCNPJProps) {
  const i18n = useComponentsI18n();
  const {
    required,
    requiredMessage,
    lengthMessage,
    invalidMessage,
    validateOnBlur,
    error,
    validation,
    validateWithPublicaCnpj,
    publicaCnpjErrorMessage,
    publicaCnpjFetch,
    onPublicaCnpjResult,
    onPublicaCnpjError,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const lastValidatedCnpjRef = React.useRef<string | null>(null);
  const lastPublicaFoundRef = React.useRef<boolean | null>(null);

  const runValidation = React.useCallback(
    (value: string) => {
      const raw = onlyAlnumUpper(value);
      if (!raw && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!raw && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (validation) {
        const message = validation(value);
        if (message) {
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
      }
      const isCnpj = /[A-Z]/.test(raw) || raw.length > 11;
      if (!isCnpj) {
        const digits = onlyDigits(value);
        if (digits.length !== 11) {
          const message = lengthMessage ?? t(i18n, "components.inputs.cpf.length");
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
        if (!isValidCpf(value)) {
          const message = invalidMessage ?? t(i18n, "components.inputs.cpf.invalid");
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (raw.length !== 14) {
        const message = lengthMessage ?? t(i18n, "components.inputs.cnpj.length");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (!isValidCnpj(value)) {
        const message = invalidMessage ?? t(i18n, "components.inputs.cnpj.invalid");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (validateWithPublicaCnpj && !/[A-Z]/.test(raw)) {
        const digits = onlyDigits(raw);
        if (digits.length === 14) {
          const message = publicaCnpjErrorMessage ?? invalidMessage ?? t(i18n, "components.inputs.cnpj.invalid");
          if (lastValidatedCnpjRef.current === digits) {
            if (lastPublicaFoundRef.current === false) {
              setInternalError(message);
              props.onValidation?.(message);
            } else {
              setInternalError(null);
              props.onValidation?.(null);
            }
            return;
          }
          void (async () => {
            try {
              const checker = publicaCnpjFetch ?? defaultPublicaCnpjFetch;
              const data = await checker(digits);
              lastValidatedCnpjRef.current = digits;
              lastPublicaFoundRef.current = Boolean(data);
              onPublicaCnpjResult?.(data);
              if (!data) {
                setInternalError(message);
                props.onValidation?.(message);
                return;
              }
            } catch (err) {
              onPublicaCnpjError?.(err);
            }
            setInternalError(null);
            props.onValidation?.(null);
          })();
          return;
        }
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [
      i18n,
      required,
      requiredMessage,
      lengthMessage,
      invalidMessage,
      validation,
      props,
      validateWithPublicaCnpj,
      publicaCnpjErrorMessage,
      publicaCnpjFetch,
      onPublicaCnpjResult,
      onPublicaCnpjError
    ]
  );

  const inputProps = {
    ...rest.inputProps,
    inputMode: rest.inputProps?.inputMode ?? "text",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = maskCpfCnpj(event.target.value);
      runValidation(event.currentTarget.value);
      rest.inputProps?.onChange?.(event);
    }
  };

  const onBlur = inputProps.onBlur;
  const shouldValidateOnBlur = validateOnBlur ?? true;

  return (
    <SgInputText
      {...rest}
      maxLength={rest.maxLength ?? 18}
      error={resolveFieldError(error, internalError ?? undefined)}
      onClear={() => {
        setInternalError(null);
        props.onValidation?.(null);
        rest.onClear?.();
      }}
      inputProps={{
        ...inputProps,
        onBlur: (event) => {
          if (shouldValidateOnBlur) runValidation(event.currentTarget.value);
          onBlur?.(event);
        }
      }}
    />
  );
}
