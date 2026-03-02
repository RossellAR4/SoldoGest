const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20)
  },
  direccion: {
    type: DataTypes.STRING(255)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  activo: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
}
}, {
  tableName: 'clientes',
  timestamps: true
});

module.exports = Cliente;