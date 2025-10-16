const { getSalasService } = require("../services/forumService.js");

async function getSalas(req, res) {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro " + error.message
        })
    }
    
}

module.exports = {
    getSalas
}