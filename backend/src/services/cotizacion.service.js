const {
  Cotizacion,
  CotizacionMaterial,
  Material
} = require('../models');

const { sequelize } = require('../config/database');

// =============================
// Obtener todas (solo activas)
// =============================
const getAll = async () => {
  return await Cotizacion.findAll({
    where: { activo: true },
    include: [
      {
        model: Material,
        through: { attributes: ['cantidad', 'precio_unitario', 'subtotal'] }
      }
    ],
    order: [['id', 'DESC']]
  });
};

// =============================
// Obtener por ID (activa)
// =============================
const getById = async (id) => {
  return await Cotizacion.findOne({
    where: { id, activo: true },
    include: [
      {
        model: Material,
        through: { attributes: ['cantidad', 'precio_unitario', 'subtotal'] }
      }
    ]
  });
};

// =============================
// Crear cotización con materiales
// usuarioId viene del JWT (controller)
// =============================
const create = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      clienteId,
      usuarioId,
      descripcion,
      materiales, // [{ materialId, cantidad }]
      mano_obra,
      tiempo_estimado,
      fecha_validez
    } = data;

    let subtotal_materiales = 0;

    // 1) Crear cotización base
    const nuevaCotizacion = await Cotizacion.create(
      {
        clienteId,
        usuarioId,
        descripcion,
        mano_obra,
        tiempo_estimado,
        subtotal_materiales: 0,
        total: 0,
        estado: 'pendiente',
        fecha_emision: new Date(),
        fecha_validez: fecha_validez || null,
        activo: true
      },
      { transaction }
    );

    // 2) Insertar materiales en tabla intermedia
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

      await CotizacionMaterial.create(
        {
          cotizacionId: nuevaCotizacion.id,
          materialId: material.id,
          cantidad,
          precio_unitario: precio,
          subtotal
        },
        { transaction }
      );
    }

    // 3) Actualizar totales
    const total = subtotal_materiales + parseFloat(mano_obra);

    await nuevaCotizacion.update(
      { subtotal_materiales, total },
      { transaction }
    );

    await transaction.commit();

    // 4) Retornar cotización completa
    return await getById(nuevaCotizacion.id);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// =============================
// Actualizar estado
// =============================
const updateEstado = async (id, estado) => {
  const cotizacion = await Cotizacion.findOne({ where: { id, activo: true } });
  if (!cotizacion) return null;

  return await cotizacion.update({ estado });
};

// =============================
// Soft delete
// =============================
const remove = async (id) => {
  const cotizacion = await Cotizacion.findOne({ where: { id, activo: true } });
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