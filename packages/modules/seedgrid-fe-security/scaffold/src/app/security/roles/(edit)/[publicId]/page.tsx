import { RouteGuard } from "@/modules/security";

import { RoleEditor } from "../../editors/RoleEditor";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  return (
    <RouteGuard permissions={["ROLE_READ"]}>
      <RoleEditor publicId={publicId} />
    </RouteGuard>
  );
}
