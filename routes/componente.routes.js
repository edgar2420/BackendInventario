const express = require('express')
const router = express.Router()
const controller = require('../controllers/componente.controller')

router.get('/obtener', controller.obtenerComponentes)
router.post('/agregar', controller.agregarComponente)
router.delete('/eliminar/:codigo', controller.eliminarComponente)
router.put('/editar/:codigo', controller.editarComponente)
router.get('/obtener/:codigo', controller.obtenerComponentePorCodigo)

module.exports = router
