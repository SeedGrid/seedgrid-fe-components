import { CompanyManagementGuard, RouteGuard } from "@/modules/security";
import { CompanyEditor } from "@/app/security/companies/editors/CompanyEditor";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <CompanyManagementGuard>
      <RouteGuard permissions={["COMPANY_READ"]}>
        <CompanyEditor publicId={resolvedParams.publicId} />
      </RouteGuard>
    </CompanyManagementGuard>
  );
}
