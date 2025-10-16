const { getSalasService, getChatService, sendChatService } = require("../services/forumService.js");

async function getSalas(req, res) {
    try {
        const resposta = await getSalasService();
        return res.status(200).json({
            success: true,
            salas: resposta 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro " + error.message
        })
    }
    
}

async function getChat(req, res) {
    const {id_sala} = req.body;
    if(!id_sala){
        return res.status(400).json({
            success: false,
            message: "envie o codigo da sala"
        })
    }
    try {

        const resposta = await getChatService(id_sala);
        return res.status(200).json({
            success: true,
            chat: resposta 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro " + error.message
        })
    }
}

async function SendText(req, res) {
    const {id_sala, id_user, body} = req.body;

    if(!id_sala || !id_user || !body){
        return res.status(400).json({
            success: false,
            message: "envie id_sala, id_user, body"
        })
    }
    try {
        const resposta = await sendChatService(id_sala, id_user, body);
        return res.status(200).json({
            success: true,
            chat: resposta 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro " + error.message
        })
    }
    
}

module.exports = {
    getSalas,
    getChat,
    SendText
}