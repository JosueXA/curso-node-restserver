const { Router } = require('express');
const { check } = require('express-validator');

// Controllers
const { crearProducto, obtenerProductos, obtenerProducto, borrarProducto, actualizarProducto } = require('../controllers/productos');

// Middlewares
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

// Helpers
const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerProductos );

// Obtener una categorias por id - publico
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
], obtenerProducto );

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID de Mongo válido').isMongoId(),
  // check('id').custom( existeProductoPorId ),
  validarCampos
], crearProducto );

// Actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  // check('categoria', 'No es un ID de Mongo válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
], actualizarProducto );

// Borrar producto - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
], borrarProducto );

module.exports = router