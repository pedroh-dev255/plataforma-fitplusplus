const pool = require('../../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


async function loginService(email, password) {
    const [rows] = await pool.execute('SELECT * FROM professores WHERE email = ?', [email]);
    if (rows.length === 0) {
        return null; // User not found
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.senha);
    if (!match) {
        return null; // Password does not match
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    //retirando a senha do objeto user
    delete user.senha;
    
    return { token, user };
}

async function registerService(name, email, password) {
    const [rows] = await pool.execute('SELECT * FROM professores WHERE email = ?', [email]);
    if (rows.length > 0) {
        return null; // User already exists
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute('INSERT INTO professores (nome, email, senha) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    return { token, user: { id: userId, email: email, name: name } };
}

module.exports = {
    loginService,
    registerService
}