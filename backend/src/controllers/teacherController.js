const { alunos, alunoAv } = require('../services/teacherService')

async function getAlunos(req, res) {
    try {
        const {
            id_prof
        } = req.body;

        if(!id_prof){
            return res.status(400).json({
                success: false,
                message: "id do professor obrigatorio"
            });
        }

        const result = await alunos(id_prof);

        return res.status(200).json({ success: true, alunos: result });
    }catch (err){
        return res.status(500).json({
            success: false,
            message: "Erro "+ err.message
        });
    }
    
}

async function getAv(req, res) {
        try {
        const {
            id_aluno
        } = req.body;

        if(!id_aluno){
            return res.status(400).json({
                success: false,
                message: "id do aluno obrigatorio"
            });
        }

        const result = await alunoAv(id_aluno);

        return res.status(200).json({ success: true, avaliacoes: result });
    }catch (err){
        return res.status(500).json({
            success: false,
            message: "Erro "+ err.message
        });
    }
}

module.exports = {
    getAlunos,
    getAv
}