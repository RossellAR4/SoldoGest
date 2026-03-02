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
    type: DataTypes.INTEGER, // en días
    allowNull: false
  },
  subtotal_materiales: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente','aprobado','cancelado'),
    defaultValue: 'pendiente'
  },
  fecha_emision: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_validez: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cotizaciones',
  timestamps: true
});

module.exports = Cotizacion;