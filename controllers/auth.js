const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async( req, res = response) => {

  const { correo, contrasena } = req.body;

  try {

    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
      return res.status(400).json({
        msg: 'Usuarios / Contraseña no son correctos - correo'
      })
    }

    // Si el usuario está activo
    if ( !usuario.estado ) {
      return res.status(400).json({
        msg: 'Usuarios / Contraseña no son correctos - estado: false'
      })
    }

    // Verificar la contraseña
    const contraValida = bcryptjs.compareSync( contrasena, usuario.contrasena );
    if ( !contraValida ) {
      return res.status(400).json({
        msg: 'Usuarios / Contraseña no son correctos - contrasena'
      })
    }

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el Administrador'
    })
  }

}

module.exports = {
  login
}