const admin = require("../../configs/firebase");

async function sendNotification(token, title, body, data = {}) {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data, // dados extras opcionais
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notificação enviada:", response);
    return response;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    throw error;
  }
}

module.exports = { sendNotification };
