const TRIBOPAY_PUBLIC_API_URL = "https://api.tribopay.com.br/api/public/v1";

function sendJson(response, statusCode, body) {
  response.status(statusCode).setHeader("Cache-Control", "no-store").json(body);
}

function publicOrigin(request) {
  const configuredOrigin = String(process.env.PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (configuredOrigin) return configuredOrigin;
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  return `${protocol}://${host}`;
}

async function publicApiRequest(path, options = {}) {
  const token = String(process.env.TRIBOPAY_PUBLIC_API_TOKEN || "").trim();
  if (!token) {
    const error = new Error("Configuração da API Pública TriboPay indisponível.");
    error.statusCode = 503;
    throw error;
  }

  const url = new URL(`${TRIBOPAY_PUBLIC_API_URL}${path}`);
  url.searchParams.set("api_token", token);
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    const error = new Error(body.message || body.error || "Não foi possível processar o pagamento.");
    error.statusCode = response.status || 502;
    throw error;
  }
  return body;
}

function isValidCpf(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const calculateDigit = (length) => {
    let total = 0;
    for (let index = 0; index < length; index += 1) total += Number(cpf[index]) * (length + 1 - index);
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

module.exports = { publicApiRequest, publicOrigin, sendJson, isValidCpf };
