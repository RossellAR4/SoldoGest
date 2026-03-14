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
    allowNull: true
  },

  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  cliente_nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },

  cliente_telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  },

  cliente_email: {
    type: DataTypes.STRING(120),
    allowNull: true
  },

  tipo_trabajo: {
    type: DataTypes.STRING(60),
    allowNull: true
  },

  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  mano_obra: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },

  tiempo_estimado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  subtotal_materiales: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },

  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },

  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'cancelado', 'vencido'),
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
    beforeValidate: (cotizacion) => {
      const fechaEmision = cotizacion.fecha_emision
        ? new Date(cotizacion.fecha_emision)
        : new Date();

      const fechaValidez = new Date(fechaEmision);
      fechaValidez.setDate(fechaValidez.getDate() + 15);

      cotizacion.fecha_emision = fechaEmision;
      cotizacion.fecha_validez = fechaValidez;
    }
  }
});

module.exports = Cotizacion;