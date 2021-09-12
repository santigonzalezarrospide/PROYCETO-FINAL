const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const {TOKEN_SECRET, verifyToken}  = require ('../middlewares/jwt-validate.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true });
});


router.post('/register', async (req, res) =>{

  if(req.body.nombre && req.body.apellido && req.body.mail  && req.body.password){

    if ( /^\S+@\S+\.\S+$/.test(req.body.mail) === false){
      return res.status(400).json({success: false, massage: 'Formato de mail incorrecto'});
    }
    
    const usuariosDB = await db.query('SELECT * FROM regisrto WHERE mail = $1', [req.body.mail]);
    const existeUser = usuariosDB.rowCount > 0;

    if (existeUser){
      return res.status(400).json({success: false, massage: 'Mail repetido'});
    }
    
    const salt = await bcrypt.genSalt(10);
    console.log('salt', salt)
    const password = await bcrypt.hash(req.body.password, salt) ;
    
    const newUser = {
      nombre: req.body.nombre,
      apellido: req.body.appelido,
      mail: req.body.mail,
      password: password
    }

    const resDB = await db.query(
      'INSERT INTO registro(nombre, apellido, mail, password)  VALUES ($1, $2, $2, $4)',
      [newUser.nombre, newUser.apellido, newUser.mail, newUser,password]
    );

    return res.json({success: true, newUser});
  }
  else{
    return res.status(400).json({success: false, massage: 'Faltan datos (requeridos nombre, apellido, mail, password)'})
  }
});


router.post('/login', async (req, res) =>{

  const resDB = await db.query('SELECT * FROM registro WHERE mail = $1', [req.body.mail]);
  let user = null;
  if (resDB.rowCount.length === 1) {
    user = resDB.rows[0];
  }

  if (!user) {
    return res.status(400).json({ error: 'Usuario no encontrado' });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({error: 'Contraseña no valida'});
  }

  const token = jwt.sign({
    nombre: user.name,
    appelido: user.appelido,
    mail: user.mail,
    userID: user.id
  }, TOKEN_SECRET)

  res.status(200).json({ 
    error: null, 
    data: 'Login exitoso', 
    token
  });
})

router.get('/usuarios', verifyToken, async (req, res) =>{

  const resDB = await db.query('SELECT id, nombre, apellido, mail FROM registro');

  res.json({error: null, usuarios: resDB.rows})
})

module.exports = router;


const usuarios = [
  {
    name: "Santiago",
    mail: "escuelaDeVuelo2021@hotmail.com",
    password: "$2b$10$AR8.IsOr4HROnPAagS4pfez.ragNjOFxGsiSblA0rT80rPjWBunPy" //escuela1234
  }
];
