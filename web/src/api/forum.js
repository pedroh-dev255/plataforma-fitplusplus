import axios from "axios";
import {API_URL} from "../../config.ts"


export async function getSalas(token) {
    try{
        const response = await axios.get(`${API_URL}/api/forum/getSalas`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }catch(err){
        console.error("Erro ao buscar:", err);
        return false;
    }
    
}

export async function getChat(id, token) {
    try{
        const response = await axios.post(`${API_URL}/api/forum/getChat`,
            {
                "id_sala": id
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }catch(err){
        console.error("Erro ao buscar:", err);
        return false;
    }
}
export async function sendMessage(salaId, iduser, novaMensagem, token) {
    try{
        const response = await axios.post(`${API_URL}/api/forum/sendMessage`,
            {
                	"id_sala": salaId,
                    "id_user": iduser,
                    "body": novaMensagem
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }catch(err){
        console.error("Erro ao enviar msg:", err);
        return false;
    }
    
}