const { Router } = require('express');
const { check } = require('express-validator');

// Controllers
const {
  crearCategoria,
  obtenerCategoria,
  categoriasGet, 
  borrarCategoria, 
  actualizarCategoria} = require('../controllers/categorias');

// Middlewares
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

// Helpers
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', categoriasGet );

// Obtener una categorias por id - publico
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos
], obtenerCategoria ); // función categoriaById

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria );

// Actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos
], borrarCategoria );

module.exports = router