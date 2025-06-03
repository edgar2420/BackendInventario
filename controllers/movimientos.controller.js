const supabase = require('../config/supabaseClient')

// Crear un nuevo movimiento (entrada o salida)
exports.crearMovimiento = async (req, res) => {
  const {
    componente_codigo = '',
    tipo = '',
    cantidad,
    persona_id,
    unidad_proceso_id,
    orden_tipo = '',
    orden_numero = '',
    motivo = ''
  } = req.body

  if (
    !componente_codigo.trim() ||
    !tipo.trim() ||
    !cantidad ||
    isNaN(cantidad) ||
    Number(cantidad) <= 0
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' })
  }

  const tipoMov = tipo.toLowerCase()
  if (!['entrada', 'salida'].includes(tipoMov)) {
    return res.status(400).json({ error: 'Tipo de movimiento inválido' })
  }

  if (tipoMov === 'entrada' && !persona_id) {
    return res.status(400).json({ error: 'Debe indicar persona que entrega' })
  }
  if (tipoMov === 'salida') {
    if (!persona_id || !unidad_proceso_id || !orden_tipo || !orden_numero) {
      return res.status(400).json({ error: 'Faltan datos requeridos para salida' })
    }
    if (!['OTP', 'OTN'].includes(orden_tipo)) {
      return res.status(400).json({ error: 'Tipo de orden de trabajo inválido' })
    }
  }

  try {
    const movimiento = {
      componente_codigo: componente_codigo.trim(),
      tipo: tipoMov,
      cantidad: Number(cantidad),
      observaciones: motivo.trim(),
      persona_entrega_id: tipoMov === 'entrada' ? persona_id : null,
      persona_responsable_id: tipoMov === 'salida' ? persona_id : null,
      unidad_proceso_id: tipoMov === 'salida' ? unidad_proceso_id : null,
      orden_trabajo: tipoMov === 'salida' ? `${orden_tipo}-${orden_numero}` : null
    }

    const { error: insertError } = await supabase
      .from('movimientos')
      .insert([movimiento])

    if (insertError) throw insertError

    const factor = tipoMov === 'entrada' ? 1 : -1
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

// Obtener todos los movimientos
exports.obtenerMovimientos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movimientos')
      .select(`
        *,
        componente:componentes(nombre),
        responsable:personas!persona_responsable_id(nombre),
        entrega:personas!persona_entrega_id(nombre),
        unidad:unidad_proceso(nombre)
      `)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener movimientos:', error)
      return res.status(500).json({ error: 'Error al obtener movimientos' })
    }

    const movimientos = data.map(m => ({
      ...m,
      nombre_componente: m.componente?.nombre || null,
      persona_responsable: m.responsable?.nombre || null,
      persona_entrega: m.entrega?.nombre || null,
      unidad_proceso: m.unidad?.nombre || null
    }))

    res.json(movimientos)
  } catch (err) {
    console.error('Error inesperado:', err)
    res.status(500).json({ error: 'Error inesperado al obtener movimientos' })
  }
}

// Obtener movimientos por componente
exports.obtenerMovimientoPorComponente = async (req, res) => {
  const { codigo } = req.params

  if (!codigo) {
    return res.status(400).json({ error: 'Código de componente inválido' })
  }

  try {
    const { data, error } = await supabase
      .from('movimientos')
      .select(`
        *,
        componente:componentes(nombre),
        responsable:personas!persona_responsable_id(nombre),
        entrega:personas!persona_entrega_id(nombre),
        unidad:unidad_proceso(nombre)
      `)
      .eq('componente_codigo', codigo)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener movimientos por componente:', error)
      return res.status(500).json({ error: 'Error al obtener movimientos por componente' })
    }

    const movimientos = data.map(m => ({
      ...m,
      nombre_componente: m.componente?.nombre || null,
      persona_responsable: m.responsable?.nombre || null,
      persona_entrega: m.entrega?.nombre || null,
      unidad_proceso: m.unidad?.nombre || null
    }))

    res.json(movimientos)
  } catch (err) {
    console.error('Error inesperado:', err)
    res.status(500).json({ error: 'Error inesperado al obtener movimientos por componente' })
  }
}
