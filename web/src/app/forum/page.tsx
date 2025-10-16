'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { getSalas } from "../../api/forum"

interface Sala {
  id: number;
  nome: string;
  descricao?: string;
  participantes?: number;
}

export default function ForumPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {

    if(!token) return;

    const loadSalas = async () => {
      if (token) {
        try {
          const ev = await getSalas(token);
          setSalas(ev.salas || []);
        } catch (err) {
          console.error("Erro ao carregar salas:", err);
        }
      }
    };
    setLoading(false);
    loadSalas();
  }, [user]);

  console.log(salas);

  console.log(token);

  const salasFiltradas = salas.filter((sala) =>
    sala.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <button style={{ marginRight: 12 }} onClick={() => router.push('/')}>◀ Voltar</button>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">💬 Fórum</h1>

        <input
          type="text"
          placeholder="Buscar salas..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-3 rounded-lg text-gray-white mb-6 focus:outline-none backgroundColor: red focus:ring-2 focus:ring-blue-400"
        />

        {loading && (
          <p className="text-center text-gray-300 animate-pulse">Carregando salas...</p>
        )}

        {erro && (
          <p className="text-center text-red-400 mb-4">{erro}</p>
        )}

        {!loading && salasFiltradas.length === 0 && (
          <p className="text-center text-gray-300">Nenhuma sala encontrada.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {salasFiltradas.map((sala) => (
            <div
              key={sala.id}
              onClick={() => router.push(`/forum/chat?sala=${sala.id}&nome=${sala.nome}`)}
              className="bg-blue-900/40 border border-blue-700 rounded-lg p-4 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <h2 className="text-lg font-semibold">{sala.nome}</h2>
              {sala.descricao && (
                <p className="text-sm text-gray-300 mt-1">{sala.descricao}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
