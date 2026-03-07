<script setup>
definePageMeta({
  middleware: 'auth'
})

const accesos = [
  {
    title: 'Clientes',
    subtitle: 'Registrar y listar clientes',
    to: '/clientes'
  },
  {
    title: 'Materiales',
    subtitle: 'Inventario y medidas',
    to: '/materiales'
  },
  {
    title: 'Cotizaciones',
    subtitle: 'Crear y aprobar',
    to: '/cotizaciones'
  },
  {
    title: 'Trabajos',
    subtitle: 'Seguimiento de proyectos',
    to: '/trabajos'
  }
]
</script>

<template>
  <div class="dashboard-page">
    <h2 class="section-title">Accesos rápidos</h2>

    <div class="cards-grid">
      <QuickAccessCard
        v-for="item in accesos"
        :key="item.title"
        :title="item.title"
        :subtitle="item.subtitle"
        :to="item.to"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  color: white;
}

.section-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 22px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 18px;
}

@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 680px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>