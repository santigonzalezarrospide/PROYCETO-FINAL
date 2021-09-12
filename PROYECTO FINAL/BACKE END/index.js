const express = require ('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require ('body-parser');
require('dotenv').config();

var nodemailer = require ('nodemailer');
const { JsonWebToken } = require('jsonwebtoken');

const { router: authRouter} = require('./routes/auth');
const { router: vuelos} = require ('./routes/vuelos');

const { verifyToken } = require('./middlewares/jwt-validate');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());

app.use(cors());

//app.use('/auth', authRouter);
app.use('/agenda', vuelos);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'santiago.g.a16@gmail.com',
        pass: ''
    }
})

app.post('/contacto', function (req, res){
    console.log("endpoint contacto", req.body.Nomb + req.body.Corr +req.body.Tel + req.body.mensa);
    var mailOptions = {
        from:'satiago.g.a16@gmail.com',
        to: 'escuelaDeVuelo2021@hotmail.com', // pass: escuela1234
        subject:'Contacto de:' + req.body.Nomb, 'Email:': + req.body.Corr, 'Tel:': + req.body.Tel,
        text: req.body.mensa
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.send(error)
        } else{
            console.log('email sent' + info.response);
            res.send('exito')
        }
    });
});


app.get('/agenda', function (req, res) {
    res.send({
       agenda: listaDeAgenda
    })
})

app.post('/agenda', verifyToken, async (request, response) =>{
   
    const name = req.body.name;
    const apellido = req.body.apellido;
    const telefono = req.body.telefono;
    const mail = req.body.mail;
    const dia = req.body.dia;
    const mes = req.body.mes; 
    const hora = req.body.hora; 
    const tipo_De_Vuelo = req.body.tipo_De_Vuelo;
     
    
    const nuevoVuelo = {

        name: name, 
        apellido: apellido,
        telefono: telefono,
        mail: mail,
        dia: dia,
        mes: mes,
        hora: hora,
        tipo_De_Vuelo: tipo_De_Vuelo,

    }

    const req = await db.query(
        'INSERT INTO agenda (name, apellido, telefono, mail, dia, mes, hora, tipo_de_vuelo, author_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [nuevoVuelo.name, nuevoVuelo.apellido, nuevoVuelo.telefono, nuevoVuelo.mail, nuevoVuelo.dia, nuevoVuelo.mes, nuevoVuelo.hora, nuevoVuelo.tipo_De_Vuelo]  
    )

    response.send({
        vuelos: nuevoVuelo
    })
})
  
app.listen(PORT, function () {
    console.log('El servidor quedo corriendo en el puerto ' + PORT)
});

