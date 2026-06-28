import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { useForm } from "react-hook-form";
import { setupDomHarness, flushDom, dispatchMouse, dispatchInput } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return {
      extend() {
        return {
          configure() {
            return this;
          }
        };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const { SgAutocomplete, SgInputPassword, SgInputPhone, SgInputText, SgMultiSelect, SgMultiSelectChips, SgInputTextSearch } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function ControlledAutocomplete(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgAutocomplete, {
    id: "autocomplete-native-input",
    label: "Autocomplete",
    placeholder: "Type here",
    value,
    onChange: setValue,
    source: (query) => [
      { id: "query", label: query || "empty", value: query || "empty" },
      { id: "abacaxi", label: "Abacaxi", value: "Abacaxi" }
    ],
    minLengthForSearch: 0,
    openOnFocus: true,
    showDropDownButton: true,
    ...props
  });
}

function RequiredAutocomplete(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgAutocomplete, {
    id: "autocomplete-required-input",
    label: "Autocomplete",
    required: true,
    value,
    onChange: setValue,
    source: (query) => [
      { id: "abacaxi", label: "Abacaxi", value: "Abacaxi" },
      { id: "banana", label: "Banana", value: "Banana" }
    ],
    minLengthForSearch: 0,
    openOnFocus: true,
    showDropDownButton: true,
    ...props
  });
}

function RequiredAutocompleteWithCommittedValue(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(SgAutocomplete, {
      id: "autocomplete-required-input",
      label: "Autocomplete",
      required: true,
      value,
      onChange: setValue,
      source: () => [
        { id: "abacaxi", label: "Abacaxi", value: "Abacaxi" },
        { id: "banana", label: "Banana", value: "Banana" }
      ],
      minLengthForSearch: 0,
      openOnFocus: true,
      showDropDownButton: true,
      ...props
    }),
    React.createElement("div", { "data-committed-value": value }, value)
  );
}

function ControlledInputText(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgInputText, {
    id: "input-text-native-input",
    label: "Input text",
    placeholder: "Type here",
    inputProps: {
      value,
      onChange: (event) => setValue(event.currentTarget.value)
    },
    ...props
  });
}

function OnChangeControlledInputPassword(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(SgInputPassword, {
      id: "input-password-native-input",
      label: "Password",
      // Forma usada por consumidores (ex.: admin-web login): a prop top-level
      // `onChange(value)` precisa disparar a cada tecla, nao so no botao de gerar senha.
      onChange: setValue,
      showStrengthBar: false,
      commonPasswordCheck: false,
      ...props
    }),
    React.createElement("div", { "data-committed-value": value }, value)
  );
}

function RhfControlledInputText(props = {}) {
  const { control } = useForm({
    defaultValues: {
      text: ""
    }
  });

  return React.createElement(SgInputText, {
    id: "input-text-rhf-input",
    name: "text",
    control,
    label: "Input text",
    placeholder: "Type here",
    ...props
  });
}

function ControlledInputPhone(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgInputPhone, {
    id: "input-phone-native-input",
    label: "Phone",
    required: true,
    inputProps: {
      value,
      onChange: (event) => setValue(event.currentTarget.value)
    },
    ...props
  });
}

test("SgAutocomplete keeps the typed value when native input events drive the field", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledAutocomplete));
    await flushDom();

    const input = harness.document.querySelector('input#autocomplete-native-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputText keeps the typed value when controlled through inputProps.value", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledInputText));
    await flushDom();

    const input = harness.document.querySelector('input#input-text-native-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputPassword calls the top-level onChange(value) while typing", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(OnChangeControlledInputPassword));
    await flushDom();

    const input = harness.document.querySelector('input#input-password-native-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    // O estado do consumidor (alimentado pela prop top-level onChange) deve refletir o
    // texto digitado. Antes do fix, ficava vazio porque onChange so disparava no botao de gerar.
    const committed = harness.document.querySelector('[data-committed-value]');
    assert.equal(committed?.dataset.committedValue, word);
  } finally {
    harness.restore();
  }
});

test("SgInputText keeps the typed value when controlled through react-hook-form", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(RhfControlledInputText));
    await flushDom();

    const input = harness.document.querySelector('input#input-text-rhf-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputPhone shows the required asterisk when required is true", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledInputPhone));
    await flushDom();

    const label = harness.document.querySelector('label[for="input-phone-native-input"]');
    assert.ok(label);
    assert.match(label.textContent ?? "", /Phone\s*\*/);
  } finally {
    harness.restore();
  }
});

test("SgAutocomplete does not commit arbitrary typed text when custom values are not allowed", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(RequiredAutocompleteWithCommittedValue));
    await flushDom();

    const input = harness.document.querySelector('input#autocomplete-required-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    await act(async () => {
      const previous = input.value;
      input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: "X", bubbles: true, cancelable: true }));
      input.dispatchEvent(
        new harness.window.InputEvent("beforeinput", {
          data: "X",
          inputType: "insertText",
          bubbles: true,
          cancelable: true
        })
      );
      descriptor.set.call(input, previous + "X");
      input._valueTracker?.setValue?.(previous);
      input.dispatchEvent(
        new harness.window.InputEvent("input", {
          data: "X",
          inputType: "insertText",
          bubbles: true,
          cancelable: true
        })
      );
      input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: "X", bubbles: true, cancelable: true }));
    });
    await flushDom();

    assert.equal(input.value, "X");

    const committedValue = harness.document.querySelector("[data-committed-value]");
    assert.ok(committedValue);
    assert.equal(committedValue.textContent ?? "", "");
  } finally {
    harness.restore();
  }
});

const MULTI_OPTIONS = [
  { label: "Empresa 1", value: "e1" },
  { label: "Empresa 2", value: "e2" },
  { label: "Empresa 3", value: "e3" },
  { label: "Empresa 4", value: "e4" }
];

function ControlledMultiSelect(props = {}) {
  const [value, setValue] = React.useState(props.initialValue ?? []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(SgMultiSelect, {
      id: "multi-select-native",
      label: "Empresas",
      placeholder: "Selecione as empresas",
      options: MULTI_OPTIONS,
      value,
      onChange: setValue,
      ...props.componentProps
    }),
    React.createElement("div", { "data-committed-value": value.join(",") }, value.join(","))
  );
}

function getMultiInput(harness) {
  const input = harness.document.querySelector("input#multi-select-native");
  assert.ok(input);
  return input;
}

function getDropdownOptions(harness) {
  return Array.from(harness.document.querySelectorAll('[role="option"]'));
}

test("SgMultiSelect opens on trigger click and toggles chevron to check", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledMultiSelect));
    await flushDom();

    // No dropdown before opening.
    assert.equal(getDropdownOptions(harness).length, 0);

    const input = getMultiInput(harness);
    await dispatchMouse(input, "mousedown");
    await flushDom();

    const options = getDropdownOptions(harness);
    assert.equal(options.length, MULTI_OPTIONS.length);
  } finally {
    harness.restore();
  }
});

test("SgMultiSelect toggles multiple options and keeps the dropdown open", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledMultiSelect));
    await flushDom();

    const input = getMultiInput(harness);
    await dispatchMouse(input, "mousedown");
    await flushDom();

    let options = getDropdownOptions(harness);
    await dispatchMouse(options[0], "click");
    await flushDom();

    // Still open after first selection (multi behavior).
    options = getDropdownOptions(harness);
    assert.equal(options.length, MULTI_OPTIONS.length);

    await dispatchMouse(options[2], "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "e1,e3");

    // First option is selected (aria-selected true).
    options = getDropdownOptions(harness);
    assert.equal(options[0].getAttribute("aria-selected"), "true");
    assert.equal(options[1].getAttribute("aria-selected"), "false");
    assert.equal(options[2].getAttribute("aria-selected"), "true");
  } finally {
    harness.restore();
  }
});

test("SgMultiSelect deselects an already selected option on click", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelect, { initialValue: ["e1", "e2"] })
    );
    await flushDom();

    const input = getMultiInput(harness);
    await dispatchMouse(input, "mousedown");
    await flushDom();

    const options = getDropdownOptions(harness);
    await dispatchMouse(options[0], "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "e2");
  } finally {
    harness.restore();
  }
});

test("SgMultiSelect filters options when searchable", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelect, { componentProps: { searchable: true } })
    );
    await flushDom();

    const input = getMultiInput(harness);
    await dispatchMouse(input, "mousedown");
    await flushDom();

    const search = harness.document.querySelector('[role="listbox"] input[type="text"]');
    assert.ok(search);

    await dispatchInput(search, "Empresa 3");
    await flushDom();

    const options = getDropdownOptions(harness);
    assert.equal(options.length, 1);
    assert.match(options[0].textContent ?? "", /Empresa 3/);
  } finally {
    harness.restore();
  }
});

test("SgMultiSelect clears the whole selection with the clear button", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelect, {
        initialValue: ["e1", "e2"],
        componentProps: { clearable: true }
      })
    );
    await flushDom();

    const clearButton = harness.document.querySelector('button[aria-label="Limpar selecao"], button[aria-label="Clear selection"]');
    assert.ok(clearButton);

    await dispatchMouse(clearButton, "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "");
  } finally {
    harness.restore();
  }
});

function ControlledMultiSelectChips(props = {}) {
  const [value, setValue] = React.useState(props.initialValue ?? []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(SgMultiSelectChips, {
      id: "multi-select-chips",
      label: "Empresas",
      placeholder: "Selecione as empresas",
      options: MULTI_OPTIONS,
      value,
      onChange: setValue,
      ...props.componentProps
    }),
    React.createElement("div", { "data-committed-value": value.join(",") }, value.join(","))
  );
}

function getChipsTrigger(harness) {
  const trigger = harness.document.querySelector('#multi-select-chips[role="combobox"]');
  assert.ok(trigger);
  return trigger;
}

test("SgMultiSelectChips opens on trigger click and toggles options keeping it open", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledMultiSelectChips));
    await flushDom();

    assert.equal(getDropdownOptions(harness).length, 0);

    const trigger = getChipsTrigger(harness);
    await dispatchMouse(trigger, "mousedown");
    await flushDom();

    let options = getDropdownOptions(harness);
    assert.equal(options.length, MULTI_OPTIONS.length);

    await dispatchMouse(options[0], "click");
    await flushDom();

    // Still open after first selection (multi behavior).
    options = getDropdownOptions(harness);
    assert.equal(options.length, MULTI_OPTIONS.length);

    await dispatchMouse(options[2], "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "e1,e3");
  } finally {
    harness.restore();
  }
});

test("SgMultiSelectChips renders a chip per selection and removes one via its remove button", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelectChips, { initialValue: ["e1", "e2"] })
    );
    await flushDom();

    const removeButtons = harness.document.querySelectorAll('[data-sg-chip-remove="true"]');
    // Two chips (each with a remove button); clearable is off so no clear-all button.
    assert.equal(removeButtons.length, 2);

    await dispatchMouse(removeButtons[0], "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "e2");
  } finally {
    harness.restore();
  }
});

test("SgMultiSelectChips clears the whole selection with the clear button", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelectChips, {
        initialValue: ["e1", "e2"],
        componentProps: { clearable: true }
      })
    );
    await flushDom();

    const clearButton = harness.document.querySelector(
      'button[aria-label="Limpar selecao"], button[aria-label="Clear selection"]'
    );
    assert.ok(clearButton);

    await dispatchMouse(clearButton, "click");
    await flushDom();

    const committed = harness.document.querySelector("[data-committed-value]");
    assert.equal(committed?.dataset.committedValue, "");
  } finally {
    harness.restore();
  }
});

test("SgMultiSelectChips filters options when searchable", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(
      React.createElement(ControlledMultiSelectChips, { componentProps: { searchable: true } })
    );
    await flushDom();

    const trigger = getChipsTrigger(harness);
    await dispatchMouse(trigger, "mousedown");
    await flushDom();

    const search = harness.document.querySelector('[role="listbox"] input[type="text"]');
    assert.ok(search);

    await dispatchInput(search, "Empresa 3");
    await flushDom();

    const options = getDropdownOptions(harness);
    assert.equal(options.length, 1);
    assert.match(options[0].textContent ?? "", /Empresa 3/);
  } finally {
    harness.restore();
  }
});

const SEARCH_DEBOUNCE_MS = 30;

async function waitDebounce(ms = SEARCH_DEBOUNCE_MS + 25) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

function SearchHarness(props = {}) {
  return React.createElement(SgInputTextSearch, {
    id: "search-input",
    label: "Busca",
    debounceMs: SEARCH_DEBOUNCE_MS,
    ...props
  });
}

function getSearchInput(harness) {
  const input = harness.document.querySelector("input#search-input");
  assert.ok(input);
  return input;
}

test("SgInputTextSearch fires onChange immediately and onSearchChange only after debounce", async () => {
  const harness = setupDomHarness();
  const immediate = [];
  const debounced = [];

  try {
    await harness.render(
      React.createElement(SearchHarness, {
        onChange: (v) => immediate.push(v),
        onSearchChange: (v) => debounced.push(v)
      })
    );
    await flushDom();

    const input = getSearchInput(harness);
    await dispatchInput(input, "abc");
    await flushDom();

    // onChange is synchronous; onSearchChange has not fired yet.
    assert.deepEqual(immediate, ["abc"]);
    assert.deepEqual(debounced, []);

    await waitDebounce();
    assert.deepEqual(debounced, ["abc"]);
  } finally {
    harness.restore();
  }
});

test("SgInputTextSearch gates onSearchChange by minChars (default 3) and trims", async () => {
  const harness = setupDomHarness();
  const debounced = [];

  try {
    await harness.render(
      React.createElement(SearchHarness, {
        onSearchChange: (v) => debounced.push(v)
      })
    );
    await flushDom();

    const input = getSearchInput(harness);

    // Below minChars -> no emission.
    await dispatchInput(input, "ab");
    await flushDom();
    await waitDebounce();
    assert.deepEqual(debounced, []);

    // Reaches minChars (with surrounding spaces trimmed).
    await dispatchInput(input, "  abcd  ");
    await flushDom();
    await waitDebounce();
    assert.deepEqual(debounced, ["abcd"]);
  } finally {
    harness.restore();
  }
});

test("SgInputTextSearch does not re-emit when the normalized value is unchanged (distinct)", async () => {
  const harness = setupDomHarness();
  const debounced = [];

  try {
    await harness.render(
      React.createElement(SearchHarness, {
        onSearchChange: (v) => debounced.push(v)
      })
    );
    await flushDom();

    const input = getSearchInput(harness);

    await dispatchInput(input, "hello");
    await flushDom();
    await waitDebounce();
    assert.deepEqual(debounced, ["hello"]);

    // Same normalized value (extra spaces) -> distinct, no second emission.
    await dispatchInput(input, "hello ");
    await flushDom();
    await waitDebounce();
    assert.deepEqual(debounced, ["hello"]);

    // Different value -> emits again.
    await dispatchInput(input, "world");
    await flushDom();
    await waitDebounce();
    assert.deepEqual(debounced, ["hello", "world"]);
  } finally {
    harness.restore();
  }
});

test("SgInputTextSearch debounces rapid typing into a single emission", async () => {
  const harness = setupDomHarness();
  const debounced = [];

  try {
    await harness.render(
      React.createElement(SearchHarness, {
        onSearchChange: (v) => debounced.push(v)
      })
    );
    await flushDom();

    const input = getSearchInput(harness);

    await dispatchInput(input, "fo");
    await dispatchInput(input, "foo");
    await dispatchInput(input, "foob");
    await dispatchInput(input, "fooba");
    await dispatchInput(input, "foobar");
    await flushDom();
    await waitDebounce();

    assert.deepEqual(debounced, ["foobar"]);
  } finally {
    harness.restore();
  }
});
