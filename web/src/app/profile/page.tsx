// pages/profile.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import NotificationHandler from '../../components/NotificationHandler';
import NotificationIcon from '../../components/NotificationIcon';
import { toast, ToastContainer } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

type Turma = {
  id: string;
  nome: string;
  descricao?: string;
};

type Evento = {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora?: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.nome || '');
  const [photo, setPhoto] = useState(user?.foto_perfil || '');
  const [dtNasc, setDtNasc] = useState('');
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showTurmaModal, setShowTurmaModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [newTurmaNome, setNewTurmaNome] = useState('');
  const [newTurmaDescricao, setNewTurmaDescricao] = useState('');
  const [newEventoTitulo, setNewEventoTitulo] = useState('');
  const [newEventoDescricao, setNewEventoDescricao] = useState('');
  const [newEventoDataHora, setNewEventoDataHora] = useState('');

  useEffect(() => {
    setName(user.nome || '');
    setPhoto(user.foto_perfil || '');
    if (user.data_nascimento) {
      const d = new Date(user.data_nascimento);
      if (!isNaN(d.getTime())) {
        setDtNasc(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`);
      }
    }
    if (user?.tipo === 'professor') {
      const sTurmas = localStorage.getItem(`professor_${user.id}_turmas`);
      const sEventos = localStorage.getItem(`professor_${user.id}_eventos`);
      setTurmas(sTurmas ? JSON.parse(sTurmas) : []);
      setEventos(sEventos ? JSON.parse(sEventos) : []);
    }
  }, [user]);

  if (!user) return <div style={{ color: '#fff', padding: 20 }}>Usuário não autenticado</div>;

  const handleShareCode = async () => {
    const code = user.codigo_professor || '';
    const message = `Cadastre-se como meu aluno no Fit++ usando o código: ${code}`;

    try {
      await navigator.clipboard.writeText(code);
      toast.success('Código copiado para a área de transferência');
    } catch (e) {
      toast.info('Código pronto para compartilhar');
    }

    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (e) {
        toast.error('Não foi possível abrir o compartilhamento');
      }
    }
  };

  const handleAddTurma = () => {
    if (!newTurmaNome.trim()) return toast.error('Nome da turma obrigatório');
    const t: Turma = { id: Date.now().toString(), nome: newTurmaNome.trim(), descricao: newTurmaDescricao };
    const next = [t, ...turmas];
    setTurmas(next);
    localStorage.setItem(`professor_${user.id}_turmas`, JSON.stringify(next));
    setShowTurmaModal(false);
    setNewTurmaNome('');
    setNewTurmaDescricao('');
    toast.success('Turma criada');
  };

  const handleAddEvento = () => {
    if (!newEventoTitulo.trim()) return toast.error('Título do evento obrigatório');
    const e: Evento = { id: Date.now().toString(), titulo: newEventoTitulo.trim(), descricao: newEventoDescricao, dataHora: newEventoDataHora };
    const next = [e, ...eventos];
    setEventos(next);
    localStorage.setItem(`professor_${user.id}_eventos`, JSON.stringify(next));
    setShowEventoModal(false);
    setNewEventoTitulo('');
    setNewEventoDescricao('');
    setNewEventoDataHora('');
    toast.success('Evento criado');
  };

  return (
    <div style={{ backgroundColor: '#1b3c6b', minHeight: '100vh', padding: 16, color: '#fff', paddingTop: 60 }}>
      <NotificationHandler />
      <div style={{ position: 'absolute', top: 20, right: 15, zIndex: 5 }}>
        <NotificationIcon />
      </div>
      <ToastContainer position="top-right" />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <button style={{ marginRight: 12 }} onClick={() => window.history.back()}>◀ Voltar</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
        <div style={{ marginRight: 12 }}>
          {photo ? (
            <img src={photo} style={{ width: 80, height: 80, borderRadius: 40 }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#004a99', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(user.nome || 'U').charAt(0)}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{user.nome}</div>
          <button onClick={handleShareCode} style={{ color: '#cfe8ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Código de Professor: {user.codigo_professor}
          </button>
        </div>
      </div>

      {user.tipo === 'professor' && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(12, 61, 131, 0.97)', borderRadius: 16, padding: 15, cursor: 'pointer' }}>
            <img src="/alunos.png" style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 10 }} />
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>Alunos</div>
            <div>Meus alunos</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(12, 61, 131, 0.97)', borderRadius: 16, padding: 15, cursor: 'pointer' }} onClick={() => setShowEventoModal(true)}>
            <img src="/evento.png" style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 10 }} />
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>Cadastro de evento</div>
            <div>Criação de novos eventos</div>
          </div>
        </div>
      )}

      {/* Modal criar turma */}
      {showTurmaModal && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <h3>Criar turma</h3>
            <input placeholder="Nome da turma" value={newTurmaNome} onChange={e => setNewTurmaNome(e.target.value)} style={inputStyle}/>
            <input placeholder="Descrição" value={newTurmaDescricao} onChange={e => setNewTurmaDescricao(e.target.value)} style={inputStyle}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button style={modalBtnStyle} onClick={() => setShowTurmaModal(false)}>Cancelar</button>
              <button style={modalBtnPrimaryStyle} onClick={handleAddTurma}>Criar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal criar evento */}
      {showEventoModal && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <h3>Criar evento</h3>
            <input placeholder="Título" value={newEventoTitulo} onChange={e => setNewEventoTitulo(e.target.value)} style={inputStyle}/>
            <input placeholder="Descrição" value={newEventoDescricao} onChange={e => setNewEventoDescricao(e.target.value)} style={inputStyle}/>
            <input placeholder="Data e hora" value={newEventoDataHora} onChange={e => setNewEventoDataHora(e.target.value)} style={inputStyle}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button style={modalBtnStyle} onClick={() => setShowEventoModal(false)}>Cancelar</button>
              <button style={modalBtnPrimaryStyle} onClick={handleAddEvento}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 };
const modalCardStyle = { backgroundColor: 'rgba(10,31,60,0.95)', borderRadius: 12, padding: 20, color: '#fff', width: 300 };
const inputStyle = { width: '100%', padding: 8, marginTop: 8, borderRadius: 6, border: 'none', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' };
const modalBtnStyle = { padding: 10, color: '#fff', backgroundColor: '#444', border: 'none', borderRadius: 6, cursor: 'pointer' };
const modalBtnPrimaryStyle = { padding: 10, color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: 6, cursor: 'pointer' };
