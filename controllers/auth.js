const { response } = require('express');
const bcryptjs = require('bcryptjs');

// Model
const Usuario = require('../models/usuario');
// Helpers
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

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

const googleSignIn = async( req, res = response ) => {

  const { id_token } = req.body;

  try {

    const { nombre, img, correo } = await googleVerify( id_token );

    let usuario = await Usuario.findOne({ correo });

    // Si el usuario no existe
    if ( !usuario ) {
      // Crear usuario
      const data = {
        nombre,
        correo,
        contrasena: ':P',
        img,
        rol: 'USER_ROLE',
        google: true
      };

      usuario = new Usuario( data );
      await usuario.save();

    }

    // Si el usuario en DB ya fue eliminado
    if ( !usuario.estado ) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      });
    }

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El Token no se pudo verificar'
    });
  }

}

module.exports = {
  login,
  googleSignIn
}