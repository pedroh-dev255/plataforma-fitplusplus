import axios from "axios";
import {API_URL} from "../../config.ts"

export async function fetchEvents(id) {
    try{
        const response = await axios.get(`${API_URL}/api/events/getEvents`,
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