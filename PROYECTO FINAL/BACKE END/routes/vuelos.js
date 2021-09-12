const express = require ('express');
const db = require('../db');

const { verifyToken } = require('../middlewares/jwt-validate');

const router = express.Router();

router.get('/agenda', async (request, response) =>{

    const res = await db.query('SELECT agenda.*, registro.nombre FROM agenda INNER JOIN registro ON agenda.author_id = regisstro.id')
    
    console.log(res.rows);

    response.send({
    agenda: res.rows
  });
})

router.post('/agenda', verifyToken, async  (request, response) =>{
    
    const newFlight ={
        name: req.body.name,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        mail: req.body.mail,
        dia: req.body.dia, 
        mes: req.body.mes, 
        hora: req.body.hora, 
        tipo_De_Vuelo: req.body.tipo_De_Vuelo,
        author_id: request.user.userId,
    }

    const res = await db.query(
        'INSERT INTO agenda (name, apellido, telefono, mail, dia, mes, hora, tipo_de_vuelo, author_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [newFlight.name, newFlight.apellido, newFlight.telefono, newFlight.mail, newFlight.dia, newFlight.mes, newFlight.hora, newFlight.tipo_De_Vuelo, newFlight.author_id]  
    );

    response.send({
        vuelos: newFlight
    })
})

module.exports = {
    router: router
}