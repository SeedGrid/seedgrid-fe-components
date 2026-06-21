import React from "react";
import { User } from "lucide-react";
import { SgAvatar } from "@seedgrid/fe-components";
const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 };
export function Basic() {
  return (
    <div style={row}>
      <SgAvatar label="MS" />
      <SgAvatar icon={<User size={18} />} severity="secondary" />
      <SgAvatar src="https://i.pravatar.cc/150?img=32" alt="Ana Souza" />
      <SgAvatar label="JP" shape="square" severity="info" />
    </div>
  );
}
export function Sizes() {
  return (
    <div style={row}>
      <SgAvatar label="XS" size="xs" />
      <SgAvatar label="SM" size="sm" />
      <SgAvatar label="MD" size="md" />
      <SgAvatar label="LG" size="lg" />
      <SgAvatar label="XL" size="xl" />
    </div>
  );
}
