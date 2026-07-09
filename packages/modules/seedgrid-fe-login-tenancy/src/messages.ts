// Mensagens das telas do login-tenancy (scaffold/src/app/**). Pacote construido
// do zero nesta sessao — as telas referenciavam chaves `login_tenancy.*` que
// nao existiam em catalogo nenhum (o `t()` recusava, ~90 erros de tipo). Este
// bundle registra todas; o CLI o funde no catalogo do app via o campo
// `messages` do module.ts. Ver scaffold/README.md.

const en = {
  // Selecao de empresa pos-login
  "login_tenancy.select_company.title": "Choose a company",
  "login_tenancy.select_company.description":
    "Your account has access to more than one company. Pick which one to sign in to.",
  "login_tenancy.select_company.picker_description": "Select the company you want to access.",
  "login_tenancy.select_company.field_label": "Company",
  "login_tenancy.select_company.confirm": "Continue",
  "login_tenancy.select_company.cancel": "Back to login",

  // Signup institucional
  "login_tenancy.signup.header.eyebrow": "Company sign-up",
  "login_tenancy.signup.header.title": "Create your company account",

  "login_tenancy.signup.steps.company": "Company",
  "login_tenancy.signup.steps.address": "Address",
  "login_tenancy.signup.steps.responsible": "Legal representative",
  "login_tenancy.signup.steps.review": "Review",

  "login_tenancy.signup.wizard.previous": "Back",
  "login_tenancy.signup.wizard.next": "Next",
  "login_tenancy.signup.wizard.finish": "Create account",
  "login_tenancy.signup.wizard.finishing": "Creating…",

  "login_tenancy.signup.fields.cnpj.label": "CNPJ",
  "login_tenancy.signup.fields.cnpj.required": "CNPJ is required.",
  "login_tenancy.signup.fields.cnpj.lookup_error": "Could not look up this CNPJ.",
  "login_tenancy.signup.fields.corporate_name.label": "Legal name",
  "login_tenancy.signup.fields.corporate_name.required": "Legal name is required.",
  "login_tenancy.signup.fields.trade_name.label": "Trade name",
  "login_tenancy.signup.fields.trade_name.required": "Trade name is required.",
  "login_tenancy.signup.fields.address_phone.label": "Company phone",
  "login_tenancy.signup.fields.address_phone.required": "Company phone is required.",

  "login_tenancy.signup.fields.postal_code.label": "Postal code",
  "login_tenancy.signup.fields.postal_code.required": "Postal code is required.",
  "login_tenancy.signup.fields.postal_code.lookup_error": "Could not look up this postal code.",
  "login_tenancy.signup.fields.street.label": "Street",
  "login_tenancy.signup.fields.street.required": "Street is required.",
  "login_tenancy.signup.fields.number.label": "Number",
  "login_tenancy.signup.fields.number.required": "Number is required.",
  "login_tenancy.signup.fields.complement.label": "Complement",
  "login_tenancy.signup.fields.district.label": "District",
  "login_tenancy.signup.fields.district.required": "District is required.",
  "login_tenancy.signup.fields.state.label": "State",
  "login_tenancy.signup.fields.city.label": "City",

  "login_tenancy.signup.fields.cpf.label": "CPF",
  "login_tenancy.signup.fields.cpf.required": "CPF is required.",
  "login_tenancy.signup.fields.first_name.label": "First name",
  "login_tenancy.signup.fields.first_name.required": "First name is required.",
  "login_tenancy.signup.fields.last_name.label": "Last name",
  "login_tenancy.signup.fields.last_name.required": "Last name is required.",
  "login_tenancy.signup.fields.birth_date.label": "Date of birth",
  "login_tenancy.signup.fields.birth_date.required": "Date of birth is required.",
  "login_tenancy.signup.fields.phone.label": "Phone",
  "login_tenancy.signup.fields.phone.required": "Phone is required.",
  "login_tenancy.signup.fields.whatsapp.label": "WhatsApp",
  "login_tenancy.signup.fields.root_email.label": "Email",
  "login_tenancy.signup.fields.root_email.required": "Email is required.",
  "login_tenancy.signup.fields.root_password.label": "Password",
  "login_tenancy.signup.fields.root_password.required": "Password is required.",
  "login_tenancy.signup.fields.confirm_password.label": "Confirm password",
  "login_tenancy.signup.fields.confirm_password.required": "Please confirm your password.",
  "login_tenancy.signup.fields.confirm_password.mismatch": "Passwords do not match.",

  "login_tenancy.signup.email_check.checking": "Checking e-mail…",
  "login_tenancy.signup.email_check.linking_notice":
    "This e-mail already has an account — the new company will be linked to it, and no new password is needed.",

  "login_tenancy.signup.summary.company": "Company",
  "login_tenancy.signup.summary.cnpj": "CNPJ",
  "login_tenancy.signup.summary.corporate_name": "Legal name",
  "login_tenancy.signup.summary.trade_name": "Trade name",
  "login_tenancy.signup.summary.address": "Address",
  "login_tenancy.signup.summary.street": "Street",
  "login_tenancy.signup.summary.number": "Number",
  "login_tenancy.signup.summary.complement": "Complement",
  "login_tenancy.signup.summary.city": "City",
  "login_tenancy.signup.summary.state": "State",
  "login_tenancy.signup.summary.district": "District",
  "login_tenancy.signup.summary.postal_code": "Postal code",
  "login_tenancy.signup.summary.phone": "Phone",
  "login_tenancy.signup.summary.responsible": "Legal representative",
  "login_tenancy.signup.summary.name": "Name",
  "login_tenancy.signup.summary.cpf": "CPF",
  "login_tenancy.signup.summary.birth_date": "Date of birth",
  "login_tenancy.signup.summary.whatsapp": "WhatsApp",
  "login_tenancy.signup.summary.root_email": "Email",

  "login_tenancy.signup.verification.badge": "Almost there",
  "login_tenancy.signup.verification.title": "Confirm your e-mail",
  "login_tenancy.signup.verification.description":
    "We sent a 6-digit code to {email}. Enter it below to activate your account.",
  "login_tenancy.signup.verification.code.label": "Confirmation code",
  "login_tenancy.signup.verification.code.hint": "6 digits, shown as 999-999.",
  "login_tenancy.signup.verification.code.required": "The confirmation code is required.",
  "login_tenancy.signup.verification.code.invalid": "Enter the full 6-digit code.",
  "login_tenancy.signup.verification.resend": "Resend code",
  "login_tenancy.signup.verification.resent": "A new code has been sent.",
  "login_tenancy.signup.verification.validating": "Validating code…",
  "login_tenancy.signup.verification.idle": "Enter the code we sent to your e-mail.",

  "login_tenancy.signup.feedback.submit_unavailable":
    "Could not create your account right now. Please try again.",
  "login_tenancy.signup.feedback.validate_unavailable":
    "Could not validate the code right now. Please try again.",
  "login_tenancy.signup.feedback.resend_unavailable":
    "Could not resend the code right now. Please try again.",
};

const ptBr = {
  "login_tenancy.select_company.title": "Escolha uma empresa",
  "login_tenancy.select_company.description":
    "Sua conta tem acesso a mais de uma empresa. Escolha em qual entrar.",
  "login_tenancy.select_company.picker_description": "Selecione a empresa que deseja acessar.",
  "login_tenancy.select_company.field_label": "Empresa",
  "login_tenancy.select_company.confirm": "Continuar",
  "login_tenancy.select_company.cancel": "Voltar ao login",

  "login_tenancy.signup.header.eyebrow": "Cadastro de empresa",
  "login_tenancy.signup.header.title": "Crie a conta da sua empresa",

  "login_tenancy.signup.steps.company": "Empresa",
  "login_tenancy.signup.steps.address": "Endereço",
  "login_tenancy.signup.steps.responsible": "Representante legal",
  "login_tenancy.signup.steps.review": "Revisão",

  "login_tenancy.signup.wizard.previous": "Voltar",
  "login_tenancy.signup.wizard.next": "Avançar",
  "login_tenancy.signup.wizard.finish": "Criar conta",
  "login_tenancy.signup.wizard.finishing": "Criando…",

  "login_tenancy.signup.fields.cnpj.label": "CNPJ",
  "login_tenancy.signup.fields.cnpj.required": "O CNPJ é obrigatório.",
  "login_tenancy.signup.fields.cnpj.lookup_error": "Não foi possível consultar este CNPJ.",
  "login_tenancy.signup.fields.corporate_name.label": "Razão social",
  "login_tenancy.signup.fields.corporate_name.required": "A razão social é obrigatória.",
  "login_tenancy.signup.fields.trade_name.label": "Nome fantasia",
  "login_tenancy.signup.fields.trade_name.required": "O nome fantasia é obrigatório.",
  "login_tenancy.signup.fields.address_phone.label": "Telefone da empresa",
  "login_tenancy.signup.fields.address_phone.required": "O telefone da empresa é obrigatório.",

  "login_tenancy.signup.fields.postal_code.label": "CEP",
  "login_tenancy.signup.fields.postal_code.required": "O CEP é obrigatório.",
  "login_tenancy.signup.fields.postal_code.lookup_error": "Não foi possível consultar este CEP.",
  "login_tenancy.signup.fields.street.label": "Logradouro",
  "login_tenancy.signup.fields.street.required": "O logradouro é obrigatório.",
  "login_tenancy.signup.fields.number.label": "Número",
  "login_tenancy.signup.fields.number.required": "O número é obrigatório.",
  "login_tenancy.signup.fields.complement.label": "Complemento",
  "login_tenancy.signup.fields.district.label": "Bairro",
  "login_tenancy.signup.fields.district.required": "O bairro é obrigatório.",
  "login_tenancy.signup.fields.state.label": "UF",
  "login_tenancy.signup.fields.city.label": "Cidade",

  "login_tenancy.signup.fields.cpf.label": "CPF",
  "login_tenancy.signup.fields.cpf.required": "O CPF é obrigatório.",
  "login_tenancy.signup.fields.first_name.label": "Nome",
  "login_tenancy.signup.fields.first_name.required": "O nome é obrigatório.",
  "login_tenancy.signup.fields.last_name.label": "Sobrenome",
  "login_tenancy.signup.fields.last_name.required": "O sobrenome é obrigatório.",
  "login_tenancy.signup.fields.birth_date.label": "Data de nascimento",
  "login_tenancy.signup.fields.birth_date.required": "A data de nascimento é obrigatória.",
  "login_tenancy.signup.fields.phone.label": "Telefone",
  "login_tenancy.signup.fields.phone.required": "O telefone é obrigatório.",
  "login_tenancy.signup.fields.whatsapp.label": "WhatsApp",
  "login_tenancy.signup.fields.root_email.label": "E-mail",
  "login_tenancy.signup.fields.root_email.required": "O e-mail é obrigatório.",
  "login_tenancy.signup.fields.root_password.label": "Senha",
  "login_tenancy.signup.fields.root_password.required": "A senha é obrigatória.",
  "login_tenancy.signup.fields.confirm_password.label": "Confirmar senha",
  "login_tenancy.signup.fields.confirm_password.required": "Confirme sua senha.",
  "login_tenancy.signup.fields.confirm_password.mismatch": "As senhas não conferem.",

  "login_tenancy.signup.email_check.checking": "Verificando e-mail…",
  "login_tenancy.signup.email_check.linking_notice":
    "Este e-mail já tem conta — a nova empresa será vinculada a ela, e não é preciso uma nova senha.",

  "login_tenancy.signup.summary.company": "Empresa",
  "login_tenancy.signup.summary.cnpj": "CNPJ",
  "login_tenancy.signup.summary.corporate_name": "Razão social",
  "login_tenancy.signup.summary.trade_name": "Nome fantasia",
  "login_tenancy.signup.summary.address": "Endereço",
  "login_tenancy.signup.summary.street": "Logradouro",
  "login_tenancy.signup.summary.number": "Número",
  "login_tenancy.signup.summary.complement": "Complemento",
  "login_tenancy.signup.summary.city": "Cidade",
  "login_tenancy.signup.summary.state": "UF",
  "login_tenancy.signup.summary.district": "Bairro",
  "login_tenancy.signup.summary.postal_code": "CEP",
  "login_tenancy.signup.summary.phone": "Telefone",
  "login_tenancy.signup.summary.responsible": "Representante legal",
  "login_tenancy.signup.summary.name": "Nome",
  "login_tenancy.signup.summary.cpf": "CPF",
  "login_tenancy.signup.summary.birth_date": "Data de nascimento",
  "login_tenancy.signup.summary.whatsapp": "WhatsApp",
  "login_tenancy.signup.summary.root_email": "E-mail",

  "login_tenancy.signup.verification.badge": "Quase lá",
  "login_tenancy.signup.verification.title": "Confirme seu e-mail",
  "login_tenancy.signup.verification.description":
    "Enviamos um código de 6 dígitos para {email}. Informe-o abaixo para ativar sua conta.",
  "login_tenancy.signup.verification.code.label": "Código de confirmação",
  "login_tenancy.signup.verification.code.hint": "6 dígitos, exibido como 999-999.",
  "login_tenancy.signup.verification.code.required": "O código de confirmação é obrigatório.",
  "login_tenancy.signup.verification.code.invalid": "Informe os 6 dígitos completos.",
  "login_tenancy.signup.verification.resend": "Reenviar código",
  "login_tenancy.signup.verification.resent": "Um novo código foi enviado.",
  "login_tenancy.signup.verification.validating": "Validando código…",
  "login_tenancy.signup.verification.idle": "Informe o código que enviamos para seu e-mail.",

  "login_tenancy.signup.feedback.submit_unavailable":
    "Não foi possível criar sua conta agora. Tente novamente.",
  "login_tenancy.signup.feedback.validate_unavailable":
    "Não foi possível validar o código agora. Tente novamente.",
  "login_tenancy.signup.feedback.resend_unavailable":
    "Não foi possível reenviar o código agora. Tente novamente.",
};

export const loginTenancyMessages = {
  en,
  es: { ...en },
  fr: { ...en },
  "pt-BR": { ...en, ...ptBr },
  "pt-PT": { ...en, ...ptBr },
} as const;
