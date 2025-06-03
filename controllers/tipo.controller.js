const supabase = require('../config/supabaseClient')

// crear tipo
exports.crearTipo = async (req, res) => {
    const { nombre, clase_id } = req.body

    if (!nombre || !clase_id) {
        return res.status(400).json({ error: 'Nombre y clase_id son requeridos' })
    }

    try {
        const { data, error } = await supabase
            .from('tipo')
            .insert([{ nombre, clase_id }])
            .select()

        if (error) {
            console.error('Error al crear tipo:', error)
            return res.status(500).json({ error: error.message })
        }

        res.status(201).json(data[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}
// Editar tipo
exports.editarTipo = async (req, res) => {
    const { id } = req.params
    const camposActualizados = req.body

    try {
        const { data, error } = await supabase
            .from('tipo')
            .update(camposActualizados)
            .eq('id', id)
            .select()

        if (error) {
            console.error('Error al editar tipo:', error)
            return res.status(500).json({ error: error.message })
        }

        res.json(data[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Obtener todos los tipos
exports.obtenerTipos = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tipo')
            .select('*')

        if (error) {
            console.error('Error al obtener tipos:', error)
            return res.status(500).json({ error: error.message })
        }

        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Eliminar tipo
exports.eliminarTipo = async (req, res) => {
  const { id } = req.params

  try {
    const { error } = await supabase
      .from('tipo')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar tipo:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ msg: 'Tipo eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener tipos por clase_id
exports.obtenerTiposPorClase = async (req, res) => {
  const { clase_id } = req.params

  try {
    const { data, error } = await supabase
      .from('tipo')
      .select('*')
      .eq('clase_id', clase_id)

    if (error) {
      console.error('Error al obtener tipos por clase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
