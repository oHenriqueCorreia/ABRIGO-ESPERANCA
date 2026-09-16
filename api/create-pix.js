const { publicApiRequest, publicOrigin, sendJson, isValidCpf } = require("./_tribopay_public");

const MIN_DEPOSIT_CENTS = 500;
const MAX_DEPOSIT_CENTS = 2000000;

module.exports = async (request, response) => {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Método não permitido." });

  const amount = Number(request.body?.amount);
  const firstName = String(request.body?.firstName || "").trim();
  const lastName = String(request.body?.lastName || "").trim();
  const email = String(request.body?.email || "").trim().toLowerCase();
  const phone = String(request.body?.phone || "").replace(/\D/g, "");
  const cpf = String(request.body?.cpf || "").replace(/\D/g, "");
  if (!Number.isSafeInteger(amount) || amount < MIN_DEPOSIT_CENTS || amount > MAX_DEPOSIT_CENTS) {
    return sendJson(response, 422, { message: "Informe um valor entre R$ 5,00 e R$ 20.000,00." });
  }
  if (firstName.length < 2 || lastName.length < 2 || firstName.length + lastName.length > 120) {
    return sendJson(response, 422, { message: "Informe nome e sobrenome válidos." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || phone.length > 13 || !isValidCpf(cpf)) {
    return sendJson(response, 422, { message: "Informe telefone, e-mail e CPF válidos para gerar o PIX." });
  }

  const offerHash = String(process.env.TRIBOPAY_OFFER_HASH || "").trim();
  const productHash = String(process.env.TRIBOPAY_PRODUCT_HASH || "").trim();
  if (!offerHash || !productHash) {
    return sendJson(response, 503, { message: "A configuração do produto de doação ainda não foi liberada pela TriboPay." });
  }

  try {
    const transaction = await publicApiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify({
        amount,
        offer_hash: offerHash,
        payment_method: "pix",
        customer: { name: `${firstName} ${lastName}`, email, phone_number: phone, document: cpf },
        cart: [{
          product_hash: productHash,
          title: process.env.TRIBOPAY_PRODUCT_TITLE || "Doação — Ajude Quem Precisa",
          cover: null,
          price: amount,
          quantity: 1,
          operation_type: 1,
          tangible: false,
        }],
        expire_in_days: 1,
        transaction_origin: "api",
        postback_url: `${publicOrigin(request)}/api/tribopay-webhook`,
      }),
    });
    const data = transaction.data || {};
    if (!data.hash || !data.pix_code || !data.qr_code) {
      return sendJson(response, 422, { message: "A TriboPay não liberou esta cobrança PIX. Tente novamente em alguns segundos." });
    }
    return sendJson(response, 201, {
      id: data.hash,
      status: data.status || "pending",
      amount: data.amount || amount,
      pix: { code: data.pix_code, imageBase64: data.qr_code },
    });
  } catch (error) {
    console.error("TriboPay Public API create PIX failed", { statusCode: error.statusCode, message: error.message });
    return sendJson(response, error.statusCode && error.statusCode < 500 ? error.statusCode : 502, {
      message: error.message || "Não foi possível gerar o PIX.",
    });
  }
};
