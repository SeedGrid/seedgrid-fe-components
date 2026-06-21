import React from "react";
import { Plus, UserPlus, FilePlus, FolderPlus } from "lucide-react";
import { SgFloatActionButton } from "@seedgrid/fe-components";
const actions = [
  { icon: <UserPlus size={16} />, label: "Novo usuário", onClick: () => {} },
  { icon: <FilePlus size={16} />, label: "Novo arquivo", onClick: () => {} },
  { icon: <FolderPlus size={16} />, label: "Nova pasta", onClick: () => {} },
];
const box: React.CSSProperties = { position: "relative", width: 280, height: 180, border: "1px dashed hsl(var(--border))", borderRadius: 12, background: "hsl(var(--muted))" };
export function Basic() {
  return (
    <div style={box}>
      <SgFloatActionButton absolute position="right-bottom" icon={<Plus size={18} />} actions={actions} type="linear" direction="up" />
    </div>
  );
}
