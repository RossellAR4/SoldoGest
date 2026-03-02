const materialService = require('../services/material.service');

const getAllMateriales = async (req, res) => {
  try {
    const materiales = await materialService.getAllMateriales();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await materialService.getMaterialById(id);
    if (!material) return res.status(404).json({ message: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const material = await materialService.createMaterial(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await materialService.updateMaterial(id, req.body);
    if (!material) return res.status(404).json({ message: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await materialService.deleteMaterial(id);
    if (!success) return res.status(404).json({ message: 'Material no encontrado' });
    res.json({ message: 'Material desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMateriales,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};