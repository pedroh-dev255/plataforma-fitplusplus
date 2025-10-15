'use client'; // Obrigatório para usar hooks e localStorage

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock de AsyncStorage para web (substitua pelo seu API/logic real)
const AsyncStorage = {
    getItem: async (key) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
    setItem: async (key, value) => typeof window !== 'undefined' ? localStorage.setItem(key, value) : null,
    removeItem: async (key) => typeof window !== 'undefined' ? localStorage.removeItem(key) : null,
};

const validateToken = async (token) => {
    // Simula a validação do token
    await new Promise(resolve => setTimeout(resolve, 300));
    const userData = await AsyncStorage.getItem("userData");
    if (token && userData) {
        // Retorna o objeto de usuário válido
        return JSON.parse(userData);
    }
    return null;
};
// Fim do Mock

const AuthContext = createContext({
    user: null,
    setUser: () => {},
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const validUser = await validateToken(token);
                    if (validUser) {
                        setUser(validUser);
                    } else {
                        await AsyncStorage.removeItem("token");
                        await AsyncStorage.removeItem("userData");
                    }
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
