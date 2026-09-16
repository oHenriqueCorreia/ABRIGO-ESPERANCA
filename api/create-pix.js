const { cashRequest, publicOrigin, sendJson } = require("./_tribopay");

module.exports = async (request, response) => {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Método não permitido." });
  const amount = Number(request.body?.amount);
  const name = String(request.body?.name || "").trim();
  const phone = String(request.body?.phone || "").replace(/\D/g, "");
  if (!Number.isSafeInteger(amount) || amount < 100 || amount > 500000000) {
    return sendJson(response, 422, { message: "Informe um valor entre R$ 1,00 e R$ 5.000.000,00." });
  }
  if (name.length < 2 || name.length > 120 || phone.length < 10 || phone.length > 13) {
    return sendJson(response, 422, { message: "Informe nome e telefone válidos para gerar o PIX." });
  }
  // A Cash API exige o campo e-mail. O checkout não coleta e-mail do doador,
  // então cada cobrança recebe um identificador técnico único.
  const externalId = `doacao_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const payerEmail = `${externalId}@ajude-quem-precisa.vercel.app`;
  try {
    const deposit = await cashRequest("/deposits/pix", {
      method: "POST",
      body: JSON.stringify({
        amount,
        externalId,
        postbackUrl: `${publicOrigin(request)}/api/tribopay-webhook`,
        method: "pix",
        transactionOrigin: "cashin",
        payer: { name, email: payerEmail, phone: { number: phone } },
      }),
    });
    return sendJson(response, 201, { id: deposit.id, status: deposit.status, amount: deposit.amount, pix: deposit.pix });
  } catch (error) {
    console.error("TriboPay create PIX failed", error.message);
    return sendJson(response, error.statusCode && error.statusCode < 500 ? error.statusCode : 502, { message: error.message || "Não foi possível gerar o PIX." });
  }
};
