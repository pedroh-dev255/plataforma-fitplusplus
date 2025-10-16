'use client'; 
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { useRouter, usePathname } from 'next/navigation'; 

// Definição das rotas públicas
const publicRoutes = [ '/login', '/register', '/body-mapping', '/reset'];

const AuthGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); 
    
    // Verifica se a rota atual é uma das rotas públicas
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!loading) {
            if (user && isPublicRoute && pathname !== '/') {
                router.push('/');
            }
        
            else if (!user && !isPublicRoute) {
                router.push('/login');
            }
        }
    }, [loading, user, isPublicRoute, pathname, router]);

    // Renderiza um spinner durante o carregamento
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-800">
                <div className="flex flex-col items-center">
                    <p className="text-white text-lg mb-4">Verificando autenticação...</p>
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }
    
    return children;
};

export default AuthGuard;
