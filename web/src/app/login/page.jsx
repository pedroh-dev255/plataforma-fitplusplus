"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from "../AuthContext";
import { login, resetPass} from "../../api/auth";
import { useRouter, usePathname } from 'next/navigation'; 


const Notification = ({ message, type, onClose }) => {
    if (!message) return null;


    const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 text-white font-semibold transition-opacity duration-300";
    const typeClasses = type === "success"
                                  ? "bg-green-600"
                                  : type === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-600";

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


const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;


const loginHandler = async (email, senha, tipo) => {
    const res = await login(email, senha, tipo);

    if (res.success !== true || !res.success) {
        throw new Error(res.message);
    }
    console.log(res);

    return res;
};

const resetPassC = async (email) => {
    console.log(`Tentativa de Reset: ${email}`);

    const res = await resetPass(email);

    return res;
};

// --- Componente Principal ---

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Firebase State
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // 1. Inicialização e Autenticação Firebase
    useEffect(() => {
        if (!firebaseConfig) {
            console.error("Firebase config is missing.");
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
                    setCurrentUser(user);
                    console.log('User authenticated:', user.uid);
                } else {
                    console.log('User logged out or not authenticated.');
                    setCurrentUser(null);

                    // Sign in with custom token or anonymously if token is missing
                    if (initialAuthToken) {
                        await signInWithCustomToken(authInstance, initialAuthToken)
                            .then(userCredential => console.log('Signed in with custom token:', userCredential.user.uid))
                            .catch(error => console.error('Error signing in with custom token:', error));
                    } else {
                        await signInAnonymously(authInstance)
                            .then(userCredential => console.log('Signed in anonymously:', userCredential.user.uid))
                            .catch(error => console.error('Error signing in anonymously:', error));
                    }
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase Initialization Error:", error);
        }
    }, []);

    // Função de alerta customizada
    const showAlert = useCallback((message, type) => {
        setNotification({ message, type });
    }, []);
    const { setUser } = useAuth();
    const handleLogin = async () => {
        if (!email || !senha || !tipoUsuario) {
            return showAlert("Preencha todos os campos, incluindo o Tipo de Usuário.", 'error');
        }

        try {
            // Chama a API simulada (em um projeto real, você chamaria o seu backend)
            const res = await loginHandler(email, senha, tipoUsuario);

            if(res.success === true) {
              const {user, token} = res

              localStorage.setItem("userData", JSON.stringify(user));
              localStorage.setItem("token", token);
              setUser(user);
              showAlert(`Bem-vindo, ${user.nome}!`, 'success');
              //router.push('/');
            }
            
           showAlert(res.message || "Falha no login", 'error');

        } catch (err) {
            showAlert(err.message || "Falha no login", 'error');
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            return showAlert("O email de redefinição não pode ser vazio.", 'error');
        }
        try {
            const res = await resetPassC(resetEmail);
            
            if(res.success === true){
              showAlert("Código de redefinição enviado! Verifique seu e-mail.", 'success');
              setShowResetModal(false);
              router.push(`/reset?email=${encodeURIComponent(resetEmail)}`);
            } else{
              console.log(res)
              showAlert(`${res.message}`, 'error');
            }

        } catch (err) {
            showAlert(err.message || 'Erro ao solicitar código', 'error');
        }
    };

    // Imagens (substituindo assets nativos por placeholders)
    const backgroundUrl = "/background-login.png";
    const logoUrl = "/logo.png";

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url('${backgroundUrl}')`,
                backgroundColor: '#0a1f3c', // Cor de fallback
            }}
        >
            <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />

            {/* Cartão de Login */}
            <div className="w-11/12 sm:w-96 p-8 bg-blue-900/90 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col items-center border border-blue-700/50">
                
                {/* Logo */}
                <div className="mb-6 w-24 h-24">
                    <img src={logoUrl} alt="Logo FIT+" className="w-full h-full object-contain rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/ffffff/0a1f3c?text=Logo" }}/>
                </div>

                {/* Seletor de Tipo de Usuário (Picker -> Select) */}
                <div className="w-full bg-white/10 rounded-xl mb-4 appearance-none border-none focus:ring-2 focus:ring-blue-400 transition">
                    <select
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                        className="w-full bg-transparent p-3 text-white focus:outline-none appearance-none cursor-pointer"
                        style={{
                            // Estilo para o placeholder/opção padrão
                            color: tipoUsuario === "" ? '#b0c4de' : '#fff'
                        }}
                    >
                        <option value="" disabled className="text-gray-500">Tipo de Usuário</option>
                        <option value="professor" className="text-gray-900">Professor</option>
                        <option value="aluno" className="text-gray-900">Aluno</option>
                        <option value="praticante" className="text-gray-900">Praticante</option>
                    </select>
                </div>

                {/* Input Email */}
                <input
                    type="email"
                    className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white placeholder-blue-300/80 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Preencha seu login (e-mail)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoCapitalize="none"
                />

                {/* Input Senha */}
                <input
                    type="password"
                    className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white placeholder-blue-300/80 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Preencha sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    securetextentry="true"
                />

                {/* Links */}
                <div className="w-full text-right mb-4">
                    <button 
                        className="text-sky-300 hover:text-sky-500 text-sm underline transition-colors mr-3" 
                        onClick={() => setShowResetModal(true)}
                    >
                        Esqueci minha senha
                    </button>
                    <button 
                        className="text-sky-300 hover:text-sky-500 text-sm underline transition-colors" 
                        onClick={() => router.push('/register')}
                    >
                        Não possui uma conta? Cadastre-se agora!
                    </button>
                </div>

                {/* Botão de Login (TouchableOpacity -> Button) */}
                <button 
                    className="mt-4 w-full p-3 bg-white text-blue-900 font-bold text-lg rounded-xl shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.01] active:scale-100 focus:outline-none focus:ring-4 focus:ring-white/50"
                    onClick={handleLogin}
                >
                    ENTRAR
                </button>
            </div>

            {/* Modal de Redefinir Senha */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
                    <div className="w-11/12 max-w-sm p-6 rounded-2xl bg-blue-900/95 shadow-2xl border border-blue-700/50">
                        <p className="text-white font-bold text-xl mb-2">Redefinir senha</p>
                        <p className="text-blue-200 text-sm mb-4">Informe o email para receber o código de redefinição.</p>
                        
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
}

export default LoginScreen;
