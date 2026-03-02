const cotizacionService = require('../services/cotizacion.service');

const getAllCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await cotizacionService.getAll();
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCotizacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await cotizacionService.getById(id);
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCotizacion = async (req, res) => {
  try {
    const usuarioId = req.user.id; // 🔐 desde JWT
    const data = { ...req.body, usuarioId };

    const cotizacion = await cotizacionService.create(data);
    res.status(201).json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cotizacion = await cotizacionService.updateEstado(id, estado);
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });

    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await cotizacionService.remove(id);
    if (!ok) return res.status(404).json({ message: 'Cotización no encontrada' });

    res.json({ message: 'Cotización desactivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCotizaciones,
  getCotizacionById,
  createCotizacion,
  updateEstado,
  deleteCotizacion
};