const { response } = require('express');
const res = require('express/lib/response');

// Models
const { Categoria, Usuario } = require('../models');

// obtenerCategorias - paginado - total - populate
const categoriasGet = async(req, res = response) => {

  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };

  const [ total, categorias ] = await Promise.all([
    Categoria.countDocuments( query ),
    Categoria.find( query )
              .populate('usuario', 'nombre')
              .limit( Number(limite) )
              .skip( Number(desde) )
  ]);

  res.json({
    total,
    categorias
  });

}

// obtenerCategoria - populate {}
const obtenerCategoria =  async( req, res = response ) => {
  console.log('[CONTROLLERS] Categoria Start');
  const { id } = req.params;

  // const [ , nombre, , usuario ] = await Promise.all([
  //   Categoria.findOne( _id ),
  //   Usuario.findOne( usuario  )
  // ]);

  const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
  console.log('[CONTROLLERS] categoria: ', categoria);

  // const creadorCategoria = await Usuario.findOne( usuario  );
  // console.log('[CONTROLLERS] creadorCategoria: ', creadorCategoria);

  console.log('[CONTROLLERS] Categoria end');
  res.json( categoria );

};

const crearCategoria = async(req, res = response) => {

  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if ( categoriaDB ) {
    return res.status(400).json({
      msg: `La categoria ${ categoriaDB.nombre }, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id
  }

  const categoria = new Categoria( data );

  // Guardar DB
  await categoria.save();

  res.status(201).json(categoria);

}

// actualizarCategoria - nombre
const actualizarCategoria = async(req, res = response) => {
  
  const { id } = req.params;
  const { _id, nombre, ...data } = req.body;

  data.nombre = nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

  res.json( categoria );
}

// borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {

  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

  res.json(categoria);
}

module.exports = {
  crearCategoria,
  obtenerCategoria,
  categoriasGet,
  actualizarCategoria,
  borrarCategoria
}