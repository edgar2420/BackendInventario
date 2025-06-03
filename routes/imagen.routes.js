const express = require('express')
const router = express.Router()
const controller = require('../controllers/imagen.controller')

router.post('/subir', controller.subirImagen)

module.exports = router
