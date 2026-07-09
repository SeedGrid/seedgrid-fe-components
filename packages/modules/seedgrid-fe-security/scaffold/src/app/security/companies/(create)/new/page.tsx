import { CompanyManagementGuard, RouteGuard } from "@/modules/security";
import { CompanyEditor } from "@/app/security/companies/editors/CompanyEditor";

export default function NewCompanyPage() {
  return (
    <CompanyManagementGuard>
      <RouteGuard permissions={["COMPANY_CREATE"]}>
        <CompanyEditor />
      </RouteGuard>
    </CompanyManagementGuard>
  );
}
