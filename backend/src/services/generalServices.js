const pool = require("../../configs/db");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


async function getIdUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // aqui você pega o id
  } catch (err) {
    console.error("Token inválido:", err.message);
    return null; // ou pode lançar erro
  }
}


module.exports = { getIdUser };