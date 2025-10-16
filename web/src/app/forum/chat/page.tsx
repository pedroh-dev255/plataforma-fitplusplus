'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { getChat, sendMessage } from '../../../api/forum';
import { useAuth } from '../../AuthContext';

interface Mensagem {
  id: number;
  id_usuario: number;
  tipo: string;
  tipo_user: string;
  usuario: string;
  conteudo: string;
  criado_em: string;
  nome: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  const salaId = searchParams.get('sala');
  const salaNomeParam = searchParams.get('nome');

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [salaNome, setSalaNome] = useState(salaNomeParam || '');
  const [carregando, setCarregando] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!salaId || !token) return;

    const buscarSala = async () => {
      setSalaNome(salaNomeParam || `Sala ${salaId}`);
    };

    const buscarMensagens = async () => {
      setCarregando(true);
      try {
        const res = await getChat(salaId, token);
        if (!res) return setMensagens([]);
        setMensagens(res.chat);
      } catch (err) {
        console.error('Erro ao carregar mensagens', err);
      } finally {
        setCarregando(false);
      }
    };

    buscarSala();
    buscarMensagens();

    // Atualiza mensagens a cada 5 segundos
    const interval = setInterval(buscarMensagens, 5000);
    return () => clearInterval(interval);
  }, [salaId, salaNomeParam, token]);

  useEffect(() => {
    // Rolagem automática ao final do chat
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    setNovaMensagem("");
    if (!novaMensagem.trim() || !token || !salaId || !user) return;
    try {
      const res = await sendMessage(salaId, user.id, novaMensagem, token);

    } catch (err) {
      console.error('Erro ao enviar mensagem', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Cabeçalho */}
      <header className="bg-blue-800/60 p-4 border-b border-blue-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Botão de Voltar */}
          <button
            onClick={() => router.push('/forum')}
            className="p-2 rounded-full hover:bg-blue-700/60 transition"
            title="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-xl font-bold">💬 {salaNome || 'Carregando...'}</h1>
        </div>

        <span className="text-sm text-gray-300">ID: {salaId}</span>
      </header>

      {/* Área de mensagens */}
      <div
        ref={chatRef}
        style={{ 
            backgroundImage: "url('/26a50e2c2a5db52e3ebf2f8466e7ee2f3b5f0bd9.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
         }}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-700"
      >
  
                {carregando ? (
                <p className="text-center text-gray-400 mt-10">Carregando mensagens...</p>
                ) : mensagens.length > 0 ? (
                mensagens.map((msg) => {
                    const isProfessor = msg.tipo_user === 'professor';
                    const isMine = msg.id_usuario === user?.id;

                    if (msg.tipo === 'sistema') {
                    return (
                        <div key={msg.id} className="flex justify-center">
                        <div className="bg-green-800/60 border border-green-600 text-green-100 px-4 py-2 rounded-lg text-sm text-center max-w-[80%]">
                            {msg.conteudo}
                        </div>
                        </div>
                    );
                    }

                    return (
                        
                    <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                        <div
                        className={`rounded-lg p-2 max-w-[80%] border ${
                            isProfessor
                            ? 'bg-yellow-700/60 border-yellow-600'
                            : isMine
                            ? 'bg-blue-700/60 border-blue-500'
                            : 'bg-blue-900/40 border-blue-700'
                        }`}
                        >
                        <span
                            className={`font-semibold ${
                            isProfessor ? 'text-yellow-300' : 'text-blue-300'
                            }`}
                        >
                            {msg.nome}
                        </span>
                        <p className="text-sm break-words">{msg.conteudo}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                        {new Date(msg.criado_em).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </span>
                    </div>
                    );
                })
                ) : (
                <p className="text-center text-gray-500 mt-10">Nenhuma mensagem ainda.</p>
                )}
            
        
      </div>

      {/* Campo de envio */}
      <div className="p-4 bg-gray-800 border-t border-blue-700 flex gap-2">
        <input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
        />
        <button
          onClick={enviarMensagem}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
