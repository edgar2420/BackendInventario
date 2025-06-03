const express = require('express')
const router = express.Router()
const componenteController = require('../controllers/componente.controller')
const imagenController = require('../controllers/imagen.controller')

// Rutas existentes
router.get('/obtener', componenteController.obtenerComponentes)
router.post('/agregar', componenteController.agregarComponente)
router.delete('/eliminar/:codigo', componenteController.eliminarComponente)
router.put('/editar/:codigo', componenteController.editarComponente)
router.get('/obtener/:codigo', componenteController.obtenerComponentePorCodigo)

// NUEVA RUTA para subir imagen vinculada a un componente
router.post('/:codigo/subir-imagen', imagenController.subirImagen)

module.exports = router
