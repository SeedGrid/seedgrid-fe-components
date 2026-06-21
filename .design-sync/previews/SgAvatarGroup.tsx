import React from "react";
import { SgAvatar, SgAvatarGroup } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <SgAvatarGroup max={3}>
      <SgAvatar label="AS" severity="primary" />
      <SgAvatar label="JP" severity="info" />
      <SgAvatar label="MC" severity="warning" />
      <SgAvatar label="RF" severity="danger" />
      <SgAvatar label="LB" severity="secondary" />
    </SgAvatarGroup>
  );
}
