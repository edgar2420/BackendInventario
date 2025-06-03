const supabase = require('../config/supabaseClient')

// Registrar nuevo movimiento
exports.crearMovimiento = async (req, res) => {
  const {
    componente_codigo = '',
    tipo = '',
    cantidad,
    persona = '',
    orden_trabajo = '',
    motivo = ''
  } = req.body

  // Validaciones básicas
  if (
    !componente_codigo.trim() ||
    !tipo.trim() ||
    !cantidad ||
    isNaN(cantidad) ||
    Number(cantidad) <= 0
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' })
  }

  try {
    const { error: insertError } = await supabase
      .from('movimientos')
      .insert([{
        componente_codigo: componente_codigo.trim(),
        tipo: tipo.toLowerCase(),
        cantidad,
        persona: persona.trim(),
        orden_trabajo: orden_trabajo.trim(),
        observaciones: motivo.trim()
      }])

    if (insertError) throw insertError

    // Actualizar stock con función RPC
    const factor = tipo.toLowerCase() === 'entrada' ? 1 : -1
    const { error: rpcError } = await supabase.rpc('actualizar_stock', {
      codigo_param: componente_codigo.trim(),
      cantidad_param: cantidad * factor
    })

    if (rpcError) throw rpcError

    res.json({ ok: true, message: 'Movimiento registrado correctamente' })
  } catch (error) {
    console.error('Error al registrar movimiento:', error)
    res.status(500).json({ error: 'Error interno al registrar movimiento' })
  }
}

// Obtener historial de movimientos
exports.obtenerMovimientos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*, componente:componentes(nombre)')
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener movimientos:', error)
      return res.status(500).json({ error: 'Error al obtener movimientos' })
    }

    const movimientos = data.map(m => ({
      ...m,
      nombre_componente: m.componente?.nombre || null
    }))

    res.json(movimientos)
  } catch (err) {
    console.error('Error inesperado:', err)
    res.status(500).json({ error: 'Error inesperado al obtener movimientos' })
  }
}

// Movimientos por componente
exports.obtenerMovimientoPorComponente = async (req, res) => {
  const { codigo } = req.params

  if (!codigo) {
    return res.status(400).json({ error: 'Código de componente inválido' })
  }

  try {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*, componente:componentes(nombre)')
      .eq('componente_codigo', codigo)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener movimientos por componente:', error)
      return res.status(500).json({ error: 'Error al obtener movimientos por componente' })
    }

    const movimientos = data.map(m => ({
      ...m,
      nombre_componente: m.componente?.nombre || null
    }))

    res.json(movimientos)
  } catch (err) {
    console.error('Error inesperado:', err)
    res.status(500).json({ error: 'Error inesperado al obtener movimientos por componente' })
  }
}
