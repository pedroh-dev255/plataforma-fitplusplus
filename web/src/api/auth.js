import axios from "axios";
import {API_URL} from "../../config.ts"

export async function login(email, senha, tipoUsuario) {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password: senha,
      type: tipoUsuario,
    });

    return res.data;
  } catch (err) {
    console.error("Erro no login:", err);
    return { success: false, message: err.response.data.message };
  }
}

export async function resetPass(email) {
  try {
    const res = await axios.post(`${API_URL}/api/auth/reset-password`, { email });
    return res.data;
  } catch (err) {
    console.error("Erro no reset:", err);
    return { success: false, message: "Erro ao enviar redefinição." };
  }
}
