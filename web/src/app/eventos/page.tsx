'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../AuthContext";
import { fetchEvents, addPart } from "../../api/events";
import { getAlunos } from "../../api/profile";
import { API_URL } from "../../../config";
import { ArrowLeft, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HumanBodySVG = ({ selectedParts }) => {
  const getFillProps = (id) => ({
    fill: selectedParts.includes(id) ? '#ef4444' : '#3b83f64f',
    stroke: selectedParts.includes(id) ? '#ef4444' : '#3b82f6',
    strokeWidth: selectedParts.includes(id) ? 3 : 1.5,
  });


  return (
    <svg viewBox="0 0 600 800" width={160} height={380}>
      {/* Cabeça */}
      <path 
        d="M300 80C300 128.049 263.608 175 225.5 175C187.392 175 150 128.049 150 80C150 31.9512 187.392 0 225.5 0C263.608 0 300 31.9512 300 80Z" 
        {...getFillProps('cabeca')}
        transform="translate(110, -30) scale(0.8)"
      />
      
      {/* Pescoço */}
      <path 
        d="M218.5 75C227 110.5 135.108 81 109.5 81C80.1077 81 0 105.049 0 57C9 57 71.3923 0 109.5 0C142 0 207 50 218.5 75Z" 
        {...getFillProps('pescoco')}
        transform="translate(220, 120) scale(0.6)"
      />
      
      {/* Ombros */}
      <path 
        d="M2.4999 50C10.0999 13.2 57.3332 1.33333 79.9999 0C81.9999 22.3333 84.7999 69.4 79.9999 79C75.1999 88.6 39.9999 116.333 22.9999 129C12.9999 118 -5.1001 86.8 2.4999 50Z" 
        {...getFillProps('ombros')}
        transform="translate(150, 180) scale(0.8)"
      />
      <path 
        d="M365 64C359.4 21.2 322.333 11.8333 304.5 12.5C298.667 14.6667 287.1 21.8 287.5 33C288 47 304.5 103 327 138.5C345 166.9 363.833 150.333 371 138.5C371.333 131.5 370.6 106.8 365 64Z" 
        {...getFillProps('ombros')}
        transform="translate(120, 150) scale(0.8)"
      />
      
      {/* Peito */}
      <path 
        d="M232.5 110.5C246.5 91.2998 228.333 41.8331 217.5 19.4998C215.1 7.49956 181.167 4.16651 164.5 4L132.5 11C124 9.49992 104 5.49976 92.0001 1.49976C77.0001 -3.50024 20.5001 16.4998 5.00012 38.9998C-10.4999 61.4998 16.5001 113 20.5001 132.5C24.5001 152 39.5001 144 66.0001 143.5C92.5001 143 163.5 150.5 178 150.5C192.5 150.5 215 134.5 232.5 110.5Z" 
        {...getFillProps('peito')}
        transform="translate(200, 150) scale(0.7)"
      />
      
      {/* Tronco */}
      <path 
        d="M37.6763 0.875908C79.1763 5.87591 157.676 6.37591 235.676 6.37591C244.176 41.3758 227.676 43.876 218.676 74.376C211.476 98.776 238.676 197.209 253.176 243.376C170.843 266.543 9.27636 299.776 21.6764 247.376C34.0764 194.976 12.5097 69.5426 0.176347 13.3759C-1.15699 7.54258 4.47635 -3.12409 37.6763 0.875908Z" 
        {...getFillProps('torco')}
        transform="translate(210, 230) scale(0.6)"
      />
      
      {/* Braços */}
      <path 
        d="M75.3859 123.16C85.3859 103.96 95.5525 42.8271 99.3859 14.6604C91.8858 -2.83956 55.8859 -3.33956 39.8859 6.16044C27.0859 13.7604 21.2192 77.9938 19.8859 109.16C-10.1141 155.16 1.38586 277.66 6.38586 303.66C10.3859 324.46 37.0525 312.327 49.8859 303.66C54.2192 251.494 65.3859 142.36 75.3859 123.16Z" 
        {...getFillProps('bracos')}
        transform="translate(130, 250) scale(0.6)"
      />
      <path 
        d="M407.886 39.6606C399.086 21.6606 362.553 27.1606 345.386 32.1606C337.386 58.5606 353.386 108.494 362.386 130.161C364.719 143.994 369.686 173.861 370.886 182.661C372.386 193.661 391.886 294.661 400.386 328.661C407.186 355.861 427.886 351.661 437.386 346.161V198.161C417.386 123.161 418.886 62.1606 407.886 39.6606Z" 
        {...getFillProps('bracos')}
        transform="translate(180, 230) scale(0.6)"
      />
      
      {/* Mãos */}
      <path 
        d="M396.498 7.49951C407.665 7.83284 430.298 10.4996 431.498 18.4995C432.998 28.4995 442.498 77.9995 421.998 90.4995C401.498 102.999 377.998 112 372.498 109C368.098 106.599 365.332 93.6661 364.498 87.4995C369.498 74.4995 379.898 47.5996 381.498 43.9995C383.098 40.3995 390.498 25.4995 393.998 18.4995L396.498 7.49951ZM5.00024 9.00049C5.80024 -4.19951 36.6669 1.8329 52.0002 6.49951C55.5004 3.8331 63.7004 3.70045 68.5002 24.4995C73.3002 45.2995 72.8336 74.5004 72.0002 86.5005L63.5002 84.0005L61.5002 81.0005C60.3335 83.6671 56.7999 88.5 52.0002 86.5005C46.0003 84.0005 1.50092 80.0001 1.00024 60.5005C0.500248 41.0007 4.00021 25.5003 5.00024 9.00049Z" 
        {...getFillProps('maos')}
        transform="translate(130, 420) scale(0.72)"
      />
      
      {/* Pernas */}
      <path 
        d="M237.5 306C255.1 233.6 260.833 72.1667 261.5 0.5C187.333 0.5 36 2.4 24 10C12 17.6 3 173.5 0 250.5V306C20.3333 319.667 64.2 335.8 77 291C89.8 246.2 118.333 126 131 71.5H147V241.5C169.833 293.167 219.9 378.4 237.5 306Z" 
        {...getFillProps('pernas')}
        transform="translate(210, 380) scale(0.6)"
      />
      
      {/* Joelhos */}
      <path 
        d="M375.5 84.5001C384.3 65.7001 384.167 31.6668 383 17.0001C362.833 12.6668 321.1 4.2001 315.5 5.0001C309.9 5.8001 303.5 63.3334 301 92.0001C322.167 97.3334 366.7 103.3 375.5 84.5001Z" 
        {...getFillProps('joelho')}
        transform="translate(55, 550) scale(0.5)"
      />
      <path 
        d="M552 9.4999C550 -10.5001 493.833 6.1667 466 17.0001C470 31.6667 479.1 65.7 483.5 84.5001C487.9 103.3 531 92.3335 552 84.5001C552.833 67.8334 554 29.4999 552 9.4999Z" 
        {...getFillProps('joelho')}
        transform="translate(80, 550) scale(0.5)"
      />
      
      {/* Panturrilhas */}
      <path 
        d="M198.5 221C182.5 175 188.5 74.8336 193.5 30.5002C210.167 10.5002 248.1 -19.3998 266.5 21.0002C289.5 71.5002 243 241 238 254C234 264.4 210 258.334 198.5 254V221Z" 
        {...getFillProps('panturrilha')}
        transform="translate(220, 590) scale(0.5)"
      />
      <path 
        d="M78.9999 78C72.9999 58 76.4999 35 78.9999 26C66.5999 4 28.1666 13.5002 10.4999 21.0002C5.66661 45.1668 -2.90006 103.3 1.49994 142.5C5.89994 181.7 9.33328 233.167 10.4999 254C23.4999 254 50.2999 249.4 53.4999 231C69.0999 170.6 76.9999 103.833 78.9999 78Z" 
        {...getFillProps('panturrilha')}
        transform="translate(200, 590) scale(0.5)"
      />
      
      {/* Pés */}
      <path 
        d="M110.5 43.9998L105 17.4998C92.1667 15.1665 65.1 11.8998 59.5 17.4998C53.9 23.0998 57.1667 37.4998 59.5 43.9998L51 50.9998L30.5 70.9998L0.5 86.9998C0.5 94.9998 10.6 109.9 51 105.5C91.4 101.1 107.5 94.6665 110.5 91.9998C106.9 75.5998 109 53.1665 110.5 43.9998Z" 
        {...getFillProps('pes')}
        transform="translate(180, 700) scale(0.4)"
      />
      <path 
        d="M292 6.50004C290.4 -2.29977 261.667 -0.166543 247.5 2.00004C237.5 10.8001 235 47.3334 235 64.5C235 66.6666 233.7 72.4998 228.5 78.5C223.3 84.5002 230.667 98.9999 235 105.5C251.5 110.5 302.5 98 306.5 91.9998C310.5 85.9996 298.5 79.5 292 70.9998C285.5 62.4996 294 17.4998 292 6.50004Z" 
        {...getFillProps('pes')}
        transform="translate(222, 710) scale(0.4)"
      />

    </svg>
  );
};

export default function EventosPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
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

    setStudents(res.alunos || []);
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
            <div className="bg-gray-900 rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2 relative max-h-[85vh] overflow-y-auto">
            <button
                className="absolute top-3 right-3 text-white font-bold"
                onClick={() => setShowEventModal(false)}
            >
                ✖
            </button>

            <h2 className="text-2xl font-bold text-white mb-1">{selectedEvent.titulo}</h2>
            <p className="text-gray-400 mb-3">ID: {selectedEvent.id}</p>
            <p className="text-gray-200 mb-2">{selectedEvent.descricao}</p>
            <p className="text-gray-200 mb-2">Local: {selectedEvent.local}</p>
            <p className="text-gray-200 mb-4">
                Data/Hora: {new Date(selectedEvent.data_hora).toLocaleString("pt-BR")}
            </p>

            <div className="border-t border-gray-700 my-4" />

            {/* Lista de Participantes */}
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Participantes ({selectedEvent.participantes?.length || 0})
            </h3>

            {selectedEvent.participantes?.length > 0 ? (
                <ul className="space-y-2 mb-4">
                {selectedEvent.participantes.map((p, idx) => (
                    <li
                    key={p.id || idx}
                    className="bg-gray-800 px-4 py-2 rounded-lg flex justify-between items-center"
                    >
                    <span className="text-white font-medium">{p.nome}</span>
                    <span className="text-gray-400 text-sm">{p.email || "sem email"}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-400 mb-4">Nenhum participante inscrito.</p>
            )}

            {/* Se o usuário for o criador, pode adicionar */}
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
            <button
                className="absolute top-3 right-3 text-white font-bold"
                onClick={() => setShowParticipantsModal(false)}
            >
                X
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Meus Alunos</h2>

            {students.length === 0 ? (
                <p className="text-white text-center">Nenhum aluno encontrado.</p>
            ) : (
                <div className="space-y-2">
                {students.map(s => {
                    const jaParticipa = selectedEvent?.participantes?.some(p => p.id === s.id);

                    return (
                        <div
                        key={s.id}
                        className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
                        >
                        {/* Nome */}
                        <div className="w-1/4 text-white font-semibold">{s.nome}</div>

                        {/* Ícone de lesão */}
                        <div className="w-1/6 flex justify-center">
                            {s.lesao ? <Activity size={20} color="red" title="Aluno com lesão" /> : null}
                        </div>

                        {/* Botão Detalhes */}
                        <div className="w-1/4 flex justify-center">
                            <button
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 transition"
                            onClick={() => setAlunoSelecionado(s)}
                            >
                            Detalhes
                            </button>
                        </div>

                        {/* Se já participa, mostra aviso; senão, botão de adicionar */}
                        <div className="w-1/4 flex justify-center">
                            {jaParticipa ? (
                            <span className="text-gray-400 text-sm italic">Já participa</span>
                            ) : (
                            <button
                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-500 transition"
                                onClick={async () => {
                                if (!selectedEvent || !s.id) return;

                                try {
                                    const result = await addPart(user.id, s.usuario_id, selectedEvent.id, token);
                                    console.log(result);

                                    // Atualiza a lista de participantes localmente
                                    setSelectedEvent(prev => ({
                                    ...prev,
                                    participantes: [...(prev.participantes || []), s],
                                    }));

                                    alert(`${s.nome} adicionado com sucesso!`);
                                } catch (err) {
                                    console.error("Erro ao adicionar participante:", err);
                                    alert("Erro ao adicionar participante");
                                }
                                }}
                            >
                                Adicionar
                            </button>
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
            )}
            </div>
        </div>
        )}

        {/* Modal Detalhes do Aluno */}
        {alunoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-blue-900/90 border border-blue-700 rounded-xl p-6 w-11/12 max-w-md relative">
            <button
                className="absolute top-3 right-3 text-white hover:text-red-400"
                onClick={() => setAlunoSelecionado(null)}
            >
                ✖
            </button>

            <h2 className="text-xl font-bold mb-2">{alunoSelecionado.nome}</h2>
            <p className="text-sm text-gray-300 mb-1">Email: {alunoSelecionado.email}</p>
            <p className="text-sm text-gray-300 mb-1">
                Nível: {alunoSelecionado.nivel || 'Não definido'}
            </p>
            <p className="text-sm text-gray-300 mb-1">
                Pontos: {alunoSelecionado.pontos || 0}
            </p>
            <p className="text-sm text-gray-300 mb-1">
                Lesão: {alunoSelecionado.lesao === 1 ? '⚠️ Possui lesão' : 'Nenhuma'}
            </p>

            {/* Boneco do corpo humano apenas se houver lesão */}
            {alunoSelecionado.lesao === 1 && alunoSelecionado.lesoes && (
                <div className="mt-4 flex justify-center">
                <HumanBodySVG
                    selectedParts={Object.keys(alunoSelecionado.lesoes).filter(
                    key => alunoSelecionado.lesoes[key]
                    )}
                />
                </div>
            )}
            </div>
        </div>
        )}
    </div>
  );
}
