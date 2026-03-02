const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const Material = require('./Material');
const Cotizacion = require('./Cotizacion');
const CotizacionMaterial = require('./CotizacionMaterial');
const Trabajo = require('./Trabajo');

/* ======================
   RELACIONES USUARIO
====================== */

Usuario.hasMany(Cotizacion, { foreignKey: 'usuarioId' });
Cotizacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Trabajo, { foreignKey: 'usuarioId' });
Trabajo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

/* ======================
   RELACIONES CLIENTE
====================== */

Cliente.hasMany(Cotizacion, { foreignKey: 'clienteId' });
Cotizacion.belongsTo(Cliente, { foreignKey: 'clienteId' });

Cliente.hasMany(Trabajo, { foreignKey: 'clienteId' });
Trabajo.belongsTo(Cliente, { foreignKey: 'clienteId' });

/* ======================
   COTIZACION - MATERIAL (N:M)
====================== */

Cotizacion.belongsToMany(Material, {
  through: CotizacionMaterial,
  foreignKey: 'cotizacionId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Material.belongsToMany(Cotizacion, {
  through: CotizacionMaterial,
  foreignKey: 'materialId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/* ======================
   COTIZACION → TRABAJO
====================== */

Cotizacion.hasOne(Trabajo, { foreignKey: 'cotizacionId' });
Trabajo.belongsTo(Cotizacion, { foreignKey: 'cotizacionId' });

module.exports = {
  Usuario,
  Cliente,
  Material,
  Cotizacion,
  CotizacionMaterial,
  Trabajo
};