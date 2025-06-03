const express = require('express')
const router = express.Router()
const controller = require('../controllers/clase.controller')

router.get('/obtener', controller.obtenerClases)
router.post('/agregar-con-tipos', controller.crearClaseConTipos)
router.delete('/eliminar/:id', controller.eliminarClase)
router.put('/editar/:id', controller.editarClaseYTipos)


module.exports = router
