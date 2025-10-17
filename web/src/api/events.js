import axios from "axios";
import {API_URL} from "../../config.ts"

export async function fetchEvents(id, token) {
    try{
        const response = await axios.post(`${API_URL}/api/events/getEvents`,
            {
                "userId": id
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (err) {
        console.error("Erro no login:", err);
        return { success: false, message: err.response.data.message };
    }
}

export async function createEvento(userId, token, eventoData) {

    try {
        const payload = {
            id_prof: userId,
            esporte: eventoData.esporte,
            tipo: eventoData.tipo,
            titulo: eventoData.titulo,
            desc: eventoData.desc,
            local: eventoData.local,
            lat: eventoData.lat,
            long: eventoData.long,
            dth: eventoData.dth,
            max: eventoData.max,
        };

        const result = await axios.post(`${API_URL}/api/events/cadEvento`,
            {
                "id_prof": userId, 
                "esporte": payload.esporte, 
                "tipo": payload.tipo, 
                "titulo": payload.titulo, 
                "desc": payload.desc, 
                "local": payload.local, 
                "lat": null, 
                "long": null, 
                "dth":payload.dth, 
                "max": payload.max,

            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log(result.data);
        return result.data;
    }catch (error) {
        return {
            success: false,
            message: error,
        };
    }
}

export async function addPart(id_prof, id_aluno, id_evento, token) {
        try{
        const response = await axios.post(`${API_URL}/api/events/addPart`,
            {
                "id_prof": id_prof,
                "id_user": id_aluno,
                "id_evento": id_evento
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (err) {
        console.error("Erro no login:", err);
        return { success: false, message: err.response.data.message };
    }
}