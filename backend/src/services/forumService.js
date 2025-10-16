const pool = require("../../configs/db");


async function getSalasService() {
    try {
        const [result] = await pool.execute("Select * from esportes");

        return result
    } catch (error) {
        throw new Error("Erro ao buscar salas"+error.message);
    }    
}


module.exports = {
    getSalasService
}