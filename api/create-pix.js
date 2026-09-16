const { publicApiRequest, publicOrigin, sendJson, isValidCpf } = require("./_tribopay_public");
const QRCode = require("qrcode");

const OFFER_HASH_BY_AMOUNT = Object.freeze({
  1000: process.env.TRIBOPAY_OFFER_HASH_10,
  2500: process.env.TRIBOPAY_OFFER_HASH_25,
  5000: process.env.TRIBOPAY_OFFER_HASH_50,
  10000: process.env.TRIBOPAY_OFFER_HASH_100,
});

module.exports = async (request, response) => {
  if (request.method !== "POST") return sendJson(response, 405, { message: "Método não permitido." });

  const amount = Number(request.body?.amount);
  const fullName = String(request.body?.name || `${request.body?.firstName || ""} ${request.body?.lastName || ""}`)
    .trim()
    .replace(/\s+/g, " ");
  const email = String(request.body?.email || "").trim().toLowerCase();
  const phone = String(request.body?.phone || "").replace(/\D/g, "");
  const cpf = String(request.body?.cpf || "").replace(/\D/g, "");
  const offerHash = String(OFFER_HASH_BY_AMOUNT[amount] || "").trim();
  if (!Number.isSafeInteger(amount) || !offerHash) {
    return sendJson(response, 422, { message: "Escolha uma das doações disponíveis: R$ 10, R$ 25, R$ 50 ou R$ 100." });
  }
  if (fullName.length < 5 || fullName.length > 120 || fullName.split(" ").length < 2) {
    return sendJson(response, 422, { message: "Informe nome e sobrenome válidos." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || phone.length > 13 || !isValidCpf(cpf)) {
    return sendJson(response, 422, { message: "Informe telefone, e-mail e CPF válidos para gerar o PIX." });
  }

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
        customer: { name: fullName, email, phone_number: phone, document: cpf },
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
    const data = transaction.data || transaction || {};
    const pixCode = data.pix_code || data.pix?.pix_qr_code;
    const providerQrCode = data.qr_code || data.pix?.qr_code_base64;
    if (!data.hash || !pixCode) {
      return sendJson(response, 422, { message: "A TriboPay não liberou esta cobrança PIX. Tente novamente em alguns segundos." });
    }
    const qrCode = providerQrCode || await QRCode.toDataURL(pixCode, { type: "image/png", margin: 1, width: 420 });
    return sendJson(response, 201, {
      id: data.hash,
      status: data.status || data.payment_status || "pending",
      amount: data.amount || amount,
      pix: { code: pixCode, imageBase64: qrCode },
    });
  } catch (error) {
    console.error("TriboPay Public API create PIX failed", { statusCode: error.statusCode, message: error.message });
    return sendJson(response, error.statusCode && error.statusCode < 500 ? error.statusCode : 502, {
      message: error.message || "Não foi possível gerar o PIX.",
    });
  }
};
