'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../AuthContext";
import { fetchEvents } from "../../api/events";
import {getAlunos } from "../../api/profile";
import { API_URL } from "../../../config";
import { ArrowLeft, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventosPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (user?.id) {
        const ev = await fetchEvents(user.id, token);
        setEvents(ev.events || []);
      }
    };
    loadEvents();
  }, [user]);

  const filteredEvents = () => {
    const now = new Date();
    if (filter === "today") {
      return events.filter(ev => {
        const evDate = new Date(ev.data_hora);
        return (
          evDate.getDate() === now.getDate() &&
          evDate.getMonth() === now.getMonth() &&
          evDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filter === "week") {
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);
      return events.filter(ev => {
        const evDate = new Date(ev.data_hora);
        return evDate >= now && evDate <= weekLater;
      });
    } else return events;
  };

  const openEventModal = (ev) => {
    setSelectedEvent(ev);
    setShowEventModal(true);
  };

  const openParticipantsModal = async () => {
    if (!selectedEvent) return;
    const res = await getAlunos(token, user.id); // retorna lista de meus alunos
    setStudents(res.students || []);
    setShowParticipantsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a1f3c] p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white hover:text-blue-300 transition"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Eventos</h1>

      {/* Filtros */}
      <div className="flex justify-center gap-4 mb-6">
        {["all", "today", "week"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === f ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {f === "all" ? "Todos" : f === "today" ? "Hoje" : "Próximos 7 dias"}
          </button>
        ))}
      </div>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents().length === 0 ? (
          <p className="text-white col-span-full text-center">Nenhum evento encontrado.</p>
        ) : filteredEvents().map(ev => {
          const evDate = new Date(ev.data_hora);
          const dateStr = evDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
          const timeStr = evDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const isMyEvent = ev.criador_id === user.id;

          return (
            <div
              key={ev.id}
              className={`rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-all ${
                isMyEvent ? "bg-green-700/90" : "bg-gray-800/90"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold text-lg">{ev.titulo}</h3>
                {isMyEvent && (
                  <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
                    Meu Evento
                  </span>
                )}
              </div>
              {ev.descricao && <p className="text-gray-200 text-sm mb-3">{ev.descricao}</p>}
              <div className="text-gray-200 mb-3">Local: {ev.local || "Não informado"}</div>
              <div className={`text-white font-semibold rounded-lg px-3 py-1 inline-block mb-3 ${isMyEvent ? "bg-yellow-600" : "bg-blue-600"}`}>
                {dateStr} às {timeStr}
              </div>
              <button
                className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                onClick={() => openEventModal(ev)}
              >
                Ver detalhes
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Detalhes do Evento */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2 relative">
            <button className="absolute top-3 right-3 text-white font-bold" onClick={() => setShowEventModal(false)}>X</button>
            <h2 className="text-2xl font-bold text-white mb-3">{selectedEvent.titulo}</h2>
            <p className="text-gray-200 mb-2">{selectedEvent.descricao}</p>
            <p className="text-gray-200 mb-2">Local: {selectedEvent.local}</p>
            <p className="text-gray-200 mb-4">Data/Hora: {new Date(selectedEvent.data_hora).toLocaleString("pt-BR")}</p>
            {selectedEvent.criador_id === user.id && (
              <button
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition"
                onClick={openParticipantsModal}
              >
                Adicionar Participantes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Participantes */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2 relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-white font-bold" onClick={() => setShowParticipantsModal(false)}>X</button>
            <h2 className="text-2xl font-bold text-white mb-4">Meus Alunos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.length === 0 ? (
                <p className="text-white col-span-full text-center">Nenhum aluno encontrado.</p>
              ) : students.map(s => (
                <div key={s.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={s.foto_perfil ? `${API_URL}/public/profile/${s.foto_perfil}` : "/perfil.png"}
                      width={40} height={40}
                      className="rounded-full border border-blue-300"
                      alt={s.nome}
                    />
                    <span className="text-white font-semibold">{s.nome}</span>
                    {s.tem_lesao && <Activity size={20} color="red" title="Aluno com lesão" />}
                  </div>
                  <button
                    className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                    onClick={() => alert(`Detalhes do aluno: ${s.nome}`)}
                  >
                    Detalhes / Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
