import axios from "axios";
import {API_URL} from "../../config.ts"

export async function fetchEvents(id) {
    try{

        return res.data;
    } catch (err) {
        console.error("Erro no login:", err);
        return { success: false, message: err.response.data.message };
    }
}