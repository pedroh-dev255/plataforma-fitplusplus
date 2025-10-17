const pool = require("../../configs/db");

async function alunos(id) {
    try{
const [rows] = await pool.execute(
    `SELECT 
        al.*,
        us.id as iduser,
        us.nome,
        us.email,
        us.tipo,
        us.data_nascimento,
        us.nivel,
        us.pontos,
        us.criado_em,
        us.lesao,
        ls.id as lesao_id,
        ls.cabeca,
        ls.pescoco,
        ls.ombros,
        ls.peito,
        ls.bracos,
        ls.torco,
        ls.maos,
        ls.pernas,
        ls.joelho,
        ls.panturrilha,
        ls.pes
    FROM 
        alunos as al
    JOIN
        usuarios as us ON al.usuario_id = us.id
    LEFT JOIN
        lesoes as ls ON us.id = ls.id_usuario
    WHERE
        al.professor_id = ?`,
    [id]
);

const alunosColunas = rows.map(aluno => {
    const { 
        senha, bio, foto_perfil, genero, objetivo,
        lesao_id, cabeca, pescoco, ombros, peito, bracos, 
        torco, maos, pernas, joelho, panturrilha, pes,
        ...alunoSemSenha 
    } = aluno;
    
    // Se tiver lesão (lesao = 1) E existir registro na tabela lesoes
    if (aluno.lesao === 1 && aluno.lesao_id) {
        alunoSemSenha.lesoes = {
            id: aluno.lesao_id,
            cabeca: aluno.cabeca === 1,
            pescoco: aluno.pescoco === 1,
            ombros: aluno.ombros === 1,
            peito: aluno.peito === 1,
            bracos: aluno.bracos === 1,
            torco: aluno.torco === 1,
            maos: aluno.maos === 1,
            pernas: aluno.pernas === 1,
            joelho: aluno.joelho === 1,
            panturrilha: aluno.panturrilha === 1,
            pes: aluno.pes === 1
        };
    } else {
        alunoSemSenha.lesoes = null;
    }
    
    return alunoSemSenha;
});

return alunosColunas;
    } catch(err){
        throw new Error("Erro ao buscar alunos: " + err.message);
    }
}

async function alunoAv(id) {
    try {
        const [res] = await pool.execute("select * from avaliacao where id_aluno = ?",[id]);

        return res;
    } catch (error) {
        throw new Error("Erro ao buscar avalições: " + err.message);
    }
    
}

module.exports = {
    alunos,
    alunoAv
}