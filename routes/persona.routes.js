const express = require('express')
const router = express.Router()
const controller = require('../controllers/persona.controller')

router.get('/obtener', controller.obtenerPersonas)
router.post('/agregar', controller.crearPersona)
router.delete('/eliminar/:id', controller.eliminarPersona)
router.put('/editar/:id', controller.editarPersona)

module.exports = router
