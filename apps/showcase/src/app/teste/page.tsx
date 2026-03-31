"use client";

import { SgButton, SgPanel, SgScreen } from "@seedgrid/fe-components";
import React from "react";

export default function TestePage() {
  return (
      <SgScreen>
        <SgPanel align="top" height={5} contentPadding={8} minHeightPx={100}>
          <SgPanel align="right" contentDirection="row" contentPadding={8} contentAlign="center">
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
          </SgPanel>
        </SgPanel>
        <SgPanel align="left" width={10}>
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
        </SgPanel>
        <SgPanel align="client">
            BASDA 
        </SgPanel>
        <SgPanel align="bottom" height={5} contentPadding={8} minHeightPx={100}>
          <SgPanel align="left" contentDirection="row" contentPadding={8}>
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
          </SgPanel>
        </SgPanel>
      </SgScreen>
  );
}
