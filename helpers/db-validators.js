const {
  Usuario,
  Producto,
  Role,
  Categoria,
} = require('../models');

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

// existeCategoria similar a la de arriba
const existeCategoriaPorId = async( id = '' ) => {

  // Verifico si la categoria existe
  const categoriaExistente = await Categoria.findById( id );
  if ( !categoriaExistente ) {
    console.log('No existe la categoria');
    throw new Error(`No exixte la categoria: ${ id } `);
  }

  // console.log('[HELPERS] Existe categoria');

}

// Existe Producto por ID
const existeProductoPorId = async( id = '' ) => {

  // Verifico si la categoria existe
  const productoExistente = await Producto.findById( id );
  if ( !productoExistente ) {
    throw new Error(`No exixte el producto: ${ id } `);
  }

  // console.log('[HELPERS] Existe producto');

}

module.exports = {
  esRoleValido,
  correoExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId

}