"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TenantContextValue = {
  currentTenant: string;
  setTenant: (tenant: string) => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState("default");

  const value: TenantContextValue = {
    currentTenant,
    setTenant: setCurrentTenant,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenantContext must be used inside TenantProvider");
  }

  return context;
}
