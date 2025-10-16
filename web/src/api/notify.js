import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config.ts";

async function create(userID, deviceToken) {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        throw new Error("Usuário não autenticado");
    }
    try {
        const response = await axios.post(`${API_URL}/api/notify/cadTokenFirebase`,
            { id: userID, token: deviceToken },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.status;
    } catch (err) {
        console.error("Erro ao cadastrar token de notificação:", err?.message || err);
        return { success: false, error: err?.message || "Erro desconhecido" };
    }
}

async function verify(userID) {
    
    try {
        const response = await axios.get(`${API_URL}/api/notify/verify/${userID}`);
        return response.status;
    } catch (err) {
        console.error("Erro ao verificar notificação:", err);
        return false;
    }
}



export { create, verify };