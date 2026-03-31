"use client";

import {
  SgAvatar,
  SgCombobox,
  SgPanel,
  SgScreen,
  SgToggleSwitch,
} from "@seedgrid/fe-components";
import { usePathname, useRouter } from "next/navigation";

import { Moon, Sun } from "lucide-react";
import React, { useMemo, useState } from "react";

type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  route: string;
  readOnly: boolean;
};

export default function SecurityDashboard() {
  const accessibleModules: QuickAccessItem[] = [];
  const brandBadgeStyle = {
    backgroundColor: "rgba(var(--sg-primary-100), 0.9)",
    color: "rgb(var(--sg-primary-700))",
  };

  //---- BANDEIRINHA
  type LocaleOption = "pt-br" | "pt-pt" | "en-us" | "es" | "fr";

  const [locale, setLocale] = useState<LocaleOption>("pt-br");

  const source = useMemo(
    () => [
      {
        id: "pt-br",
        value: "pt-br",
        label: "Português (Brasil)",
        flag: "br",
      },
      {
        id: "pt-pt",
        value: "pt-pt",
        label: "Português (Portugal)",
        flag: "pt",
      },
      {
        id: "en-us",
        value: "en-us",
        label: "English (US)",
        flag: "us",
      },
      {
        id: "es",
        value: "es",
        label: "Español",
        flag: "es",
      },
      {
        id: "fr",
        value: "fr",
        label: "Français",
        flag: "fr",
      },
    ],
    [],
  );
  //-----

  return (
    <SgScreen>
      <SgPanel align="top" padding={10} minHeightPx={50}>
        <SgPanel align="right" contentDirection="row" contentPadding={20}>
          <SgCombobox
            width={84}
            id="language"
            label="Idioma"
            placeholder="🌐"
            source={source}
            value={locale}
            onValueChange={(value) => setLocale(value as LocaleOption)}
            renderItem={(item) => {
              const entry = source.find((option) => option.id === item.id);

              return (
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/${entry?.flag ?? "un"}.svg`}
                    width={20}
                    alt=""
                  />
                  <span>{item.label}</span>
                </div>
              );
            }}
            renderValue={(item) => {
              const entry = source.find((option) => option.id === item?.id);

              return entry ? (
                <img
                  src={`https://flagcdn.com/${entry.flag}.svg`}
                  width={20}
                  alt={entry.label}
                />
              ) : null;
            }}
          />

          <SgToggleSwitch
            id="demo-icons"
            onIcon={<Sun size={12} />}
            offIcon={<Moon size={12} />}
          />
          <SgAvatar src="https://i.pravatar.cc/150?img=32" alt="Amy Elsner" />
        </SgPanel>
      </SgPanel>
    </SgScreen>
  );
}
