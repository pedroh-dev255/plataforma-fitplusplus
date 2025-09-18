const pool = require("../../configs/db");
const bcrypt = require('bcrypt');


async function createClassService(id, nome, hex) {
    try {
        let codigo;
        let rows;

        do {
            // gera código aleatório de 6 caracteres
            const salt = await bcrypt.genSalt(5);
            const hash = await bcrypt.hash(Date.now().toString(), salt);
            codigo = hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 6);

            // verifica se já existe no banco
            [rows] = await pool.execute("SELECT * FROM classroom WHERE cod = ?", [codigo]);
        } while (rows.length > 0);

        // insere no banco
        const [result] = await pool.execute(
            "INSERT INTO classroom (id_prof, nome, cor, cod) VALUES (?, ?, ?, ?)",
            [id, nome, hex, codigo]
        );

        return {
            cod: codigo,
            insertId: result.insertId,
        };

    } catch (error) {
        throw new Error("Erro ao cadastrar classe: " + error.message);
    }
    
}

async function getAllClassService(id) {
    try {
        const [rows] = await pool.execute('SELECT * FROM classroom WHERE id_prof = ?', [id]);
        return rows;
    } catch (error) {
        throw new Error("Erro ao buscar dados: " + error.message);
    }
    
}

async function getClassService(id, id_prof) {
    try {
        // busca a sala
        const [classRows] = await pool.execute(
            `SELECT 
                id, id_prof, cod, cor, nome, created_at, updated_at
             FROM classroom 
             WHERE id = ? AND id_prof = ?`,
            [id, id_prof]
        );

        if (classRows.length === 0) {
            throw new Error("Classe não encontrada ou user sem permissão");
        }

        const classroom = classRows[0];

        // busca os alunos vinculados a sala
        const [studentRows] = await pool.execute(
            `SELECT a.id, a.matricula, a.nome, a.email
             FROM alunos a
             INNER JOIN class_aluno ca ON ca.id_aluno = a.id
             WHERE ca.id_class = ?`,
            [id]
        );

        // junta os alunos na resposta
        classroom.Alunos = studentRows;

        return classroom;

    } catch (error) {
        throw new Error("Erro ao buscar dados: " + error.message);
    }
}



module.exports = {
    createClassService,
    getAllClassService,
    getClassService
}