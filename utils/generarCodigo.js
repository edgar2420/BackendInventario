const supabase = require('../config/supabaseClient')

const generarCodigo = async (clase_id, tipo_id) => {
  // Obtener nombre de clase y tipo
  const { data: claseData, error: claseError } = await supabase
    .from('clase')
    .select('nombre')
    .eq('id', clase_id)
    .single()

  const { data: tipoData, error: tipoError } = await supabase
    .from('tipo')
    .select('nombre')
    .eq('id', tipo_id)
    .single()

  if (claseError || tipoError || !claseData || !tipoData) {
    throw new Error('Clase o tipo no encontrados')
  }

  const claseAbrev = claseData.nombre.trim().toUpperCase().substring(0, 2)
  const tipoAbrev = tipoData.nombre.trim().toUpperCase().substring(0, 3)
  const prefijo = `${claseAbrev}-${tipoAbrev}`

  const { data, error } = await supabase
    .from('componentes')
    .select('codigo')
    .like('codigo', `${prefijo}-%`)

  if (error) throw new Error('Error al buscar códigos existentes')

  const maxNumero = data.reduce((max, item) => {
    const partes = item.codigo.split('-')
    const num = parseInt(partes[2]) || 0
    return num > max ? num : max
  }, 0)

  const siguiente = String(maxNumero + 1).padStart(3, '0')

  return `${prefijo}-${siguiente}`
}

module.exports = { generarCodigo }
