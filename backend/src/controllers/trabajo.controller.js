const trabajoService = require('../services/trabajo.service');

const getAllTrabajos = async (req, res) => {
  try {
    const trabajos = await trabajoService.getAll();
    return res.json(trabajos);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los trabajos',
      detalle: error.message
    });
  }
};

const getTrabajoById = async (req, res) => {
  try {
    const { id } = req.params;
    const trabajo = await trabajoService.getById(id);

    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    return res.json(trabajo);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener el trabajo',
      detalle: error.message
    });
  }
};

const createFromCotizacion = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { cotizacionId, fecha_estimada_instalacion } = req.body;

    const trabajo = await trabajoService.createFromCotizacion(
      cotizacionId,
      fecha_estimada_instalacion,
      usuarioId
    );

    return res.status(201).json(trabajo);
  } catch (error) {
    return res.status(400).json({
      error: 'No se pudo crear el trabajo desde la cotización',
      detalle: error.message
    });
  }
};

const createManual = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const data = {
      ...req.body,
      usuarioId
    };

    const trabajo = await trabajoService.createManual(data);

    return res.status(201).json(trabajo);
  } catch (error) {
    return res.status(400).json({
      error: 'No se pudo crear el trabajo manual',
      detalle: error.message
    });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const trabajo = await trabajoService.updateEstado(id, estado);

    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    return res.json(trabajo);
  } catch (error) {
    return res.status(400).json({
      error: 'No se pudo actualizar el estado del trabajo',
      detalle: error.message
    });
  }
};

const deleteTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await trabajoService.remove(id);

    if (!ok) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    return res.json({ message: 'Trabajo desactivado correctamente' });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al desactivar el trabajo',
      detalle: error.message
    });
  }
};

module.exports = {
  getAllTrabajos,
  getTrabajoById,
  createFromCotizacion,
  createManual,
  updateEstado,
  deleteTrabajo
};