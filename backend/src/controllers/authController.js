const { loginService, registerService, resetService, resetConfirmService } = require('../services/authService');
const dotenv = require('dotenv');
dotenv.config();

async function validate(req, res) {
  try {
    res.json({ success: true, ok: 'ok' });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
}

async function login(req, res) {
  const { email, password, type } = req.body;
  //console.log('Tentativa de login: ',req.body);

  if (!email || !password || !type) {
    return res.status(400).json({
      success: false,
      message: 'Email, senha e tipo são obrigatórios',
    });
  }

  try {
    const response = await loginService(email, password, type);

    if (!response) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas',
      });
    }

    return res.status(200).json({ success: true, ...response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
}

async function register(req, res) {
  const { schoolcode, classcode, nome, dtNasc, email, senha, tipo } = req.body;

  if (!nome || !dtNasc || !email || !senha || !tipo) {
    return res.status(400).json({
      success: false,
      message: 'Nome, data de nascimento, email, senha e tipo são obrigatórios',
    });
  }

  if(tipo == 'professor' && !schoolcode){
    return res.status(400).json({
      success: false,
      message: 'Código mestre de professor é obrigatório',
    });
  }

  if(tipo == 'aluno' && !classcode){
    return res.status(400).json({
      success: false,
      message: 'Código do professor é obrigatório',
    });
  }

  const code = tipo == 'aluno' ? classcode : (tipo == 'professor' ? schoolcode : null);

  try {
    const response = await registerService(
      nome,
      dtNasc,
      email,
      senha,
      tipo,
      code
    );

    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
}

async function reset(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email é obrigatório',
    });
  }
  try {
    const response = await resetService(email);

    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}

async function resetConfirm(req, res) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token e nova senha são obrigatórios',
    });
  }
  try {
    const response = await resetConfirmService(token, newPassword);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}

module.exports = { register, login, reset,resetConfirm, validate };
