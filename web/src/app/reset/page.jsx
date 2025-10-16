"use client";

import { useState,useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {resetPassData} from "../../api/auth";

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;


    const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 text-white font-semibold transition-opacity duration-300";
    const typeClasses = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
            <button onClick={onClose} className="ml-4 text-lg font-bold">×</button>
        </div>
    );
};


export default function ResetScreen() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") || "—";
    const [notification, setNotification] = useState({ message: '', type: '' });

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const showAlert = useCallback((message, type) => {
        setNotification({ message, type });
    }, []);

    const handleReset = async () => {
        if (!code.trim() || !password) {
            showAlert("Preencha código e senha", 'warning');
            return;
        }
        if (password !== confirm) {
            showAlert("Senhas não conferem", 'warning');
            return;
        }

        if (password.length < 7) {
            showAlert("Senhas são menores que 8 caracteres", 'warning');
            return;
        }

        try {
            const res = await resetPassData(code, password);
            console.log(res)
            if (!res) throw new Error("Falha ao redefinir senha");
            
            if(res.success !== true){
                showAlert("Senha redefinida com sucesso!", 'success');
                router.push("/login");
            }

            throw new Error(res.message);
        } catch (err) {
            showAlert(err.message || "Erro ao redefinir senha", 'error');
        }
    };

  return (
    
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a1f3c] bg-cover bg-center"
      style={{ backgroundImage: "url('/background-reset.png')" }}
    >
      <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
      <div className="w-[85%] max-w-md bg-[rgba(10,31,60,0.95)] text-center rounded-2xl p-6 shadow-lg">
        <h1 className="text-white text-lg font-bold mb-2">Redefinir senha</h1>
        <p className="text-[#cfe8ff] mb-4">Email: {email}</p>

        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-[rgba(255,255,255,0.1)] text-white placeholder-[#b0c4de] outline-none"
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-[rgba(255,255,255,0.1)] text-white placeholder-[#b0c4de] outline-none"
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[rgba(255,255,255,0.1)] text-white placeholder-[#b0c4de] outline-none"
        />

        <button
          onClick={handleReset}
          className="w-full p-3 rounded-lg bg-white text-[#0a1f3c] font-bold hover:bg-[#cfe8ff] transition"
        >
          Enviar
        </button>

        <button
          onClick={() => router.push("/login")}
          className="text-[#87cefa] mt-4 hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
}
