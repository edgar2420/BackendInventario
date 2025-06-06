const supabase = require('../config/supabaseClient')
const { generarCodigo } = require('../utils/generarCodigo')

// Obtener todos los componentes
const obtenerComponentes = async (req, res) => {
  const { data, error } = await supabase
    .from('componentes')
    .select(`
      *,
      clase:clase_id(nombre),
      tipo:tipo_id(nombre)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener componentes:', error)
    return res.status(500).json({ error: 'Error al obtener componentes' })
  }

  res.json(data)
}

// Agregar nuevo componente
const agregarComponente = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      modelo,
      marca,
      cantidad,
      imagen_url,
      clase_id,
      tipo_id
    } = req.body

    const codigo = await generarCodigo(clase_id, tipo_id)

    const { data, error } = await supabase
      .from('componentes')
      .insert([{
        codigo,
        nombre,
        descripcion,
        modelo,
        marca,
        cantidad,
        imagen_url,
        clase_id,
        tipo_id
      }])
      .select()

    if (error) {
      console.error('Error al crear componente:', error)
      return res.status(500).json({ error: 'Error al crear componente' })
    }

    res.status(201).json(data[0])
  } catch (error) {
    console.error('Error inesperado al crear componente:', error)
    res.status(500).json({ error: 'Error inesperado al crear componente' })
  }
}

// Eliminar componente por código
const eliminarComponente = async (req, res) => {
  const { codigo } = req.params

  const { error } = await supabase
    .from('componentes')
    .delete()
    .eq('codigo', codigo)

  if (error) {
    console.error('Error al eliminar componente:', error)
    return res.status(500).json({ error: 'Error al eliminar componente' })
  }

  res.json({ msg: 'Componente eliminado correctamente' })
}

// Editar componente por código
const editarComponente = async (req, res) => {
  const { codigo } = req.params
  const {
    nombre,
    descripcion,
    modelo,
    marca,
    cantidad,
    imagen_url,
    clase_id,
    tipo_id
  } = req.body

  try {
    const claseResp = await supabase.from('clase').select('id').eq('id', clase_id).single()
    const tipoResp = await supabase.from('tipo').select('id').eq('id', tipo_id).single()

    if (!claseResp.data || !tipoResp.data) {
      return res.status(400).json({ error: 'Clase o tipo no encontrados' })
    }

    const camposActualizados = {
      nombre,
      descripcion,
      modelo,
      marca,
      cantidad,
      imagen_url,
      clase_id,
      tipo_id
    }

    const { error } = await supabase
      .from('componentes')
      .update(camposActualizados)
      .eq('codigo', codigo)

    if (error) {
      console.error('Error al editar componente:', error)
      return res.status(500).json({ error: 'Error al editar componente' })
    }

    res.json({ msg: 'Componente actualizado correctamente' })
  } catch (err) {
    console.error('Error inesperado en editarComponente:', err)
    res.status(500).json({ error: 'Error inesperado al editar componente' })
  }
}

// Obtener un componente por su código
const obtenerComponentePorCodigo = async (req, res) => {
  const { codigo } = req.params

  const { data, error } = await supabase
    .from('componentes')
    .select(`
      *,
      clase:clase_id(nombre),
      tipo:tipo_id(nombre)
    `)
    .eq('codigo', codigo)
    .single()

  if (error) {
    console.error('Error al obtener componente:', error)
    return res.status(404).json({ error: 'Componente no encontrado' })
  }

  res.json(data)
}

module.exports = {
  obtenerComponentes,
  agregarComponente,
  eliminarComponente,
  editarComponente,
  obtenerComponentePorCodigo
}

