// seedgrid:managed

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useBackupAppShellSections } from "./useBackupAppShellSections";

vi.mock("@/i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const mockUsePermission = vi.fn();

vi.mock("@/modules/security", () => ({
  usePermission: (permission: string) => mockUsePermission(permission),
}));

describe("useBackupAppShellSections", () => {
  it("returns an empty array when the user has no JOB_READ permission", () => {
    mockUsePermission.mockReturnValue(false);

    const { result } = renderHook(() => useBackupAppShellSections());

    expect(result.current).toEqual([]);
  });

  it("returns a backup section when the user has JOB_READ permission", () => {
    mockUsePermission.mockImplementation((permission: string) =>
      permission === "JOB_READ"
    );

    const { result } = renderHook(() => useBackupAppShellSections());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("backup");
  });

  it("includes a backup-exports nav item inside the section", () => {
    mockUsePermission.mockImplementation((permission: string) =>
      permission === "JOB_READ"
    );

    const { result } = renderHook(() => useBackupAppShellSections());

    const section = result.current[0];
    const sectionItem = section.items[0];
    const exportItem = sectionItem.children?.find(
      (item) => item.id === "backup-exports"
    );

    expect(exportItem).toBeDefined();
  });

  it("passes the JOB_READ permission check to usePermission", () => {
    mockUsePermission.mockReturnValue(false);

    renderHook(() => useBackupAppShellSections());

    expect(mockUsePermission).toHaveBeenCalledWith("JOB_READ");
  });
});
