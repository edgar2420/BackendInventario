const supabase = require('../config/supabaseClient')

exports.obtenerUnidadesProceso = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('unidad_proceso')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error al obtener unidades de proceso:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    console.error('Error inesperado:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.crearUnidadProceso = async (req, res) => {
  const { nombre } = req.body

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' })
  }

  try {
    const { data, error } = await supabase
      .from('unidad_proceso')
      .insert([{ nombre: nombre.trim() || null }])
      .select()

    if (error) {
      if (error.message.includes('duplicate key value')) {
        return res.status(409).json({ error: 'Ya existe una unidad de proceso con ese nombre' })
      }

      console.error('Error al crear unidad de proceso:', error)
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json(data[0])
  } catch (error) {
    console.error('Error inesperado:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.editarUnidadProceso = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' })
  }

  try {
    const { data, error } = await supabase
      .from('unidad_proceso')
      .update({
        nombre: nombre.trim() || null
      })
      .eq('id', id)
      .select()

    if (error) {
      if (error.message.includes('duplicate key value')) {
        return res.status(409).json({ error: 'Ya existe una unidad de proceso con ese nombre' })
      }

      console.error('Error al editar unidad de proceso:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data.length) return res.status(404).json({ error: 'Unidad no encontrada' })

    res.json(data[0])
  } catch (error) {
    console.error('Error inesperado:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.eliminarUnidadProceso = async (req, res) => {
  const { id } = req.params

  try {
    const { error } = await supabase
      .from('unidad_proceso')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar unidad de proceso:', error)
      return res.status(500).json({ error: error.message })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Error inesperado:', error)
    res.status(500).json({ error: error.message })
  }
}
