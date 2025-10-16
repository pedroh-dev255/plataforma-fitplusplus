"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "react-hot-toast";

import NotificationHandler from "@/components/NotificationHandler";
import NotificationIcon from "@/components/NotificationPrompt";
import { useAuth } from "../AuthContext";
import { fetchEvents } from "@/api/events";
import { API_URL } from "@/config";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (user?.id) {
        try {
          const ev = await fetchEvents(user.id);
          setEvents(ev || []);
        } catch (err) {
          console.error("Erro ao carregar eventos:", err);
          Toast.error("Erro ao carregar eventos");
        }
      }
    };
    loadEvents();
  }, [user]);

  const renderNextEvents = () => {
    if (events.length === 0) {
      return (
        <p className="text-white text-center mb-5">
          Nenhum evento próximo.
        </p>
      );
    }

    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    const upcoming = events.filter(ev => {
      const evDate = new Date(ev.data_hora);
      return evDate >= now && evDate <= weekLater;
    });

    if (upcoming.length === 0) {
      return (
        <p className="text-white text-center mb-5">
          Nenhum evento nos próximos dias.
        </p>
      );
    }

    return upcoming.map(ev => {
      const evDate = new Date(ev.data_hora);
      const dateStr = evDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = evDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const isToday =
        evDate.getDate() === now.getDate() &&
        evDate.getMonth() === now.getMonth() &&
        evDate.getFullYear() === now.getFullYear();

      return (
        <div key={ev.id} className="bg-gray-700/90 rounded-2xl p-4 mb-5 text-white">
          <h3 className="font-bold text-lg mb-2">{ev.titulo}</h3>
          {ev.descricao && <p className="text-sm mb-3">{ev.descricao}</p>}

          <div className="flex justify-between items-center">
            <div
              className={`px-3 py-2 rounded-md font-semibold ${
                isToday ? "bg-yellow-500" : "bg-blue-500"
              }`}
            >
              {dateStr} às {timeStr}
            </div>
            <button
              onClick={() => router.push("/eventos")}
              className="border border-blue-300 px-3 py-2 rounded-md text-blue-400 hover:bg-blue-400 hover:text-white transition"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1f3c] relative">
      <NotificationHandler />

      <div className="absolute top-10 right-5 z-50">
        <NotificationIcon />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-28">
        {/* Header do usuário */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center mb-8"
        >
          <Image
            src={
              user?.foto_perfil
                ? `${API_URL}/public/profile/${user.foto_perfil}`
                : user?.avatar || "/assets/perfil.png"
            }
            alt="avatar"
            width={60}
            height={60}
            className="rounded-full bg-gray-300"
          />
          <div className="ml-3 text-left">
            <p className="text-xl font-bold text-white">Olá, {user?.nome || "Usuário"}</p>
            <p className="text-sm text-white">{user?.tipo || "Aluno"}</p>
          </div>
        </button>

        {/* Próximos eventos */}
        <h2 className="text-center text-2xl font-bold text-white mb-6">Próximos eventos</h2>
        {renderNextEvents()}

        {/* Cards principais */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
          <button
            onClick={() => router.push("/eventos")}
            className="flex-1 bg-blue-900/90 rounded-2xl p-4 text-left hover:bg-blue-800 transition"
          >
            <Image
              src="/assets/evento.png"
              alt="Eventos"
              width={80}
              height={80}
              className="rounded-lg mb-3"
            />
            <h3 className="text-white font-bold text-lg mb-1">Eventos</h3>
            <p className="text-white text-sm">
              Visualize seus eventos e busque por novos
            </p>
          </button>

          <div className="flex-1 bg-blue-900/90 rounded-2xl p-4 text-left">
            <Image
              src="/assets/forum.png"
              alt="Fórum"
              width={80}
              height={80}
              className="rounded-lg mb-3"
            />
            <h3 className="text-white font-bold text-lg mb-1">Fórum</h3>
            <p className="text-white text-sm">
              Converse com alunos, professores e praticantes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
