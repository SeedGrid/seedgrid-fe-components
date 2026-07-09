import { RouteGuard } from "@/modules/security";

import { RoleEditor } from "../../editors/RoleEditor";

export default function CreateRolePage() {
  return (
    <RouteGuard permissions={["ROLE_CREATE"]}>
      <RoleEditor />
    </RouteGuard>
  );
}
