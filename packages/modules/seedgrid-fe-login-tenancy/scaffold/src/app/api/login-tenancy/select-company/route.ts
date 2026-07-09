import { NextRequest, NextResponse } from "next/server";

import { getLoginTenancyServer } from "@/modules/login-tenancy/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { companyPublicId?: string };
  const companyPublicId = body.companyPublicId?.trim();

  if (!companyPublicId) {
    return NextResponse.json({ message: "companyPublicId is required." }, { status: 400 });
  }

  try {
    const tenancy = await getLoginTenancyServer();
    const outcome = await tenancy.selectCompany(companyPublicId);

    // O SelectCompanyResult que o CompanyScopePicker espera: kind "signed_in"
    // quando o token foi re-escopado e persistido (a rota já aplicou os
    // cookies), qualquer outro kind quando o backend recusou a seleção.
    if (outcome.signedIn) {
      return NextResponse.json({ kind: "signed_in" });
    }

    return NextResponse.json({
      kind: "error",
      message: "Could not select this company.",
    });
  } catch (error) {
    return NextResponse.json(
      { kind: "error", message: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
