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

// =============================
const createFromCotizacion = async (cotizacionId, fecha_estimada_instalacion, usuarioId) => {
  const transaction = await sequelize.transaction();

  try {
    const cotizacion = await Cotizacion.findOne({
      where: { id: cotizacionId, activo: true },
      transaction
    });

    if (!cotizacion) {
      throw new Error('Cotización no existe');
    }

    if (cotizacion.estado !== 'aprobado') {
      throw new Error('La cotización debe estar aprobada');
    }

    const trabajoExistente = await Trabajo.findOne({
      where: {
        cotizacionId: cotizacion.id,
        activo: true
      },
      transaction
    });

    if (trabajoExistente) {
      throw new Error('Ya existe un trabajo activo para esta cotización');
    }

    let clienteIdFinal = cotizacion.clienteId;

    if (!clienteIdFinal) {
      const nuevoCliente = await Cliente.create({
        nombre: cotizacion.cliente_nombre,
        telefono: cotizacion.cliente_telefono || null,
        email: cotizacion.cliente_email || null,
        direccion: null,
        activo: true
      }, { transaction });

      clienteIdFinal = nuevoCliente.id;

      
      await cotizacion.update({
        clienteId: clienteIdFinal
      }, { transaction });
    }

    const trabajo = await Trabajo.create({
      clienteId: clienteIdFinal,
      cotizacionId: cotizacion.id,
      usuarioId,
      descripcion: cotizacion.descripcion,
      fecha_inicio: new Date(),
      fecha_estimada_instalacion,
      fecha_finalizacion: null,
      estado: 'en_proceso',
      total: cotizacion.total,
      activo: true
    }, { transaction });

    await transaction.commit();

    return await getById(trabajo.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// =============================
// Crear trabajo manual
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
  const trabajo = await Trabajo.findOne({
    where: { id, activo: true }
  });

  if (!trabajo) return null;

  const data = { estado };

  if (estado === 'finalizado') {
    data.fecha_finalizacion = new Date();
  }

  if (estado === 'en_proceso') {
    data.fecha_finalizacion = null;
  }

  return await trabajo.update(data);
};

// =============================
// Soft delete
// =============================
const remove = async (id) => {
  const trabajo = await Trabajo.findOne({
    where: { id, activo: true }
  });

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