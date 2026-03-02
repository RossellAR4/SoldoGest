const trabajoService = require('../services/trabajo.service');

const getAllTrabajos = async (req, res) => {
  try {
    const trabajos = await trabajoService.getAll();
    res.json(trabajos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrabajoById = async (req, res) => {
  try {
    const { id } = req.params;
    const trabajo = await trabajoService.getById(id);
    if (!trabajo) return res.status(404).json({ message: 'Trabajo no encontrado' });
    res.json(trabajo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFromCotizacion = async (req, res) => {
  try {
    const usuarioId = req.user.id; // 🔐 desde JWT
    const { cotizacionId, fecha_estimada_instalacion } = req.body;

    const trabajo = await trabajoService.createFromCotizacion(
      cotizacionId,
      fecha_estimada_instalacion,
      usuarioId
    );

    res.status(201).json(trabajo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createManual = async (req, res) => {
  try {
    const usuarioId = req.user.id; // 🔐 desde JWT
    const data = { ...req.body, usuarioId };

    const trabajo = await trabajoService.createManual(data);
    res.status(201).json(trabajo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const trabajo = await trabajoService.updateEstado(id, estado);
    if (!trabajo) return res.status(404).json({ message: 'Trabajo no encontrado' });

    res.json(trabajo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTrabajo = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await trabajoService.remove(id);
    if (!ok) return res.status(404).json({ message: 'Trabajo no encontrado' });

    res.json({ message: 'Trabajo desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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