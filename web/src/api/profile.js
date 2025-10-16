import axios from "axios";
import {API_URL} from "../../config.ts"


export async function getAlunos(token, id_prof) {
    try{
        const response = await axios.post(`${API_URL}/api/teacher/getAlunos`,
            {
                "id_prof": id_prof
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