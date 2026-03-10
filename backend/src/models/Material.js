const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },

  categoria: {
    type: DataTypes.ENUM(
      'perfil_estructural',
      'lamina',
      'consumible',
      'acabado',
      'accesorio',
      'otro'
    ),
    allowNull: false,
    defaultValue: 'otro'
  },

  tipo: {
    type: DataTypes.STRING(60),
    allowNull: false
  },

  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  stock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },

  unidad_medida: {
    type: DataTypes.ENUM(
      'unidad',
      'metro',
      'pie',
      'libra',
      'kilogramo',
      'galon',
      'litro',
      'paquete'
    ),
    allowNull: false
  },

  largo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  ancho: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  alto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  grosor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  diametro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
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