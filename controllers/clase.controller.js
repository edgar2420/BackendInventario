const supabase = require('../config/supabaseClient')

// Crear clase con tipos asociados
exports.crearClaseConTipos = async (req, res) => {
  const { nombre, tipos } = req.body

  if (!nombre || !Array.isArray(tipos)) {
    return res.status(400).json({ error: 'Nombre y lista de tipos requerida' })
  }

  try {
    // 1. Crear la clase
    const { data: claseData, error: claseError } = await supabase
      .from('clase')
      .insert([{ nombre }])
      .select()

    if (claseError) {
      console.error('Error al crear clase:', claseError)
      return res.status(500).json({ error: claseError.message })
    }

    const claseCreada = claseData[0]

    // 2. Crear tipos asociados a la clase
    const tiposConClase = tipos.map((tipo) => ({
      nombre: tipo.nombre,
      clase_id: claseCreada.id
    }))

    const { data: tiposData, error: tiposError } = await supabase
      .from('tipo')
      .insert(tiposConClase)
      .select()

    if (tiposError) {
      console.error('Error al crear tipos:', tiposError)
      return res.status(500).json({ error: tiposError.message })
    }

    res.status(201).json({
      clase: claseCreada,
      tipos: tiposData
    })
  } catch (error) {
    console.error('Error inesperado:', error)
    res.status(500).json({ error: error.message })
  }
}


exports.obtenerClases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clase')
      .select('*, tipo(*)')
      .order('nombre', { ascending: true })


    if (error) return res.status(500).json({ error: error.message })

    res.status(200).json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.eliminarClase = async (req, res) => {
  const { id } = req.params
  try {
    // 1. Eliminar tipos asociados
    const { error: errorTipos } = await supabase
      .from('tipo')
      .delete()
      .eq('clase_id', id)

    if (errorTipos) return res.status(500).json({ error: errorTipos.message })

    // 2. Eliminar clase
    const { error: errorClase } = await supabase
      .from('clase')
      .delete()
      .eq('id', id)

    if (errorClase) return res.status(500).json({ error: errorClase.message })

    res.json({ msg: 'Clase y tipos eliminados correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.editarClaseYTipos = async (req, res) => {
  const { id } = req.params
  const { nombre, tipos } = req.body

  if (!nombre || !Array.isArray(tipos)) {
    return res.status(400).json({ error: 'Nombre y tipos son requeridos' })
  }

  try {
    // 1. Actualizar clase
    const { error: errorClase } = await supabase
      .from('clase')
      .update({ nombre })
      .eq('id', id)

    if (errorClase) throw errorClase

    // 2. Eliminar todos los tipos actuales de esa clase
    const { error: errorBorrado } = await supabase
      .from('tipo')
      .delete()
      .eq('clase_id', id)

    if (errorBorrado) throw errorBorrado

    // 3. Insertar los nuevos tipos
    const tiposNuevos = tipos.map(t => ({
      nombre: t.nombre,
      clase_id: parseInt(id)
    }))

    const { data: tiposInsertados, error: errorInsert } = await supabase
      .from('tipo')
      .insert(tiposNuevos)
      .select()

    if (errorInsert) throw errorInsert

    res.status(200).json({ msg: 'Actualizado correctamente', tipos: tiposInsertados })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

