const { cashRequest, sendJson } = require("./_tribopay");

module.exports = async (request, response) => {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Método não permitido." });
  const id = String(request.body?.id || "");
  if (!id) return sendJson(response, 400, { message: "Evento inválido." });
  try {
    const deposit = await cashRequest(`/deposits/${encodeURIComponent(id)}`);
    console.info("TriboPay webhook confirmado", { id: deposit.id, status: deposit.status });
    return sendJson(response, 200, { received: true });
  } catch (error) {
    console.error("TriboPay webhook rejected", error.message);
    return sendJson(response, 400, { received: false });
  }
};
