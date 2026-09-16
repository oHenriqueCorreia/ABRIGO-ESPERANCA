const { publicApiRequest, sendJson } = require("./_tribopay_public");

module.exports = async (request, response) => {
  if (request.method !== "GET") return sendJson(response, 405, { message: "Método não permitido." });
  const id = String(request.query?.id || "");
  if (!/^[A-Za-z0-9_-]{6,200}$/.test(id)) return sendJson(response, 400, { message: "Cobrança inválida." });

  try {
    const transaction = await publicApiRequest(`/transactions/${encodeURIComponent(id)}`);
    const data = transaction.data || {};
    return sendJson(response, 200, { id: data.hash || id, status: data.status || "pending", amount: data.amount });
  } catch (error) {
    console.error("TriboPay Public API PIX status failed", { statusCode: error.statusCode, message: error.message });
    return sendJson(response, error.statusCode && error.statusCode < 500 ? error.statusCode : 502, {
      message: "Não foi possível consultar o pagamento.",
    });
  }
};
