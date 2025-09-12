const {loginService, registerService} = require('../services/authService');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

dotenv.config();



async function validate(req, res) {
    try {
      res.json({
        success: true,
        ok: 'ok',
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        message: error.message 
      });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    //validate fields

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha obrigatorios' 
      });
    }
    if (typeof email !== 'string' || typeof password !== 'string' || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha invalidos' 
      });
    }
    if (password.length < 6) { 
        return res.status(400).json({
            success: false,
            message: 'Senha deve ter no minimo 6 caracteres'
        });
    }

    try {
        
        const response = await loginService(email, password);

        if (!response || response === null) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha invalidos'
            });
        }
        
        return res.status(200).json({
            success: true,
            response,
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Erro no servidor' 
        });
    }
}

async function register(req, res) {
    const { name, email, password } = req.body;

    //validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome, email e senha obrigatorios' 
      });
    }
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome, email e senha invalidos' 
      });
    }
    if (password.length < 6) { 
        return res.status(400).json({
            success: false,
            message: 'Senha deve ter no minimo 6 caracteres'
        });
    }

    try {
        
        const response = await registerService(name, email, password);
        if (!response || response === null) {
            return res.status(409).json({
                success: false,
                message: 'Usuario ja existe'
            });
        }
        return res.status(201).json({
            success: true,
            response,
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Erro no servidor' 
        });
    }
}


module.exports = {
    register,
    login,
    validate
}