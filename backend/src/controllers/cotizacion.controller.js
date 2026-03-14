const cotizacionService = require('../services/cotizacion.service');

const getAllCotizaciones = async (req, res) => {
  try {
    const { estado } = req.query;

    const cotizaciones = await cotizacionService.getAll({ estado });

    return res.json(cotizaciones);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener las cotizaciones',
      detalle: error.message
    });
  }
};

const getCotizacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await cotizacionService.getById(id);

    if (!cotizacion) {
      return res.status(404).json({
        message: 'Cotización no encontrada'
      });
    }

    return res.json(cotizacion);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener la cotización',
      detalle: error.message
    });
  }
};

const createCotizacion = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const data = {
      ...req.body,
      usuarioId
    };

    const cotizacion = await cotizacionService.create(data);

    return res.status(201).json(cotizacion);
  } catch (error) {
    return res.status(400).json({
      error: 'No se pudo crear la cotización',
      detalle: error.message
    });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cotizacion = await cotizacionService.updateEstado(id, estado);

    if (!cotizacion) {
      return res.status(404).json({
        message: 'Cotización no encontrada'
      });
    }

    return res.json(cotizacion);
  } catch (error) {
    return res.status(400).json({
      error: 'No se pudo actualizar el estado de la cotización',
      detalle: error.message
    });
  }
};

const deleteCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await cotizacionService.remove(id);

    if (!ok) {
      return res.status(404).json({
        message: 'Cotización no encontrada'
      });
    }

    return res.json({
      message: 'Cotización desactivada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al desactivar la cotización',
      detalle: error.message
    });
  }
};

module.exports = {
  getAllCotizaciones,
  getCotizacionById,
  createCotizacion,
  updateEstado,
  deleteCotizacion
};