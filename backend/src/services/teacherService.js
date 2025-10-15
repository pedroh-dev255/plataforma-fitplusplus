const pool = require("../../configs/db");

async function alunos(id) {
    try{
        const [rows] = await pool.execute(
            `SELECT 
                *
            FROM 
                alunos as al
            JOIN
                usuarios as us ON al.usuario_id = us.id
            WHERE
                al.professor_id = ?`,
            [id]
        );
            return rows;
    } catch(err){
        throw new Error("Erro ao buscar alunos: " + err.message);
    }
}

module.exports = {
    alunos
}