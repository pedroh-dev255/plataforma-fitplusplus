const { sendNotification, cadTokenFirebaseService, verifyService } = require('../services/notifyService');


async function sendNotificationController(req,res) {
    const { id, title, body, data } = req.body;

    if (!id || !title || !body) {
        return res.status(400).json({
            success: false,
            message: 'Id do usuario, título e corpo são obrigatórios',
        });
    }
    try {
        const response = await sendNotification(id, title, body, data);
        return res.status(200).json({ success: true, response });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao enviar notificação',
        });
    }
}

async function cadTokenFirebaseController(req,res) {
    const { id, token } = req.body;
    //console.log('cadTokenFirebaseController', req.body);
    if (!id || !token) {
        return res.status(400).json({
            success: false,
            message: 'ID e token são obrigatórios',
        });
    }

    try {
        const response = await cadTokenFirebaseService(id, token);
        return res.status(200).json({ success: true, response });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao cadastrar token',
        });
    }
}

async function verifyController(req,res) {
    //rota GET verify/:id
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID é obrigatório',
        });
    }

    try {
        const response = await verifyService(id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Token não encontrado',
            });
        }
        return res.status(200).json({ success: true, token: response });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar token',
        });
    }

}


module.exports = {
    sendNotificationController,
    cadTokenFirebaseController,
    verifyController
};