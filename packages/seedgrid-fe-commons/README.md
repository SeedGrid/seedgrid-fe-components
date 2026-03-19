# @seedgrid/fe-commons

Coleção de utilitários leves para chamadas HTTP, consulta de CEP e CNPJ que já respeitam o estilo SeedGrid.

## Características

- `createHttpClient` monta clientes `fetch` com `baseUrl`, `Content-Type` e autenticação automática via `Bearer`.
- `buscarCep` consome o serviço oficial ViaCEP com validação e erros amigáveis.
- `buscarCnpj` consulta o Publica CNPJ, retorna dados cadastrais completos e protege contra CNPJs inválidos.
- Tipagens exportadas (`ViaCepResponse`, `PublicaCnpjResponse`, opções de lookup) para completar formulários ou serviços de validação.

## Instalação

```bash
pnpm add @seedgrid/fe-commons
```

## Como utilizar

```tsx
import { createHttpClient, buscarCep, buscarCnpj } from "@seedgrid/fe-commons";

const apiClient = createHttpClient({
  baseUrl: "https://api.seedgrid.com.br",
  getAccessToken: () => localStorage.getItem("sg:session-token")
});

async function carregarEndereco() {
  const cep = await buscarCep("01001-000");
  console.log("Cidade:", cep.localidade, cep.uf);
}

async function detalharEmpresa() {
  const empresa = await buscarCnpj("10404812000100");
  console.log("Razão social:", empresa?.razao_social);
}

async function buscarDashboard() {
  const dados = await apiClient.request("/v1/dashboard");
  return dados;
}
```

## Recursos

- [ViaCEP](https://viacep.com.br) — consulta pública de CEPs com cache-friendly JSON.
- [Publica CNPJ](https://publica.cnpj.ws) — APIs abertas com histórico completo de sócios, natureza jurídica e endereços.
- `fetch` nativo + `Headers` prontos, ideal para serviços SeedGrid que usam Bearer tokens.

## Exemplos

- **Formulário de cadastro**: invoque `buscarCep` no campo de CEP e prefira preencher `logradouro`, `bairro` e `cidade` automaticamente.
- **Validação fiscal**: use `buscarCnpj` para confirmar se uma empresa aceita pagamentos e exibir o nome fantasia detalhado.
- **Camada HTTP compartilhada**: `createHttpClient` garante `Content-Type: application/json` e adiciona `Authorization` apenas quando o token estiver presente.

