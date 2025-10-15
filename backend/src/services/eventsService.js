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
    //console.log('eventos')
    try {
        if(!dtinicio || !dtfim) {

            const [rows] = await pool.execute(
                `SELECT
                        *
                    FROM
                        evento_participantes AS ep
                    JOIN
                        eventos AS e
                        ON ep.evento_id = e.id
                    WHERE
                        ep.usuario_id = ?
                        AND e.data_hora >= NOW()
                    ORDER BY
                        e.data_hora ASC;`,
                [userId]
            );
            return rows;
        } 
        const [rows] = await pool.execute(
            `SELECT *
            FROM evento_participantes as ep
                JOIN eventos as e ON ep.evento_id = e.id
                WHERE ep.usuario_id = ? AND e.data_hora BETWEEN ? AND ? ORDER ASC data_hora`,
            [userId, dtinicio, dtfim]
        );

        const [outros] = await pool


        return rows;
        
    } catch (error) {
        console.log('erro ao buscar enventos: '+error)
        throw new Error("Erro ao buscar eventos: " + error.message);
        
    }

}


async function createEventService(id_prof, esporte, titulo, desc, local, lat, long, dth, max) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO eventos (criador_id, esporte_id, titulo, descricao, local, latitude, longitude, data_hora, max_participantes) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id_prof, esporte, titulo, desc, local, lat, long, dth, max]
        );

        if(result.insertId){
            const [result2] = await pool.execute(
                "INSERT INTO evento_participantes (evento_id, usuario_id, status) values (?, ?, 'confirmado')",
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
    getAllEventsService
};