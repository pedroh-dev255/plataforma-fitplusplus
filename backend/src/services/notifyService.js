const admin = require("../../configs/firebase");
const pool = require("../../configs/db");




async function sendNotification(id, title, body, data = {}) {

  const token = await verifyService(id);
  if (!token) {
    throw new Error("Token não encontrado para o usuário");
  }

  const cadNoti = await cadNotificacao(id, title, body);

  if (!cadNoti) {
    throw new Error("Erro ao cadastrar notificação");
  }

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
    //console.log("Notificação enviada:", response);
    return response;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    throw error;
  }
}

async function cadTokenFirebaseService(id, token) {
  try {
    // verifica se já existe um token para o usuário
    const verificacao = await verifyService(id);
    if (verificacao) {
      // atualiza o token existente
      const [result] = await pool.query(
        "UPDATE tokens_notificacao SET token = ? WHERE usuario_id = ?",
        [token, id]
      );
      return "Atualizado com sucesso";
    }
    // insere um novo token
    const [result] = await pool.query(
      "INSERT INTO tokens_notificacao (usuario_id, token) VALUES (?, ?)",
      [id, token]
    );
    return "Cadastrado com sucesso";

  } catch (error) {
    console.error("Erro ao cadastrar token:", error);
    throw error;
  }
}

async function cadNotificacao(id, title, body) {
  try {
    const [result] = await pool.query(
      "INSERT INTO notificacoes (usuario_id, title, body) VALUES (?, ?, ?)",
      [id, title, body]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erro ao cadastrar notificação:", error);
    throw error;
  }
  
}

async function verifyService(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM tokens_notificacao WHERE usuario_id = ?", [id]);
    return rows.length > 0 ? rows[0].token : null;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    throw error;
  }
  
}

module.exports = { cadTokenFirebaseService, sendNotification, verifyService };
