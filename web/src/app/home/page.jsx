import React from 'react';
import { useAuth } from '../AuthContext';

const HomeScreen = () => {
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        // Em um app real, você limparia o token no backend também
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setUser(null); // Desloga o usuário e o AuthGuard irá redirecionar
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">
                Bem-vindo à Home, {user?.nome || 'Usuário'}!
            </h1>
            <p className="text-gray-600 mb-8">Esta é uma rota protegida.</p>
            
            <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-colors"
            >
                Sair
            </button>
            
            <p className="mt-8 text-sm text-gray-500">
                Seu UID de teste: {user?.id || 'N/A'}
            </p>
        </div>
    );
};

export default HomeScreen;
