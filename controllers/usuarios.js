const { response } = require('express');
const bcryptjs = require('bcryptjs');

// Modelo Usuario
const Usuario = require('../models/usuario');


const usuariosGet = async(req, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments( query ),
    Usuario.find( query )
            .limit( Number(limite) )
            .skip( Number(desde) )
  ]);

  res.json({
    total,
    usuarios
  });

}

const usuariosPost = async (req, res = response) => {

  const { nombre, correo, contrasena, rol } = req.body;
  const usuario = new Usuario( { nombre, correo, contrasena, rol } );

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.contrasena = bcryptjs.hashSync( contrasena, salt );

  // Guardar en BD
  await usuario.save();

  res.json({
    usuario
  });
}

const usuariosPut = async(req, res = response) => {

  const { id } = req.params;
  const { _id, contrasena, google, correo, ...resto } = req.body;

  // TODO valida contra BD
  if ( contrasena ) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.contrasena = bcryptjs.hashSync( contrasena, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );

  res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - controlador'
  });
}

const usuariosDelete = async(req, res = response) => {

  const { id } = req.params;
  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

  res.json(usuario);
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}