const pool = require("../../configs/db");


async function getSalasService() {
    try {
        const [result] = await pool.execute("Select * from esportes");

        return result
    } catch (error) {
        throw new Error("Erro ao buscar salas"+error.message);
    }    
}

async function getChatService(id) {
    try {
        const [result] = await pool.execute("Select chat.*, usuarios.tipo as tipo_user, usuarios.nome from chat INNER JOIN usuarios ON chat.id_usuario = usuarios.id where id_esporte = ?", [id]);

        return result
    } catch (error) {
        throw new Error("Erro ao buscar chat "+error.message);
    }    
}

async function sendChatService(id_chat, id_user, mensagem) {
    try {
        const [result] = await pool.execute("INSERT INTO chat (id_esporte, id_usuario, tipo, conteudo) VALUES (?, ?, 'usuario', ?)", [id_chat, id_user, mensagem]);

        return result
    } catch (error) {
        throw new Error("Erro ao gravar mensagem "+error.message);
    }
    
}

module.exports = {
    getSalasService,
    getChatService,
    sendChatService
}