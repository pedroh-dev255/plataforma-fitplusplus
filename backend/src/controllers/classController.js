const dotenv = require('dotenv');
const path = require('path');
const { getIdUser } = require("../services/generalServices");
const { createClassService, getAllClassService, getClassService } = require("../services/classService");
dotenv.config();



async function createClass(req, res) {
    const { token, nome, hex } = req.body;

    if(!token || !nome || !hex){
        res.status(400).json({
            success: false,
            message: "Preencha todos os campos"
        });
    }
     

    try{
        const id = await getIdUser(token);

        if(!id || id == null){
            throw new Error("Erro ao decodificar id usuario");
        }

        const result = await createClassService(id, nome, hex);

        if(!result || result == null){
            throw new Error("Erro ao cadastrar sala");
        }

        res.status(200).json({
            success: true,
            classCod: result.cod,
            message: "Classe criada com sucesso!"
        });
        
    } catch (err){
        res.status(401).json({
            success: false,
            message: err.message 
        });
    }

}


async function getAllClass(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        const id = await getIdUser(token);

        if(!id || id == null){
            throw new Error("Erro ao decodificar id usuario");
        }
        const result = await getAllClassService(id);
        
        if(!result || result == null){
            throw new Error("Erro ao buscar salas");
        }

        res.json({
            success: true,
            result
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error
        });
    }
}

async function getClass(req, res) {
    const {id} = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        const id_prof = await getIdUser(token);

        if(!id_prof || id_prof == null){
            throw new Error("Erro ao decodificar id usuario");
        }
        if(!id || id == null){
            throw new Error("Informe todos os campos");
        }

        const result = await getClassService(id, id_prof);

        res.json({
            success: true,
            result
        });
        
    } catch (error) {
        
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    createClass,
    getAllClass,
    getClass
}