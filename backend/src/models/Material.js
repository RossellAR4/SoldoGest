const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('varilla','tubo_cuadrado','tubo_redondo','lamina','otro'),
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  stock: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },
  longitud: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  ancho: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  alto: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  grosor: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  unidad_medida: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  activo: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
}
}, {
  tableName: 'materiales',
  timestamps: true
});

module.exports = Material;