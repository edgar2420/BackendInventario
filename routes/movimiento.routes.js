const express = require('express')
const router = express.Router()
const controller = require('../controllers/movimientos.controller')

// Registrar nuevo movimiento
router.post('/crear', controller.crearMovimiento)

// Obtener todos los movimientos
router.get('/', controller.obtenerMovimientos)

// Obtener movimientos por componente
router.get('/componente/:codigo', controller.obtenerMovimientoPorComponente)


module.exports = router
