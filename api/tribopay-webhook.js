const { sendJson } = require("./_tribopay_public");

module.exports = async (request, response) => {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Método não permitido." });

  const event = request.body?.data || request.body || {};
  console.info("TriboPay API Pública webhook recebido", {
    id: String(event.transaction_hash || event.hash || ""),
    status: String(event.status || "pending"),
  });
  return sendJson(response, 200, { received: true });
};
