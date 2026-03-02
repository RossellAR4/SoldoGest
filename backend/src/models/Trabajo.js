const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trabajo = sequelize.define('Trabajo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cotizacionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_estimada_instalacion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_finalizacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('en_proceso','finalizado','cancelado'),
    defaultValue: 'en_proceso'
  },
  total: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  }
}, {
  tableName: 'trabajos',
  timestamps: true
});

module.exports = Trabajo;