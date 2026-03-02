const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CotizacionMaterial = sequelize.define('CotizacionMaterial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cotizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  }
}, {
  tableName: 'cotizacion_materiales',
  timestamps: false
});

module.exports = CotizacionMaterial;