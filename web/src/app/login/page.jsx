"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { login, resetPass } from "../../api/auth";

// 🔔 Notificação simples
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses =
    "fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 text-white font-semibold transition-opacity duration-300";
  const typeClasses = type === "success" ? "bg-green-600" : "bg-red-600";

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-lg font-bold">
        ×
      </button>
    </div>
  );
};

// ⚙️ Configurações Firebase (substitua pelas tuas variáveis reais)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);

  // 🔥 Inicialização Firebase
  useEffect(() => {
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error("⚠️ Firebase config ausente.");
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          console.log("Usuário autenticado:", user.uid);
        } else {
          console.log("Nenhum usuário autenticado. Entrando anonimamente...");
          await signInAnonymously(authInstance).catch((error) =>
            console.error("Erro ao entrar anonimamente:", error)
          );
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Erro de inicialização Firebase:", error);
    }
  }, []);

  const showAlert = useCallback((message, type) => {
    setNotification({ message, type });
  }, []);

  // 🔐 Login
  const handleLogin = async () => {
    if (!email || !senha || !tipoUsuario) {
      return showAlert("Preencha todos os campos!", "error");
    }

    try {
      const res = await login(email, senha, tipoUsuario);

      if (!res || !res.success) {
        return showAlert(res?.message || "Erro ao realizar login", "error");
      }

      // Salvando dados localmente
      localStorage.setItem("userData", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      showAlert(`Bem-vindo, ${res.user.nome}!`, "success");

      // Redirecionar após login
      setTimeout(() => router.push("/home"), 1500);
    } catch (err) {
      showAlert(err.message || "Falha no login", "error");
    }
  };

  // 🔄 Reset de senha
  const handleResetPassword = async () => {
    if (!resetEmail) {
      return showAlert("Informe um email válido.", "error");
    }

    try {
      const res = await resetPass(resetEmail);

      if (!res?.success) {
        return showAlert(res?.message || "Erro ao enviar reset", "error");
      }

      setShowResetModal(false);
      showAlert("Código de redefinição enviado para o email.", "success");
    } catch (err) {
      showAlert(err.message || "Erro ao solicitar código", "error");
    }
  };

  const backgroundUrl =
    "/background-login.png";
  const logoUrl =
    "/logo.png";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundColor: "#0a1f3c",
      }}
    >
      <Notification
        {...notification}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="w-11/12 sm:w-96 p-8 bg-blue-900/90 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col items-center border border-blue-700/50">
        {/* Logo */}
        <div className="mb-6 w-24 h-24">
          <img
            src={logoUrl}
            alt="Logo FIT+"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Tipo de Usuário */}
        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white focus:outline-none border-2 border-transparent focus:border-blue-400"
        >
          <option value="" disabled>
            Tipo de Usuário
          </option>
          <option value="professor" className="text-gray-900">
            Professor
          </option>
          <option value="aluno" className="text-gray-900">
            Aluno
          </option>
          <option value="praticante" className="text-gray-900">
            Praticante
          </option>
        </select>

        {/* Email */}
        <input
          type="email"
          className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white placeholder-blue-300/80 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all duration-300"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Senha */}
        <input
          type="password"
          className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white placeholder-blue-300/80 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all duration-300"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {/* Ações */}
        <div className="w-full text-right mb-4">
          <button
            className="text-sky-300 hover:text-sky-500 text-sm underline transition-colors mr-3"
            onClick={() => setShowResetModal(true)}
          >
            Esqueci minha senha
          </button>
          <button
            className="text-sky-300 hover:text-sky-500 text-sm underline transition-colors"
            onClick={() => router.push("/register")}
          >
            Criar conta
          </button>
        </div>

        {/* Botão */}
        <button
          className="mt-4 w-full p-3 bg-white text-blue-900 font-bold text-lg rounded-xl shadow-lg hover:bg-gray-200 transition-all duration-300"
          onClick={handleLogin}
        >
          ENTRAR
        </button>
      </div>

      {/* Modal Reset */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="w-11/12 max-w-sm p-6 rounded-2xl bg-blue-900/95 shadow-2xl border border-blue-700/50">
            <p className="text-white font-bold text-xl mb-2">Redefinir senha</p>
            <p className="text-blue-200 text-sm mb-4">
              Informe o email para receber o código de redefinição.
            </p>

            <input
              type="email"
              className="w-full bg-white/10 rounded-xl p-3 mt-2 mb-4 text-white placeholder-blue-300/80 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
