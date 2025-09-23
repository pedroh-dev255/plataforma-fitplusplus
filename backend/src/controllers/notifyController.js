const { sendNotification, cadTokenFirebaseService } = require('../services/notifyService');


async function sendNotificationController(req,res) {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({
            success: false,
            message: 'Token, título e corpo são obrigatórios',
        });
    }
    try {
        const response = await sendNotification(token, title, body, data);
        return res.status(200).json({ success: true, response });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao enviar notificação',
        });
    }
}

async function cadTokenFirebaseController(req,res) {

}


module.exports = {
    sendNotificationController,
    cadTokenFirebaseController
};