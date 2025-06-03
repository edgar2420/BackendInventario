require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()
  
// Middlewares
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 }
}))

// Rutas
app.use('/api/componente', require('./routes/componente.routes'))
app.use('/api/imagene', require('./routes/imagen.routes'))
app.use('/api/movimiento', require('./routes/movimiento.routes'))
app.use('/api/clase', require('./routes/clase.routes'))
app.use('/api/tipo', require('./routes/tipo.routes'))
app.use('/api/unidad-proceso', require('./routes/unidadProceso.routes'))
app.use('/api/persona', require('./routes/persona.routes'))


// Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
