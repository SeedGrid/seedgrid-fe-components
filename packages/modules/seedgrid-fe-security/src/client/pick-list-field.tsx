"use client";

import { useMemo } from "react";

import { SgPickList, type SgPickListItem } from "@seedgrid/fe-components";

import type { PickListOption } from "../dtos";

const groupBoxProps = {
  className: "w-full",
};

type PickListFieldProps = {
  id: string;
  title: string;
  sourceHeader: string;
  targetHeader: string;
  options: PickListOption[];
  selectedValues: Array<string | number>;
  onChange: (values: Array<string | number>) => void;
  emptyMessage: string;
  readOnly?: boolean;
};

export function PickListField({
  id,
  title,
  sourceHeader,
  targetHeader,
  options,
  selectedValues,
  onChange,
  emptyMessage,
  readOnly = false,
}: PickListFieldProps) {
  const sourceItems = useMemo(
    () =>
      options
        .filter(
          (option) =>
            !selectedValues.some((value) => isSameValue(value, option.value))
        )
        .map(toItem),
    [options, selectedValues]
  );
  const targetItems = useMemo(
    () =>
      selectedValues
        .map((selectedValue) =>
          options.find((option) => isSameValue(selectedValue, option.value))
        )
        .filter((option): option is PickListOption => Boolean(option))
        .map(toItem),
    [options, selectedValues]
  );

  return (
    <SgPickList
      id={id}
      title={title}
      source={sourceItems}
      target={targetItems}
      sourceHeader={sourceHeader}
      targetHeader={targetHeader}
      showSourceFilter
      showTargetFilter
      emptyMessage={emptyMessage}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(event) => {
        onChange(event.target.map((item) => item.value));
      }}
      groupBoxProps={groupBoxProps}
    />
  );
}

function toItem(option: PickListOption): SgPickListItem {
  return {
    label: option.label,
    value: option.value,
    disabled: option.disabled,
    data: option.data,
  };
}

function isSameValue(left: string | number, right: string | number) {
  return String(left) === String(right);
}
