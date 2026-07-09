// seedgrid:managed

export type PublicTenantSignupFormValues = {
  subdomain: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressPostalCode: string;
  addressCity: string;
  addressState: string;
  addressDistrict: string;
  addressPhone: string;
  legalFirstName: string;
  legalLastName: string;
  legalCpf: string;
  legalBirthDate: string;
  legalPhone: string;
  legalWhatsapp: string;
  rootEmail: string;
  plainRootPassword: string;
  confirmPassword: string;
};

export type CreatePublicTenantPayload = {
  subdomain: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  address: {
    street: string;
    number: string;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    district: string;
    phone: string;
  };
  legalRepresentative: {
    firstName: string;
    lastName: string;
    cpf: string;
    birthDate: string;
    phone: string;
    whatsapp: string;
    name: string;
  };
  rootEmail: string;
  plainRootPassword: string;
};

export type CreatePublicTenantActionResult =
  | {
      ok: true;
      tenantSubdomain: string;
      rootEmail: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
      status?: number;
    };

export function createEmptyPublicTenantSignupForm(): PublicTenantSignupFormValues {
  return {
    subdomain: "",
    cnpj: "",
    corporateName: "",
    tradeName: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressPostalCode: "",
    addressCity: "",
    addressState: "",
    addressDistrict: "",
    addressPhone: "",
    legalFirstName: "",
    legalLastName: "",
    legalCpf: "",
    legalBirthDate: "",
    legalPhone: "",
    legalWhatsapp: "",
    rootEmail: "",
    plainRootPassword: "",
    confirmPassword: "",
  };
}

export function buildCreatePublicTenantPayload(
  values: PublicTenantSignupFormValues
): CreatePublicTenantPayload {
  const representativeName = [values.legalFirstName, values.legalLastName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  return {
    subdomain: values.subdomain.trim().toLowerCase(),
    cnpj: values.cnpj.trim(),
    corporateName: values.corporateName.trim(),
    tradeName: values.tradeName.trim(),
    address: {
      street: values.addressStreet.trim(),
      number: values.addressNumber.trim(),
      complement: values.addressComplement.trim(),
      postalCode: values.addressPostalCode.trim(),
      city: values.addressCity.trim(),
      state: values.addressState.trim().toUpperCase(),
      district: values.addressDistrict.trim(),
      phone: values.addressPhone.trim(),
    },
    legalRepresentative: {
      firstName: values.legalFirstName.trim(),
      lastName: values.legalLastName.trim(),
      cpf: values.legalCpf.trim(),
      birthDate: values.legalBirthDate.trim(),
      phone: values.legalPhone.trim(),
      whatsapp: values.legalWhatsapp.trim(),
      name: representativeName,
    },
    rootEmail: values.rootEmail.trim(),
    plainRootPassword: values.plainRootPassword,
  };
}
