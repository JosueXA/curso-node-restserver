const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models/");

const coleccionesPermitidas = [
  'usuarios',
  'categorias',
  'productos',
  'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

  const esMongoID = ObjectId.isValid( termino ); // TRUE

  if ( esMongoID ){
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: ( usuario ) ? [ usuario ] : []
    });
  }

  const regex = new RegExp( termino, 'i' );

  const usuarios = await Usuario.find({ 
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  });

  res.json({
    results: usuarios
  });

}

const buscarCategorias = async( termino = '', res = response ) => {

  const esMongoID = ObjectId.isValid( termino ); // TRUE

  // Verifica si es un ID válido de Mongo
  if ( esMongoID ) {
    // Encuentra por ID le pasa el termino 
    const categoria = await Categoria.findById( termino );
    // Regresa la búsqueda en un formato JSON
    return res.json({
      results: ( categoria ) ? [ categoria ] : []
    });
  }
  // 
  const regex = new RegExp( termino, 'i' );

  const categorias = await Categoria.find({ nombre: regex, estado: true });

  res.json({
    results: categorias
  });

}

const buscarProductos = async( termino = '', res = response)  => {
  
  const esMongoID = ObjectId.isValid( termino ); // TRUE

  // Verificar si es un ID válido de Mongo
  if ( esMongoID ) {
    const producto = await Producto.findById( termino )
                                    .populate('categoria','nombre');
    return res.json({
      results: ( producto ) ? [ producto ] : []
    });
  }

  const regex = new RegExp( termino, 'i' );
  const productos = await Producto.find({ nombre: regex, estado: true })
                                  .populate('categoria','nombre');

  res.json({
    results: productos
  })
}

const buscar = async(req, res = response) => {

  const { coleccion, termino } = req.params;

  if ( !coleccionesPermitidas.includes( coleccion ) ) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;

    case 'categorias':
      buscarCategorias(termino, res);
      break;

    case 'productos':
      buscarProductos(termino, res);
      break;
  
    default:
      res.status(500).json({
        msg: `Se te olvido hacer está búsqueda`
      })
      break;
  }

}

module.exports = {
  buscar
}