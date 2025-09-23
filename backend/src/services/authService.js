const pool = require('../../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

async function loginService(email, password, tipo) {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ? AND tipo = ?',
    [email, tipo]
  );
  if (rows.length === 0) return null;

  const user = rows[0];
  const match = await bcrypt.compare(password, user.senha);
  if (!match) return null;


  const token = jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  delete user.senha;
  return { token, user };
}

async function registerService(nome, email, senha, tipo, professor_code = null) {
  // já existe usuário com o mesmo email?
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  if (rows.length > 0) {
    return { success: false, message: 'Usuário já existe' };
  }

  // regras de cadastro
  if (tipo === 'professor') {
    if (professor_code !== process.env.PROFESSOR_CODE) {
      return { success: false, message: 'Código mestre de professor inválido' };
    }
  }

  if (tipo === 'aluno') {
    if (!professor_code) {
      return { success: false, message: 'Código do professor é obrigatório' };
    }

    const [profRows] = await pool.execute(
      'SELECT * FROM professores WHERE codigo_professor = ?',
      [professor_code]
    );
    if (profRows.length === 0) {
      return { success: false, message: 'Professor não encontrado' };
    }
  }

  // cria usuário
  const hashedPassword = await bcrypt.hash(senha, 10);
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, hashedPassword, tipo]
  );

  const usuarioId = result.insertId;

  // se professor, insere em professores
  if (tipo === 'professor') {
    const codigo_professor = uuidv4().split('-')[0]; // gera código único curto
    await pool.execute(
      'INSERT INTO professores (usuario_id, codigo_professor) VALUES (?, ?)',
      [usuarioId, codigo_professor]
    );
  }

  // se aluno, insere em alunos
  if (tipo === 'aluno') {
    const [profRows] = await pool.execute(
      'SELECT id FROM professores WHERE codigo_professor = ?',
      [professor_code]
    );
    const professorId = profRows[0].id;

    await pool.execute(
      'INSERT INTO alunos (usuario_id, professor_id) VALUES (?, ?)',
      [usuarioId, professorId]
    );
  }

  return { success: true, message: 'Usuário criado com sucesso' };
}


module.exports = { loginService, registerService };
