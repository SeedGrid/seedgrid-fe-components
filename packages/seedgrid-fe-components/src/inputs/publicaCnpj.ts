/** Consulta padrao da base publica de CNPJ (publica.cnpj.ws). Resposta nao-2xx vira `null` ("nao achou"). */
export const defaultPublicaCnpjFetch = async (cnpj: string) => {
  const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
  if (!response.ok) return null;
  return response.json();
};
