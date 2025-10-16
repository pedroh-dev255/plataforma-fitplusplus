import axios from "axios";
import {API_URL} from "../../config.ts"

export async function login(email, senha, tipoUsuario) {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password: senha,
      type: tipoUsuario,
    });
    console.log(res.data)
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
    return { success: false, message: err.response.data.message };
  }
}

export async function resetPassData(codigo, newpass) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password/confirm`, {
      token: codigo,
      newPassword: newpass,
    });

    return response.data;
    
  } catch (error) {
    console.error("Erro no reset de senha:", error);
    return { success: false, message: error.response.data.message };
  }
}


export async function register(payload) {
  console.log(payload);
  try {
    const { schoolcode, classcode, nome, dtNasc, email, senha, tipo, lesoes } = payload;
    const response = await axios.post(`${API_URL}/api/auth/register`, { schoolcode, classcode, nome, dtNasc, email, senha, tipo, lesoes}, {
      headers: { 'Accept': 'application/json'},
    });

    // o Axios já faz o parse automático
    console.log(response)
    return response.data;
  } catch (err) {
    if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
        throw (err).response.data;
    } else {
        throw { message: "Erro ao conectar ao servidor "+ err };
    }
  }
}
