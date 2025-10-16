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