const { Cliente } = require('../models');

const getAllClientes = async () => {
  return await Cliente.findAll({
    where: { activo: true }
  });
};

const getClienteById = async (id) => {
  return await Cliente.findByPk(id, { where: { activo: true } });
};

const createCliente = async (data) => {
  return await Cliente.create(data);
};

const updateCliente = async (id, data) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return null;

  return await cliente.update(data);
};

const deleteCliente = async (id) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) return false;

  cliente.activo = false;
  await cliente.save();
  return true;
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};