'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [dtNasc, setDtNasc] = useState('');
  const [email, setEmail] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [classeCode, setClasseCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (!tipoUsuario) return alert('Selecione o tipo de usuário');
    if (!name.trim() || !email.trim() || !password || !password2)
      return alert('Preencha todos os campos');
    if (password !== password2) return alert('Senhas não conferem');
    if (tipoUsuario === 'aluno' && !classeCode.trim()) return alert('Informe o código da classe');
    if (tipoUsuario === 'professor' && !schoolCode.trim())
      return alert('Informe o código da instituição');

    const userData = {
      schoolcode: schoolCode,
      classcode: classeCode,
      nome: name,
      email,
      senha: password,
      tipo: tipoUsuario,
      dtNasc,
    };

    router.push(`/body-mapping?userData=${encodeURIComponent(JSON.stringify(userData))}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f3c] bg-cover bg-center" style={{ backgroundImage: "url('/background-register.png')" }}>
      <div className="w-[90%] sm:w-[400px] p-6 rounded-2xl bg-[#0a1f3c]/90 flex flex-col items-center">
        <h1 className="text-white text-xl font-bold mb-4">Criar conta</h1>

        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-4"
        >
          <option value="">Tipo de Usuário</option>
          <option value="professor">Professor</option>
          <option value="aluno">Aluno</option>
          <option value="praticante">Praticante</option>
        </select>

        {tipoUsuario === 'aluno' && (
          <input
            type="text"
            placeholder="Código do Professor"
            className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
            value={classeCode}
            onChange={(e) => setClasseCode(e.target.value)}
          />
        )}

        {tipoUsuario === 'professor' && (
          <input
            type="text"
            placeholder="Código da Instituição"
            className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
          />
        )}

        <input
          type="text"
          placeholder="Nome"
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="date"
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
          value={dtNasc}
          onChange={(e) => setDtNasc(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Repita a Senha"
          className="w-full bg-white/10 text-white rounded-lg p-3 mb-4"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />

        <button
          onClick={handleNext}
          className="w-full bg-white text-[#0a1f3c] font-bold py-3 rounded-lg mb-2"
        >
          PRÓXIMO
        </button>

        <button
          onClick={() => router.push('/login')}
          className="text-sky-300 mt-2"
        >
          Já tem conta? Entrar
        </button>
      </div>
    </div>
  );
}
