const supabase = require('../config/supabaseClient')

exports.crearPersona = async (req, res) => {
    const { nombre } = req.body

    if (!nombre ) {
        return res.status(400).json({ error: 'Nombre es requerido' })
    }

    try {
        const { data, error } = await supabase
            .from('personas')
            .insert([{ nombre }])
            .select()

        if (error) {
            console.error('Error al crear persona:', error)
            return res.status(500).json({ error: error.message })
        }

        res.status(201).json(data[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.editarPersona = async (req, res) => {
    const { id } = req.params
    const camposActualizados = req.body

    try {
        const { data, error } = await supabase
            .from('personas')
            .update(camposActualizados)
            .eq('id', id)
            .select()

        if (error) {
            console.error('Error al editar persona:', error)
            return res.status(500).json({ error: error.message })
        }

        res.json(data[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.obtenerPersonas = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('personas')
            .select('*')

        if (error) {
            console.error('Error al obtener personas:', error)
            return res.status(500).json({ error: error.message })
        }

        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.eliminarPersona = async (req, res) => {
    const { id } = req.params

    try {
        const { error } = await supabase
            .from('personas')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error al eliminar persona:', error)
            return res.status(500).json({ error: error.message })
        }

        res.json({ msg: 'Persona eliminada correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}