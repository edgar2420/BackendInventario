const express = require('express')
const router = express.Router()
const controller = require('../controllers/tipo.controller')

router.post('/agregar', controller.crearTipo)
router.get('/obtener', controller.obtenerTipos)
router.put('/editar/:id', controller.editarTipo)
router.delete('/eliminar/:id', controller.eliminarTipo)
router.get('/por-clase/:clase_id', controller.obtenerTiposPorClase)


module.exports = router
