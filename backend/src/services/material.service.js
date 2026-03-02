const { Material } = require('../models');

const getAllMateriales = async () => {
  return await Material.findAll({
    where: { activo: true }
  });
};

const getMaterialById = async (id) => {
  return await Material.findByPk(id, { where: { activo: true } });
};

const findOneByNombre = async (nombre) => {
  return await Material.findOne({ where: { nombre } });
};

const createMaterial = async (data) => {
  return await Material.create(data);
};

const updateMaterial = async (id, data) => {
  const material = await Material.findByPk(id);
  if (!material) return null;

  return await material.update(data);
};

const deleteMaterial = async (id) => {
  const material = await Material.findByPk(id);
  if (!material) return false;

  material.activo = false;
  await material.save();
  return true;
};

module.exports = {
  getAllMateriales,
  getMaterialById,
  findOneByNombre,
  createMaterial,
  updateMaterial,
  deleteMaterial
};