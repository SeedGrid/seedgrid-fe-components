import { RouteGuard } from "@/modules/security";
import { UserEditor } from "@/app/security/users/editors/UserEditor";

export default function NewUserPage() {
  return (
    <RouteGuard permissions={["USER_CREATE"]}>
      <UserEditor />
    </RouteGuard>
  );
}
