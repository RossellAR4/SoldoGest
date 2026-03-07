const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cotizacion = sequelize.define('Cotizacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  mano_obra: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },

  tiempo_estimado: {
    type: DataTypes.INTEGER, // días estimados de trabajo
    allowNull: false
  },

  subtotal_materiales: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    defaultValue: 0
  },

  total: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    defaultValue: 0
  },

  estado: {
    type: DataTypes.ENUM('pendiente','aprobado','cancelado'),
    defaultValue: 'pendiente'
  },

  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  fecha_validez: {
    type: DataTypes.DATE,
    allowNull: false
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  tableName: 'cotizaciones',
  timestamps: true,

  hooks: {

    beforeCreate: (cotizacion) => {

      // fecha de emisión
      const fechaEmision = new Date();

      // fecha de validez = emisión + 15 días
      const fechaValidez = new Date(fechaEmision);
      fechaValidez.setDate(fechaValidez.getDate() + 15);

      cotizacion.fecha_emision = fechaEmision;
      cotizacion.fecha_validez = fechaValidez;
    }

  }

});

module.exports = Cotizacion;