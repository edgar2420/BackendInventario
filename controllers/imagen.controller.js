const supabase = require('../config/supabaseClient')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

const subirImagen = async (req, res) => {
  try {
    if (!req.files || !req.files.imagen) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' })
    }

    const archivo = req.files.imagen
    const nombreArchivo = `${uuidv4()}${path.extname(archivo.name)}`
    const rutaTemporal = archivo.tempFilePath

    
    console.log(' Nombre archivo:', nombreArchivo)
    console.log(' Ruta temporal:', rutaTemporal)

    const fileBuffer = fs.readFileSync(rutaTemporal)

    const uploadResult = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(`componentes/${nombreArchivo}`, fileBuffer, {
        contentType: archivo.mimetype,
        cacheControl: '3600',
        upsert: true
      })

    if (uploadResult.error) {
      console.error(' Error real de Supabase:', uploadResult.error)
      return res.status(500).json({ error: uploadResult.error.message || 'Error al subir imagen' })
    }

    const { data: publicUrlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(`componentes/${nombreArchivo}`)

    return res.json({ url: publicUrlData.publicUrl })

  } catch (err) {
    console.error(' Error inesperado:', err)
    res.status(500).json({ error: err.message || 'Error inesperado al subir imagen' })
  }
}

module.exports = { subirImagen }
