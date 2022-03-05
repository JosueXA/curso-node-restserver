const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
// Controllers
const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login', [
  check('correo', 'El correo es obligatorio').isEmail(),
  check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login );

router.post('/google', [
  check('id_token', 'id_token es necesario').not().isEmpty(),
  validarCampos
], googleSignIn );


module.exports = router