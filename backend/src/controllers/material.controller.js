const materialService = require('../services/material.service');

const getAllMateriales = async (req, res) => {
  try {
    const materiales = await materialService.getAllMateriales();
    return res.json(materiales);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los materiales',
      detalle: error.message
    });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await materialService.getMaterialById(id);

    if (!material) {
      return res.status(404).json({
        message: 'Material no encontrado'
      });
    }

    return res.json(material);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener el material',
      detalle: error.message
    });
  }
};

const createMaterial = async (req, res) => {
  try {
    const existe = await materialService.findOneByNombre(req.body.nombre);

    if (existe) {
      return res.status(400).json({
        message: 'Ya existe un material activo con ese nombre'
      });
    }

    const material = await materialService.createMaterial(req.body);

    return res.status(201).json(material);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al crear el material',
      detalle: error.message
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await materialService.updateMaterial(id, req.body);

    if (!material) {
      return res.status(404).json({
        message: 'Material no encontrado'
      });
    }

    return res.json(material);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al actualizar el material',
      detalle: error.message
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await materialService.deleteMaterial(id);

    if (!success) {
      return res.status(404).json({
        message: 'Material no encontrado'
      });
    }

    return res.json({
      message: 'Material desactivado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al desactivar el material',
      detalle: error.message
    });
  }
};

module.exports = {
  getAllMateriales,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};