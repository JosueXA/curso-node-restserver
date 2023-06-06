const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { 
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} = require('../middlewares')

// Helpers usuarios
const { esRoleValido, correoExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// Controllers usuarios
const { 
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom( esRoleValido ),
  validarCampos
], usuariosPut );

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('contrasena', 'La contraseña debe de ser más de 6 letras').isLength({ min: 6 }),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom( correoExiste ),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido ),
  validarCampos,
], usuariosPost );

router.delete('/:id', [
  validarJWT,
  // esAdminRole,
  tieneRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE' ),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );

module.exports = router;