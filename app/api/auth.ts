import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config.ts";

// Configuração do axios com baseURL
const api = axios.create({
  baseURL: API_URL, // troca pelo IP do backend
});

async function login(email: string, senha: string, tipoUsuario: string) {
    try {
        console.log("Tentando logar com", email, senha);

        const response = await api.post(`/api/auth/login`, { email, password: senha, type: tipoUsuario });

        console.log("Resposta do login:", response);

        const { token, user } = response.data;

        // salva no dispositivo
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        return { token, user };
    } catch (err) {
        if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
            throw (err as any).response.data;
        } else {
            throw { message: "Erro ao conectar ao servidor" };
        }
    }
}

const register = (username: string, password: string, email: string) => {}

async function validateToken(token: string) {
  try {
    const response = await api.get("api/auth/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // retorna os dados do usuário se válido
  } catch (err) {
    return null; // inválido ou expirado
  }
}

export { 
    login,
    register,
    validateToken
 }