const { Material } = require('../models');

const getAllMateriales = async () => {
  return await Material.findAll({
    where: { activo: true },
    order: [['id', 'DESC']]
  });
};

const getMaterialById = async (id) => {
  return await Material.findOne({
    where: { id, activo: true }
  });
};

const findOneByNombre = async (nombre) => {
  return await Material.findOne({
    where: { nombre, activo: true }
  });
};

const createMaterial = async (data) => {
  return await Material.create({
    nombre: data.nombre,
    categoria: data.categoria,
    tipo: data.tipo,
    precio_unitario: data.precio_unitario,
    stock: data.stock ?? 0,
    unidad_medida: data.unidad_medida,
    largo: data.largo ?? null,
    ancho: data.ancho ?? null,
    alto: data.alto ?? null,
    grosor: data.grosor ?? null,
    diametro: data.diametro ?? null,
    descripcion: data.descripcion ?? null,
    activo: true
  });
};

const updateMaterial = async (id, data) => {
  const material = await Material.findOne({
    where: { id, activo: true }
  });

  if (!material) return null;

  return await material.update({
    nombre: data.nombre ?? material.nombre,
    categoria: data.categoria ?? material.categoria,
    tipo: data.tipo ?? material.tipo,
    precio_unitario: data.precio_unitario ?? material.precio_unitario,
    stock: data.stock ?? material.stock,
    unidad_medida: data.unidad_medida ?? material.unidad_medida,
    largo: data.largo !== undefined ? data.largo : material.largo,
    ancho: data.ancho !== undefined ? data.ancho : material.ancho,
    alto: data.alto !== undefined ? data.alto : material.alto,
    grosor: data.grosor !== undefined ? data.grosor : material.grosor,
    diametro: data.diametro !== undefined ? data.diametro : material.diametro,
    descripcion: data.descripcion !== undefined ? data.descripcion : material.descripcion
  });
};

const deleteMaterial = async (id) => {
  const material = await Material.findOne({
    where: { id, activo: true }
  });

  if (!material) return false;

  await material.update({ activo: false });
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