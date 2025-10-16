const pool = require("../../configs/db");

async function getAllEventsService( dtinicio, dtfim) {
    try {
        if(!dtinicio || !dtfim) {

            const [rows] = await pool.execute(
                `SELECT *
                FROM evento_participantes as ep
                    JOIN eventos as e ON ep.evento_id = e.id
                    WHERE  AND e.data_hora >= NOW()`
            );
            return rows;
        } 
        const [rows] = await pool.execute(
            `SELECT *
            FROM evento_participantes as ep
                JOIN eventos as e ON ep.evento_id = e.id
                WHERE  AND e.data_hora BETWEEN ? AND ?`,
            [ dtinicio, dtfim]
        );

        const [outros] = await pool


        return rows;
        
    } catch (error) {

        throw new Error("Erro ao buscar eventos: " + error.message);
        
    }

}

async function getEventsService(userId, dtinicio, dtfim) {
    try {
        let query;
        let params = [];

        if(!dtinicio || !dtfim) {
            query = `
                SELECT
                    e.*,
                    ep.usuario_id as participante_id,
                    u.nome as participante_nome,
                    u.tipo as participante_tipo,
                    u.email as participante_email,
                    criador.nome as criador_nome,
                    criador.tipo as criador_tipo
                FROM
                    evento_participantes AS ep
                JOIN
                    eventos AS e ON ep.evento_id = e.id
                JOIN
                    usuarios AS u ON ep.usuario_id = u.id
                JOIN
                    usuarios AS criador ON e.criador_id = criador.id
                WHERE
                    ep.usuario_id = ?
                    AND e.data_hora >= NOW()
                ORDER BY
                    e.data_hora ASC`;
            params = [userId];
        } else {
            query = `
                SELECT
                    e.*,
                    ep.usuario_id as participante_id,
                    u.nome as participante_nome,
                    u.tipo as participante_tipo,
                    u.email as participante_email,
                    criador.nome as criador_nome,
                    criador.tipo as criador_tipo
                FROM
                    evento_participantes AS ep
                JOIN
                    eventos AS e ON ep.evento_id = e.id
                JOIN
                    usuarios AS u ON ep.usuario_id = u.id
                JOIN
                    usuarios AS criador ON e.criador_id = criador.id
                WHERE
                    ep.usuario_id = ? 
                    AND e.data_hora BETWEEN ? AND ? 
                ORDER BY e.data_hora ASC`;
            params = [userId, dtinicio, dtfim];
        }

        const [rows] = await pool.execute(query, params);

        // Agrupar os eventos e seus participantes
        const eventosAgrupados = {};
        
        rows.forEach(row => {
            const eventoId = row.id;
            
            if (!eventosAgrupados[eventoId]) {
                // Cria o evento base
                eventosAgrupados[eventoId] = {
                    id: row.id,
                    criador_id: row.criador_id,
                    esporte_id: row.esporte_id,
                    titulo: row.titulo,
                    descricao: row.descricao,
                    local: row.local,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    data_hora: row.data_hora,
                    max_participantes: row.max_participantes,
                    tipo: row.tipo,
                    status: row.status,
                    criador: {
                        id: row.criador_id,
                        nome: row.criador_nome,
                        tipo: row.criador_tipo
                    },
                    participantes: []
                };
            }
            
            // Adiciona o participante ao evento
            eventosAgrupados[eventoId].participantes.push({
                id: row.participante_id,
                nome: row.participante_nome,
                email: row.participante_email,
                tipo: row.participante_tipo
            });
        });

        // Converter objeto para array
        return Object.values(eventosAgrupados);
        
    } catch (error) {
        console.log('Erro ao buscar eventos: ' + error);
        throw new Error("Erro ao buscar eventos: " + error.message);
    }
}

async function addPartService(id_prof, id_user, id_evento) {
    try {
        // Verifica o evento - precisa desestruturar o resultado
        const [eventRows] = await pool.execute("SELECT * FROM eventos WHERE id = ?", [id_evento]);
        
        if (eventRows.length === 0) {
            throw new Error("Evento não encontrado");
        }
        
        const event = eventRows[0];
        
        if (event.tipo !== "publico") {
            if (!id_prof || event.criador_id != id_prof) {
                throw new Error("Participante não cadastrado - Sem permissão");
            }
        }

        // Verifica se já é participante - precisa desestruturar o resultado
        const [partRows] = await pool.execute(
            "SELECT * FROM evento_participantes WHERE evento_id = ? AND usuario_id = ?", 
            [id_evento, id_user]
        );
        
        if (partRows.length > 0) {
            throw new Error("Participante não cadastrado - Usuário já faz parte do evento");
        }

        // INSERT corrigido (fechando parêntese)
        const [result] = await pool.execute(
            "INSERT INTO evento_participantes (evento_id, usuario_id) VALUES (?, ?)", 
            [id_evento, id_user]
        );

        return result;
    } catch (error) {
        throw new Error("Erro ao adicionar participante: " + error.message);
    }
}

async function createEventService(id_prof, esporte, tipo, titulo, desc, local, lat, long, dth, max) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO eventos (criador_id, esporte_id, tipo, titulo, descricao, local, latitude, longitude, data_hora, max_participantes) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id_prof, esporte, tipo, titulo, desc, local, lat, long, dth, max]
        );

        if(result.insertId){
            const [result2] = await pool.execute(
                "INSERT INTO evento_participantes (evento_id, usuario_id) values (?, ?)",
                [result.insertId, id_prof]
            );
        }else {
            throw new Error("Erro ao cadastrar evento: ");
        }

        return result;
    } catch (error) {
        throw new Error("Erro ao cadastrar evento: " + error.message);
    }
}
module.exports = {
    getEventsService,
    createEventService,
    getAllEventsService,
    addPartService
};