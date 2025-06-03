const express = require('express')
const router = express.Router()
const unidadProcesoController = require('../controllers/unidadProceso.controller')

router.get('/obtener', unidadProcesoController.obtenerUnidadesProceso)
router.post('/agregar', unidadProcesoController.crearUnidadProceso)
router.put('/editar/:id', unidadProcesoController.editarUnidadProceso)
router.delete('/eliminar/:id', unidadProcesoController.eliminarUnidadProceso)

module.exports = router
