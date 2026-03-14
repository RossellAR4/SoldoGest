const {
  Cotizacion,
  CotizacionMaterial,
  Material,
  Cliente
} = require('../models');

const { sequelize } = require('../config/database');

const getAll = async (filters = {}) => {
  const where = { activo: true };

  if (filters.estado) {
    where.estado = filters.estado;
  }

  return await Cotizacion.findAll({
    where,
    include: [
      {
        model: Material,
        through: { attributes: ['cantidad', 'precio_unitario', 'subtotal'] }
      },
      {
        model: Cliente
      }
    ],
    order: [['id', 'DESC']]
  });
};

const getById = async (id) => {
  return await Cotizacion.findOne({
    where: { id, activo: true },
    include: [
      {
        model: Material,
        through: { attributes: ['cantidad', 'precio_unitario', 'subtotal'] }
      },
      {
        model: Cliente
      }
    ]
  });
};

const create = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      clienteId,
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      tipo_trabajo,
      usuarioId,
      descripcion,
      materiales,
      mano_obra,
      tiempo_estimado
    } = data;

    let subtotal_materiales = 0;
    let clienteIdFinal = null;
    let nombreFinal = '';
    let telefonoFinal = null;
    let emailFinal = null;

    if (clienteId) {
      const cliente = await Cliente.findOne({
        where: { id: clienteId, activo: true },
        transaction
      });

      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      clienteIdFinal = cliente.id;
      nombreFinal = cliente.nombre;
      telefonoFinal = cliente.telefono || null;
      emailFinal = cliente.email || null;
    } else {
      if (!cliente_nombre || !cliente_nombre.trim()) {
        throw new Error('Debe indicar el nombre del cliente');
      }

      nombreFinal = cliente_nombre.trim();
      telefonoFinal = cliente_telefono || null;
      emailFinal = cliente_email || null;
    }

    const nuevaCotizacion = await Cotizacion.create({
      clienteId: clienteIdFinal,
      usuarioId,
      cliente_nombre: nombreFinal,
      cliente_telefono: telefonoFinal,
      cliente_email: emailFinal,
      tipo_trabajo: tipo_trabajo || null,
      descripcion,
      mano_obra,
      tiempo_estimado,
      subtotal_materiales: 0,
      total: 0,
      estado: 'pendiente',
      activo: true
    }, { transaction });

    for (const item of materiales) {
      const material = await Material.findOne({
        where: { id: item.materialId, activo: true },
        transaction
      });

      if (!material) {
        throw new Error(`Material no encontrado: ${item.materialId}`);
      }

      const precio = parseFloat(material.precio_unitario);
      const cantidad = parseFloat(item.cantidad);
      const subtotal = precio * cantidad;

      subtotal_materiales += subtotal;

      await CotizacionMaterial.create({
        cotizacionId: nuevaCotizacion.id,
        materialId: material.id,
        cantidad,
        precio_unitario: precio,
        subtotal
      }, { transaction });
    }

    const total = subtotal_materiales + parseFloat(mano_obra);

    await nuevaCotizacion.update({
      subtotal_materiales,
      total
    }, { transaction });

    await transaction.commit();

    return await getById(nuevaCotizacion.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateEstado = async (id, estado) => {
  const cotizacion = await Cotizacion.findOne({
    where: { id, activo: true }
  });

  if (!cotizacion) return null;

  if (estado === 'aprobado') {
    const hoy = new Date();
    const fechaValidez = new Date(cotizacion.fecha_validez);

    if (hoy > fechaValidez) {
      throw new Error('La cotización está vencida y no puede aprobarse');
    }
  }

  return await cotizacion.update({ estado });
};

const remove = async (id) => {
  const cotizacion = await Cotizacion.findOne({
    where: { id, activo: true }
  });

  if (!cotizacion) return false;

  await cotizacion.update({ activo: false });
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  updateEstado,
  remove
};