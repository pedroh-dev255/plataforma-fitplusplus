'use client'; // Obrigatório para usar hooks (useEffect) e useRouter

import React, { useEffect } from 'react';
import { useAuth } from './AuthContext'; 
// Importamos o hook de navegação do App Router
import { useRouter, usePathname } from 'next/navigation'; 

// Definição das rotas públicas
const publicRoutes = ['/', '/login', '/register', '/reset'];

const AuthGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Usamos usePathname para obter a rota atual
    
    // Verifica se a rota atual é uma das rotas públicas
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        // Redirecionamento só é executado após o carregamento
        if (!loading) {
            // 1. Usuário LOGADO tentando acessar rota PÚBLICA (redireciona para Home)
            // Se o usuário está logado E a rota é pública (e não é a raiz que pode ser usada como splash), redireciona.
            if (user && isPublicRoute && pathname !== '/') {
                router.push('/home'); 
            }
            // 2. Usuário DESLOGADO tentando acessar rota PRIVADA (redireciona para Login)
            else if (!user && !isPublicRoute) {
                // Redireciona qualquer rota privada para a tela de login
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
    
    // Se a autenticação estiver resolvida e o usuário estiver na rota correta, renderiza o conteúdo (children)
    return children;
};

export default AuthGuard;
