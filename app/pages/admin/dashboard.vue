<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      
      <!-- Title and description -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 30px; flex-wrap:wrap; gap:10px;">
        <div>
          <h1 style="font-size: 1.8rem; font-weight: bold; margin: 0; color: var(--text-secondary);">Dashboard Statistik</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 0.95rem;">Ringkasan data pesanan masuk dan pemantauan proyek secara langsung.</p>
        </div>
        <button @click="fetchOrders" class="btn-refresh-dashboard">
          <i class="fas fa-sync"></i> Refresh Data
        </button>
      </div>

      <!-- Stats Cards Grid -->
      <div class="stats-cards-grid">
        <div class="stat-card-widget gray-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL PESANAN</span>
            <span class="stat-widget-val">{{ statTotal }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
        </div>

        <div class="stat-card-widget purple-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">PESANAN BARU</span>
            <span class="stat-widget-val">{{ statNewOrders }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-bell"></i>
          </div>
        </div>

        <div class="stat-card-widget yellow-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">PENDING</span>
            <span class="stat-widget-val">{{ statTerlapor }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-clock"></i>
          </div>
        </div>

        <div class="stat-card-widget blue-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">IN PROGRESS</span>
            <span class="stat-widget-val">{{ statDiproses }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
        </div>

        <div class="stat-card-widget green-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">SELESAI</span>
            <span class="stat-widget-val">{{ statSelesai }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>

        <div class="stat-card-widget red-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">BELUM LUNAS</span>
            <span class="stat-widget-val">{{ statDitolak }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Charts & Guideline -->
      <div class="dashboard-columns">
        <!-- Left Side: Charts -->
        <div class="dashboard-col-left">
          <div class="dashboard-card">
            <h3 class="dashboard-card-title"><i class="fas fa-chart-bar" style="color: #9f7615;"></i> Grafik & Diagram Pesanan</h3>
            
            <div class="charts-container">
              <!-- Bar Chart: Tren Pesanan Bulanan (6 Bulan Terakhir) -->
              <div class="chart-box">
                <h4 class="chart-subtitle">Tren Pesanan Bulanan (6 Bulan Terakhir)</h4>
                <div class="bar-chart">
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" style="height: 0%;"></div>
                    </div>
                    <span class="bar-label">Feb 26</span>
                  </div>
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" style="height: 0%;"></div>
                    </div>
                    <span class="bar-label">Mar 26</span>
                  </div>
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" style="height: 0%;"></div>
                    </div>
                    <span class="bar-label">Apr 26</span>
                  </div>
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" style="height: 0%;"></div>
                    </div>
                    <span class="bar-label">Mei 26</span>
                  </div>
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" style="height: 0%;"></div>
                    </div>
                    <span class="bar-label">Jun 26</span>
                  </div>
                  <div class="bar-item">
                    <div class="bar-fill-wrapper">
                      <div class="bar-fill" :style="{ height: statTotal > 0 ? '100%' : '0%' }">
                        <span class="bar-value-tooltip" v-if="statTotal > 0">{{ statTotal }}</span>
                      </div>
                    </div>
                    <span class="bar-label">Jul 26</span>
                  </div>
                </div>
              </div>

              <!-- Donut Chart: Distribusi Status Pesanan -->
              <div class="chart-box" style="text-align: center;">
                <h4 class="chart-subtitle">Distribusi Status Pesanan</h4>
                <div class="donut-chart-wrapper">
                  <svg width="150" height="150" viewBox="0 0 42 42" class="donut-chart-svg">
                    <!-- Background circle -->
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" stroke-width="4"></circle>
                    
                    <!-- Green slice (Selesai) -->
                    <circle cx="21" cy="21" r="15.915" fill="transparent" 
                      stroke="#10b981" stroke-width="4" 
                      :stroke-dasharray="donutSelesaiDasharray" 
                      stroke-dashoffset="100"></circle>
                    
                    <!-- Blue slice (Diproses) -->
                    <circle cx="21" cy="21" r="15.915" fill="transparent" 
                      stroke="#3b82f6" stroke-width="4" 
                      :stroke-dasharray="donutDiprosesDasharray" 
                      :stroke-dashoffset="donutDiprosesDashoffset"></circle>
                      
                    <!-- Yellow slice (Terlapor) -->
                    <circle cx="21" cy="21" r="15.915" fill="transparent" 
                      stroke="#f59e0b" stroke-width="4" 
                      :stroke-dasharray="donutTerlaporDasharray" 
                      :stroke-dashoffset="donutTerlaporDashoffset"></circle>

                    <!-- Red slice (Ditolak) -->
                    <circle cx="21" cy="21" r="15.915" fill="transparent" 
                      stroke="#ef4444" stroke-width="4" 
                      :stroke-dasharray="donutDitolakDasharray" 
                      :stroke-dashoffset="donutDitolakDashoffset"></circle>
                  </svg>
                  <div class="donut-center-label">
                    <span class="donut-center-val">{{ statTotal }}</span>
                    <span class="donut-center-txt">TOTAL PESANAN</span>
                  </div>
                </div>

                <!-- Legend labels list -->
                <div class="donut-legend">
                  <div class="legend-item">
                    <span class="legend-color-dot" style="background-color: #10b981;"></span>
                    <span class="legend-text">Selesai: {{ statSelesai }} ({{ Math.round(statSelesaiPercent) }}%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color-dot" style="background-color: #3b82f6;"></span>
                    <span class="legend-text">In Progress: {{ statDiproses }} ({{ Math.round(statDiprosesPercent) }}%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color-dot" style="background-color: #f59e0b;"></span>
                    <span class="legend-text">Pending: {{ statTerlapor }} ({{ Math.round(statTerlaporPercent) }}%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color-dot" style="background-color: #ef4444;"></span>
                    <span class="legend-text">Belum Lunas: {{ statDitolak }} ({{ Math.round(statDitolakPercent) }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Category and Guide -->
        <div class="dashboard-col-right">
          <!-- Kategori Proyek Progress Bars -->
          <div class="dashboard-card" style="margin-bottom: 24px;">
            <h3 class="dashboard-card-title"><i class="fas fa-tags" style="color: #f59e0b;"></i> Kategori Proyek Terlaris</h3>
            <div class="categories-list">
              <div v-for="cat in topCategories" :key="cat.name" class="category-progress-item">
                <div class="category-meta">
                  <span class="cat-name">{{ cat.name }}</span>
                  <span class="cat-count">{{ cat.count }}</span>
                </div>
                <div class="cat-bar-wrapper">
                  <div class="cat-bar-fill" :style="{ width: cat.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Guide Card -->
          <div class="guide-card-widget">
            <h3 class="guide-title">PANDUAN PENGELOLAAN PESANAN</h3>
            <ul class="guide-list">
              <li>Lakukan verifikasi pembayaran DP 50% atau pelunasan dari klien.</li>
              <li>Segera hubungi nomor WhatsApp klien untuk mendiskusikan detail brief desain.</li>
              <li>Kirimkan draft preview berkala dan pastikan revisi tercatat dengan baik sebelum finalisasi.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/shop" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.7rem;">
          <i class="fas fa-external-link-alt"></i> Back to Public Site
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'admin'
})

const orders = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const statTotal = computed(() => orders.value.length)
const statUnpaid = computed(() => orders.value.filter(o => o.payment_status === 'unpaid').length)
const statPaid = computed(() => orders.value.filter(o => o.payment_status === 'paid').length)
const statCompleted = computed(() => orders.value.filter(o => o.status === 'completed').length)

// Advanced stats for the dashboard tab (Freelance design terminology mapping)
const statTerlapor = computed(() => orders.value.filter(o => o.status === 'pending').length)
const statDiproses = computed(() => orders.value.filter(o => o.status === 'in-progress').length)
const statSelesai = computed(() => orders.value.filter(o => o.status === 'completed').length)
const statDitolak = computed(() => orders.value.filter(o => o.payment_status === 'unpaid').length) // Map final card/donut slice to Unpaid

const statNewOrders = computed(() => {
  // Count orders received in the last 24 hours (or today)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return orders.value.filter(o => new Date(o.created_at) >= oneDayAgo).length
})

const statSelesaiPercent = computed(() => statTotal.value > 0 ? (statSelesai.value / statTotal.value) * 100 : 0)
const statDiprosesPercent = computed(() => statTotal.value > 0 ? (statDiproses.value / statTotal.value) * 100 : 0)
const statTerlaporPercent = computed(() => statTotal.value > 0 ? (statTerlapor.value / statTotal.value) * 100 : 0)
const statDitolakPercent = computed(() => statTotal.value > 0 ? (statDitolak.value / statTotal.value) * 100 : 0)

const donutSelesaiDasharray = computed(() => `${statSelesaiPercent.value} 100`)
const donutDiprosesDasharray = computed(() => `${statDiprosesPercent.value} 100`)
const donutTerlaporDasharray = computed(() => `${statTerlaporPercent.value} 100`)
const donutDitolakDasharray = computed(() => `${statDitolakPercent.value} 100`)

const donutDiprosesDashoffset = computed(() => 100 - statSelesaiPercent.value)
const donutTerlaporDashoffset = computed(() => 100 - statSelesaiPercent.value - statDiprosesPercent.value)
const donutDitolakDashoffset = computed(() => 100 - statSelesaiPercent.value - statDiprosesPercent.value - statTerlaporPercent.value)

// Dynamic top categories count from client orders
const topCategories = computed(() => {
  const counts = {}
  orders.value.forEach(order => {
    if (order.order_type) {
      const types = order.order_type.split(',').map(t => t.trim())
      types.forEach(t => {
        if (t) {
          counts[t] = (counts[t] || 0) + 1
        }
      })
    }
  })
  const sorted = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percent: statTotal.value > 0 ? (count / statTotal.value) * 100 : 0
  })).sort((a, b) => b.count - a.count)
  
  if (sorted.length === 0) {
    return [
      { name: 'Desain Logo', count: 0, percent: 0 },
      { name: 'Feed Instagram', count: 0, percent: 0 },
      { name: 'Desain Kaos', count: 0, percent: 0 }
    ]
  }
  return sorted.slice(0, 3)
})

// Shared state from layout Header refresh trigger
const refreshTrigger = useState('admin-refresh-trigger', () => 0)

watch(refreshTrigger, () => {
  fetchOrders()
})

const fetchOrders = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    orders.value = data || []
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await fetchOrders()
    }
  }
})
</script>

<style scoped>
/* Scoped styles kept here for the charts layout, stats grid, and guide cards */
/* Stats Cards Grid */
.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 640px) {
  .stats-cards-grid {
    gap: 10px;
  }
}

.stat-card-widget {
  /* background: #ffffff; */
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

@media (max-width: 640px) {
  .stat-card-widget {
    padding: 12px 10px;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 6px;
  }
  .stat-widget-val {
    font-size: 1.3rem !important;
  }
  .stat-widget-label {
    font-size: 0.6rem !important;
  }
  .stat-widget-icon {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.95rem !important;
  }
}

body.dark-mode .stat-card-widget {
  /* background: #111827; */
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.stat-card-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
}

.stat-widget-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-widget-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.stat-widget-val {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
}

body.dark-mode .stat-widget-val {
  color: #ffffff;
}

.stat-widget-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

/* Card Themes */
.gray-card .stat-widget-icon {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}
.purple-card .stat-widget-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}
.yellow-card .stat-widget-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
.blue-card .stat-widget-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}
.green-card .stat-widget-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.red-card .stat-widget-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Layout Columns */
.dashboard-columns {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  /* background: #ffffff; */
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  padding: 24px;
}

body.dark-mode .dashboard-card {
  /* background: #111827; */
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.dashboard-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

body.dark-mode .dashboard-card-title {
  color: #ffffff;
}

/* Charts Containers */
.charts-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

.chart-box {
  background: rgba(0,0,0,0.02);
  border-radius: 8px;
  padding: 16px;
  border: 1px dashed rgba(0,0,0,0.08);
}

body.dark-mode .chart-box {
  background: rgba(255,255,255,0.02);
  border: 1px dashed rgba(255,255,255,0.1);
}

.chart-subtitle {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 16px 0;
}

body.dark-mode .chart-subtitle {
  color: rgba(255,255,255,0.7);
}

/* Bar Chart */
.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
  padding-top: 20px;
  gap: 12px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.bar-fill-wrapper {
  width: 100%;
  height: 100px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: visible;
}

body.dark-mode .bar-fill-wrapper {
  background: rgba(255,255,255,0.08);
}

.bar-fill {
  width: 100%;
  background: #10b981;
  border-radius: 6px;
  transition: height 0.5s ease;
  position: relative;
}

.bar-value-tooltip {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

body.dark-mode .bar-value-tooltip {
  background: #c5a880;
  color: #000;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 8px;
}

/* SVG Donut Chart */
.donut-chart-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.donut-chart-svg {
  transform: rotate(-90deg);
}

.donut-center-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.donut-center-val {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

body.dark-mode .donut-center-val {
  color: #ffffff;
}

.donut-center-txt {
  font-size: 0.65rem;
  color: #6b7280;
  font-weight: 600;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  text-align: left;
  padding-left: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-text {
  font-size: 0.8rem;
  color: #4b5563;
}

body.dark-mode .legend-text {
  color: rgba(255,255,255,0.6);
}

/* Category Progress Bars */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

body.dark-mode .cat-name {
  color: rgba(255,255,255,0.8);
}

.cat-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

body.dark-mode .cat-count {
  color: #ffffff;
}

.cat-bar-wrapper {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

body.dark-mode .cat-bar-wrapper {
  background: rgba(255,255,255,0.08);
}

.cat-bar-fill {
  height: 100%;
  background: #f59e0b;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Handling Guidelines Card */
.guide-card-widget {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  color: #ffffff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.guide-title {
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.guide-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-list li {
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.guide-list li::marker {
  color: #f59e0b;
}

/* Refresh button */
.btn-refresh-dashboard {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-refresh-dashboard:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
