'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { fetchEvents } from "../api/events";
import { API_URL } from "../../config";
import NotificationHandler from "../components/NotificationHandler";
import NotificationIcon from "../components/NotificationIcon";

export default function HomePage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (user?.id) {
        try {
          const ev = await fetchEvents(user.id, token);
          setEvents(ev.events || []);
        } catch (err) {
          console.error("Erro ao carregar eventos:", err);
        }
      }
    };

    loadEvents();
  }, [user]);

  const renderNextEvents = () => {
    if (!events || events.length === 0) {
      return (
        <p className="text-white text-center mb-4">Nenhum evento próximo.</p>
      );
    }

    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    const upcoming = events.filter((ev) => {
      const evDate = new Date(ev.data_hora);
      return evDate >= now && evDate <= weekLater;
    });

    if (upcoming.length === 0) {
      return (
        <p className="text-white text-center mb-4">
          Nenhum evento nos próximos dias.
        </p>
      );
    }

    return upcoming.map((ev) => {
      const evDate = new Date(ev.data_hora);
      const dateStr = evDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = evDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const isToday =
        evDate.getDate() === now.getDate() &&
        evDate.getMonth() === now.getMonth() &&
        evDate.getFullYear() === now.getFullYear();

      return (
        <div
          key={ev.id}
          className="bg-gray-800/90 rounded-2xl p-4 mb-4 shadow-md"
        >
          <h3 className="text-white font-bold text-lg mb-2">{ev.titulo}</h3>
          {ev.descricao && (
            <p className="text-gray-200 text-sm mb-3">{ev.descricao}</p>
          )}
          <div className="flex items-center justify-between">
            <div
              className={`px-3 py-2 rounded-lg text-white font-semibold ${
                isToday ? "bg-yellow-600" : "bg-blue-600"
              }`}
            >
              {dateStr} às {timeStr}
            </div>
            <button
              onClick={() => router.push("/eventos")}
              className="border border-blue-300 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-800/40 transition"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f3c] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(76, 0, 216, 0.12), #0085D8)" }}>
      <NotificationHandler />

      {/* Ícone de Notificação */}
      <div className="absolute top-5 right-5 z-10">
        <NotificationIcon />
      </div>
        
      <div className="container mx-auto backdrop-blur-md rounded-2xl p-6" >
        {/* Header do usuário */}
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center mb-6 cursor-pointer hover:opacity-90"
        >
          <Image
            src={
              user?.foto_perfil
                ? `${API_URL}/public/profile/${user.foto_perfil}`
                : user?.avatar
                ? user.avatar
                : "/perfil.png"
            }
            width={60}
            height={60}
            alt="Perfil"
            className="rounded-full object-cover border border-blue-300"
          />
          <div className="ml-3">
            <h2 className="text-xl font-bold text-white">
              Olá, {user?.nome || "Usuário"}
            </h2>
            <p className="text-sm text-gray-200">{user?.tipo || "Aluno"}</p>
          </div>
        </div>

        {/* Próximos eventos */}
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Próximos eventos
        </h2>
        {renderNextEvents()}

        {/* Cartões principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <div
            onClick={() => router.push("/eventos")}
            className="bg-blue-800/90 rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Image
              src="/evento.png"
              alt="Eventos"
              width={80}
              height={80}
              className="rounded-xl mb-3"
            />
            <h3 className="text-white font-bold text-lg mb-1">Eventos</h3>
            <p className="text-gray-200 text-sm">
              Visualize seus eventos e busque por novos
            </p>
          </div>

          <div
            onClick={() => router.push("/forum")}
            className="bg-blue-800/90 rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Image
              src="/forum.png"
              alt="Fórum"
              width={80}
              height={80}
              className="rounded-xl mb-3"
            />
            <h3 className="text-white font-bold text-lg mb-1">Fórum</h3>
            <p className="text-gray-200 text-sm">
              Converse com alunos, professores e praticantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
