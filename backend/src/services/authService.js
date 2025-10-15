const pool = require('../../configs/db');
const { sendMail } = require('../../configs/mailer');
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

  if(user.tipo === 'professor'){
    const [profRows] = await pool.execute(
      'SELECT * FROM professores WHERE usuario_id = ?',
      [user.id]
    );
    if(profRows.length > 0){
      user.codigo_professor = profRows[0].codigo_professor;
      user.experiencia = profRows[0].experiencia;
      user.especialidade = profRows[0].especialidade;
    }
  }

  if(user.tipo === 'aluno'){
    const [alunoRows] = await pool.execute(
      `SELECT a.id as aluno_id, p.codigo_professor 
       FROM alunos a
        JOIN professores p ON a.professor_id = p.id
        WHERE a.usuario_id = ?`,
      [user.id]
    );
    if(alunoRows.length > 0){
      user.aluno_id = alunoRows[0].aluno_id;
      user.codigo_professor = alunoRows[0].codigo_professor;
    }
  }

  delete user.senha;
  return { token, user };
}

async function registerService(nome, dtNasc, email, senha, tipo, code, foto = null) {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    return { success: false, message: 'Usuário já existe' };
  }

  if (tipo === 'professor' && code !== process.env.PROFESSOR_CODE) {
    return { success: false, message: 'Código mestre de professor inválido' };
  }

  if (tipo === 'aluno') {
    if (!code) return { success: false, message: 'Código do professor é obrigatório' };

    const [profRows] = await pool.execute(
      'SELECT * FROM professores WHERE codigo_professor = ?',
      [code]
    );
    if (profRows.length === 0) {
      return { success: false, message: 'Professor não encontrado' };
    }
  }

  const hashedPassword = await bcrypt.hash(senha, 10);
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, data_nascimento, email, senha, tipo, foto_perfil) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, dtNasc, email, hashedPassword, tipo, foto]
  );

  const usuarioId = result.insertId;

  if (tipo === 'professor') {
    const codigo_professor = uuidv4().split('-')[0];
    await pool.execute(
      'INSERT INTO professores (usuario_id, codigo_professor) VALUES (?, ?)',
      [usuarioId, codigo_professor]
    );
  }

  if (tipo === 'aluno') {
    const [profRows] = await pool.execute(
      'SELECT id FROM professores WHERE codigo_professor = ?',
      [code]
    );
    const professorId = profRows[0].id;

    await pool.execute(
      'INSERT INTO alunos (usuario_id, professor_id) VALUES (?, ?)',
      [usuarioId, professorId]
    );
  }

  return { success: true, message: 'Usuário criado com sucesso' };
}

async function resetService(email) {
  // verifica se o email existe
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length === 0) {
    return {
      success: false,
      message: 'Email não encontrado'
    };
  }
  const user = rows[0];
  try {
      // gera um codigo curto de recuperação expirando em 1 hora
    const resetToken = uuidv4().split('-')[0];
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora a partir de agora

    // salva no banco
    await pool.execute(
      'INSERT INTO resetPass (usuario_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt]
    );

    // envia email com o código
    const result = await sendMail(
      email,
      'Redefinição de senha',
      `<p>Olá ${user.nome},</p>
      <p>Você solicitou a redefinição de senha. Este código expira em 1 hora.</p>

      <div style="
        margin: 20px auto;
        background: #f5f5f5;
        padding: 30px 20px;
        border-radius: 10px;
        text-align: center;
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #222;
        font-family: 'Courier New', monospace;
        max-width: 300px;
      ">
        ${resetToken}
      </div>

      <p style="text-align:center; color:#555; margin-top:20px;">
        Copie o código acima e insira-o na tela de redefinição de senha do <strong>Fit ++</strong>.
      </p>

      <p>Se você não solicitou essa alteração, por favor ignore este email.</p>
      <p>Atenciosamente,<br/>Equipe Fit ++</p>`
    );
    return {
      success: true,
      message: 'Código de redefinição enviado'
    };
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      message: 'Erro ao enviar email'
    };
  }

}


async function resetConfirmService(token, newPassword) {
  // verifica se o token é válido
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM resetPass WHERE token = ?',
      [token]
    );
    if (rows.length === 0) {
      return {
        success: false,
        message: 'Token inválido'
      };
    }
    const resetEntry = rows[0];

    // verifica se expirou
    if (new Date(resetEntry.expires_at) < new Date()) {
      return {
        success: false,
        message: 'Token expirado'
      };
    }
    // atualiza a senha do usuário
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [hashedPassword, resetEntry.usuario_id]
    );
    // remove o token usado
    await pool.execute(
      'DELETE FROM resetPass WHERE id = ?',
      [resetEntry.id]
    );
    return { success: true, message: 'Senha atualizada com sucesso' };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return {
      success: false,
      message: 'Erro ao redefinir senha'
    };
  }
}
  
  




module.exports = { loginService, registerService, resetService, resetConfirmService };
