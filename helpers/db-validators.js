const Usuario = require('../models/usuario');
const Role = require('../models/role');

const esRoleValido = async( rol = '' ) => {
  const existeRol = await Role.findOne({ rol });
  if ( !existeRol ) {
    throw new Error(`El rol: ${ rol } no está registrado en la BD`)
  }
}

const correoExiste = async( correo = '' ) => {

  // Verificar si el correo existe
  const existeCorreo = await Usuario.findOne({ correo });
  if ( existeCorreo ) {
    throw new Error(`El correo: ${ correo }, ya está registrado`);
  }

}

const existeUsuarioPorId = async( id = '' ) => {

  // Verificar si el correo existe
  const existeUsuario = await Usuario.findById( id );
  if ( !existeUsuario ) {
    throw new Error(`No existe el id: ${ id }`);
  }

}

module.exports = {
  esRoleValido,
  correoExiste,
  existeUsuarioPorId
}