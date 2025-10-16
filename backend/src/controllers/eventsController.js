const { getEventsService, createEventService, addPartService } = require('../services/eventsService');

async function getEvents(req, res) {
    const { userId, dtinicio, dtfim } = req.body;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'userId é obrigatório',
        });
    }
    try {
        const events = await getEventsService(userId, dtinicio, dtfim);
        return res.status(200).json({ success: true, events });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function createEvent(req, res) {
    try {
        const {id_prof, esporte, tipo, titulo, desc, local, lat, long, dth, max } = req.body;

        if(!id_prof || !tipo || !esporte || !titulo || !dth || !max ){
            return res.status(400).json({
                success: false,
                message: "Dados incompletos!"
            });
        }

        const result = await createEventService(id_prof, esporte, tipo, titulo, desc, local, lat, long, dth, max);

        if(!result){
            throw new Error("Evento não cadastrado");
        }

        return res.status(200).json({
            success: true,
            message: "Evento cadastrado."
        });

    } catch (err){
        return res.status(500).json({
            success: false,
            message: "erro" + err.message
        });
    }
}

async function addPart(req, res) {
    const {id_prof, id_user, id_evento} = req.body;
    if(!id_prof || !id_user || !id_evento){
        return res.status(400).json({
            success: false,
            message: "dados faltando"
        })
    }
    try {
        const result = await addPartService(id_prof, id_user, id_evento);

        if(!result){
            throw new Error("Participante não cadastrado");
        }

        return res.status(200).json({
            success: true,
            message: "Participante Cadastrado"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "erro" + error.message
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    addPart
};