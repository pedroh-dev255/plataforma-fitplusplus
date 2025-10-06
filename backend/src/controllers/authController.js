const { loginService, registerService } = require('../services/authService');
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
  const { nome, email, senha, tipo, professor_code } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({
      success: false,
      message: 'Nome, email, senha e tipo são obrigatórios',
    });
  }

  try {
    const response = await registerService(
      nome,
      email,
      senha,
      tipo,
      professor_code
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

module.exports = { register, login, validate };
