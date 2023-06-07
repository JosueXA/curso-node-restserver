const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

// Controllers
const { cargarArchivo } = require('../controllers/uploads');

const router = Router();

router.post('/', cargarArchivo);




module.exports = router