const { Trabajo, Cotizacion, Cliente } = require('../models');
const { sequelize } = require('../config/database');

// =============================
// Obtener todos (solo activos)
// =============================
const getAll = async () => {
  return await Trabajo.findAll({
    where: { activo: true },
    include: [
      { model: Cotizacion },
      { model: Cliente }
    ],
    order: [['id', 'DESC']]
  });
};

// =============================
// Obtener por ID (activo)
// =============================
const getById = async (id) => {
  return await Trabajo.findOne({
    where: { id, activo: true },
    include: [
      { model: Cotizacion },
      { model: Cliente }
    ]
  });
};

// =============================
// Crear trabajo desde cotización aprobada
// usuarioId viene del JWT (controller)
// =============================
const createFromCotizacion = async (cotizacionId, fecha_estimada_instalacion, usuarioId) => {
  const transaction = await sequelize.transaction();

  try {
    const cotizacion = await Cotizacion.findOne({
      where: { id: cotizacionId, activo: true },
      transaction
    });

    if (!cotizacion) throw new Error('Cotización no existe');
    if (cotizacion.estado !== 'aprobado') throw new Error('La cotización debe estar aprobada');

    const trabajo = await Trabajo.create(
      {
        clienteId: cotizacion.clienteId,
        cotizacionId: cotizacion.id,
        usuarioId,
        descripcion: cotizacion.descripcion,
        fecha_inicio: new Date(),
        fecha_estimada_instalacion,
        fecha_finalizacion: null,
        estado: 'en_proceso',
        total: cotizacion.total,
        activo: true
      },
      { transaction }
    );

    await transaction.commit();
    return await getById(trabajo.id);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// =============================
// Crear trabajo manual (sin cotización)
// usuarioId viene del JWT (controller)
// =============================
const createManual = async (data) => {
  const {
    clienteId,
    usuarioId,
    descripcion,
    fecha_estimada_instalacion,
    total
  } = data;

  return await Trabajo.create({
    clienteId,
    usuarioId,
    cotizacionId: null,
    descripcion,
    fecha_inicio: new Date(),
    fecha_estimada_instalacion,
    fecha_finalizacion: null,
    estado: 'en_proceso',
    total,
    activo: true
  });
};

// =============================
// Actualizar estado
// =============================
const updateEstado = async (id, estado) => {
  const trabajo = await Trabajo.findOne({ where: { id, activo: true } });
  if (!trabajo) return null;

  return await trabajo.update({ estado });
};

// =============================
// Soft delete
// =============================
const remove = async (id) => {
  const trabajo = await Trabajo.findOne({ where: { id, activo: true } });
  if (!trabajo) return false;

  await trabajo.update({ activo: false });
  return true;
};

module.exports = {
  getAll,
  getById,
  createFromCotizacion,
  createManual,
  updateEstado,
  remove
};