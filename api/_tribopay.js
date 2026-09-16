const CASH_API_URL = "https://api.tribopay.com.br/api/public/cash";

function sendJson(response, statusCode, body) {
  response.status(statusCode).setHeader("Cache-Control", "no-store").json(body);
}

async function cashRequest(path, options = {}) {
  const token = process.env.TRIBOPAY_CASH_API_TOKEN;
  if (!token) throw new Error("Configuração de pagamento indisponível.");

  const response = await fetch(`${CASH_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "Não foi possível processar o pagamento.");
    error.statusCode = response.status;
    throw error;
  }
  return body;
}

function publicOrigin(request) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  return `${protocol}://${host}`;
}

module.exports = { cashRequest, publicOrigin, sendJson };
