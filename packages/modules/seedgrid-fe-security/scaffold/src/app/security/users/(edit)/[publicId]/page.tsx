import { RouteGuard } from "@/modules/security";
import { UserEditor } from "@/app/security/users/editors/UserEditor";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <RouteGuard permissions={["USER_READ"]}>
      <UserEditor publicId={resolvedParams.publicId} />
    </RouteGuard>
  );
}
