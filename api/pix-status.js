const { cashRequest, sendJson } = require("./_tribopay");

module.exports = async (request, response) => {
  if (request.method !== "GET") return sendJson(response, 405, { message: "Método não permitido." });
  const id = String(request.query?.id || "");
  if (!/^[A-Za-z0-9_-]{6,200}$/.test(id)) return sendJson(response, 400, { message: "Cobrança inválida." });
  try {
    const deposit = await cashRequest(`/deposits/${encodeURIComponent(id)}`);
    return sendJson(response, 200, { id: deposit.id, status: deposit.status, amount: deposit.amount });
  } catch (error) {
    console.error("TriboPay PIX status failed", error.message);
    return sendJson(response, error.statusCode && error.statusCode < 500 ? error.statusCode : 502, { message: "Não foi possível consultar o pagamento." });
  }
};
