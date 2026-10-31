<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1300px; margin: 0 auto; padding-top: 20px; padding-bottom: 50px;">
      
      <!-- Top Header & Action Bar -->
      <div class="page-header-wrapper">
        <div class="page-title-box">
          <h2 class="form-title" style="margin:0">// DAFTAR_PESANAN_MASUK</h2>
          <p class="page-subtitle">
            Kelola pesanan klien, pantau status pengerjaan proyek, pembayaran, dan tambahkan pesanan baru langsung dari admin.
          </p>
        </div>

        <div class="header-actions-wrap">
          <!-- View Mode Switcher: Grid vs Table -->
          <div class="view-mode-toggle">
            <button 
              type="button"
              @click="viewMode = 'grid'" 
              :class="['mode-btn', { active: viewMode === 'grid' }]" 
              title="Tampilan Grid Card"
            >
              <i class="fas fa-th-large"></i> Grid
            </button>
            <button 
              type="button"
              @click="viewMode = 'table'" 
              :class="['mode-btn', { active: viewMode === 'table' }]" 
              title="Tampilan Tabel"
            >
              <i class="fas fa-list"></i> Tabel
            </button>
          </div>

          <button @click="fetchOrders" class="btn-cancel" style="margin:0; width:auto; padding: 9px 16px;" title="Refresh Data">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i> Refresh
          </button>

          <button @click="openAddOrderModal" class="btn-submit" style="margin:0; width:auto; padding: 9px 18px;">
            <i class="fas fa-plus"></i> TAMBAH PESANAN
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary Cards -->
      <div class="stats-cards-grid">
        <div class="stat-card-widget gray-card" style="cursor: pointer;" @click="resetFilters" title="Semua Pesanan">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL PESANAN</span>
            <span class="stat-widget-val">{{ orders.length }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
        </div>

        <div class="stat-card-widget yellow-card" style="cursor: pointer;" @click="statusFilter = 'pending'" title="Filter Pending">
          <div class="stat-widget-left">
            <span class="stat-widget-label">PENDING</span>
            <span class="stat-widget-val">{{ countPending }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-clock"></i>
          </div>
        </div>

        <div class="stat-card-widget blue-card" style="cursor: pointer;" @click="statusFilter = 'in-progress'" title="Filter In Progress">
          <div class="stat-widget-left">
            <span class="stat-widget-label">IN PROGRESS</span>
            <span class="stat-widget-val">{{ countInProgress }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-spinner"></i>
          </div>
        </div>

        <div class="stat-card-widget green-card" style="cursor: pointer;" @click="statusFilter = 'completed'" title="Filter Selesai">
          <div class="stat-widget-left">
            <span class="stat-widget-label">SELESAI</span>
            <span class="stat-widget-val">{{ countCompleted }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="filter-bar" style="display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: wrap; align-items: center;">
        <div style="flex: 1; min-width: 240px; position: relative;">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="Cari nama klien, email, WhatsApp, atau jenis layanan..." 
            class="form-control"
            style="padding-left: 36px;"
          />
          <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #6b7280; font-size: 0.9rem;"></i>
        </div>

        <select v-model="statusFilter" class="form-control" style="max-width: 180px;">
          <option value="ALL">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select v-model="paymentFilter" class="form-control" style="max-width: 180px;">
          <option value="ALL">Semua Pembayaran</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>

        <button 
          v-if="searchKeyword || statusFilter !== 'ALL' || paymentFilter !== 'ALL'"
          @click="resetFilters" 
          class="btn-cancel" 
          style="margin: 0; width: auto; padding: 9px 14px; font-size: 0.85rem;"
          title="Reset Semua Filter"
        >
          <i class="fas fa-undo"></i> Reset
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state-box">
        <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--text-primary, #8a7051); margin-bottom: 12px;"></i>
        <div style="font-family: monospace; letter-spacing: 1px;">MEMUAT_DATA_PESANAN...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg" class="db-error-alert" style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <div>
            <strong><i class="fas fa-exclamation-triangle"></i> Terjadi Kesalahan:</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.85rem;">{{ errorMsg }}</p>
          </div>
          <button @click="errorMsg = ''" style="background:none; border:none; color:#fca5a5; cursor:pointer; font-size: 1.2rem;">&times;</button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="orders-empty-box">
        <div style="opacity: 0.5; margin-bottom: 12px; font-size: 2.8rem; color: var(--text-primary, #8a7051);">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">Tidak Ada Pesanan Ditemukan</h3>
        <p style="color: #6b7280; font-size: 0.9rem; max-width: 450px; margin: 0 auto 15px auto;">
          {{ orders.length === 0 ? 'Belum ada data pesanan masuk. Anda dapat menambahkan pesanan manual menggunakan tombol di atas.' : 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian atau filter Anda.' }}
        </p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button v-if="orders.length === 0" @click="openAddOrderModal" class="btn-submit" style="width:auto; padding: 8px 18px;">
            <i class="fas fa-plus"></i> Tambah Pesanan Baru
          </button>
          <button v-else @click="resetFilters" class="btn-cancel" style="width:auto; padding: 8px 18px;">
            <i class="fas fa-undo"></i> Reset Filter
          </button>
        </div>
      </div>

      <!-- VIEW MODE 1: MODERN GRID CARDS -->
      <div v-else-if="viewMode === 'grid'" class="orders-grid">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="order-card"
        >
          <!-- Card Header: Date & Status Selector -->
          <div class="order-card-header">
            <div class="order-date-text">
              <i class="far fa-calendar-alt"></i> {{ formatDate(order.created_at) }}
            </div>
            
            <div class="order-header-badges">
              <select 
                :value="order.status || 'pending'"
                @change="updateOrderStatus(order.id, $event.target.value)" 
                :class="['status-select', order.status || 'pending']"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <!-- Card Body: Client info, service & notes -->
          <div class="order-card-body">
            <div>
              <h3 class="order-client-name">
                <i class="fas fa-user-circle" style="color: var(--text-primary); font-size: 1.15rem;"></i>
                {{ order.client_name }}
              </h3>
              <p v-if="order.client_email" class="order-client-email">
                <i class="far fa-envelope"></i> {{ order.client_email }}
              </p>
            </div>

            <!-- Service Ordered -->
            <div class="order-service-badge" title="Layanan Yang Dipesan">
              <i class="fas fa-tag"></i> {{ order.order_type || 'Layanan Kustom' }}
            </div>

            <!-- WhatsApp Link Direct Action -->
            <div style="margin-top: 2px;">
              <a 
                :href="getWaChatUrl(order)" 
                target="_blank" 
                class="order-wa-link"
                title="Buka Chat WhatsApp Klien"
              >
                <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
                <span>{{ order.client_whatsapp }}</span>
                <i class="fas fa-external-link-alt" style="font-size: 0.72rem; opacity: 0.7;"></i>
              </a>
            </div>

            <!-- Order Notes if present -->
            <div v-if="order.order_notes" class="order-notes-box">
              <div class="order-notes-header">
                <span class="order-notes-title">
                  <i class="far fa-comment-dots"></i> Catatan Klien:
                </span>
                <button
                  v-if="order.order_notes.length > 70 || order.order_notes.includes('\n')"
                  type="button"
                  @click="toggleNote(order.id)"
                  class="order-notes-toggle"
                  :title="expandedNotes[order.id] ? 'Perkecil catatan' : 'Tampilkan catatan lengkap'"
                >
                  <span>{{ expandedNotes[order.id] ? 'Sembunyikan' : 'Selengkapnya' }}</span>
                  <i :class="expandedNotes[order.id] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </button>
              </div>
              <div 
                :class="['order-notes-content', { 'is-collapsed': !expandedNotes[order.id] && (order.order_notes.length > 70 || order.order_notes.includes('\n')) }]"
              >
                {{ order.order_notes }}
              </div>
            </div>
          </div>

          <!-- Card Footer: Payment status & Action buttons -->
          <div class="order-card-footer">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.75rem; color: #6b7280; font-weight: 600;">BAYAR:</span>
              <select 
                :value="order.payment_status || 'unpaid'"
                @change="updatePaymentStatus(order.id, $event.target.value)" 
                :class="['status-badge', order.payment_status || 'unpaid']" 
                style="border:none; cursor:pointer;"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div class="card-action-btns">
              <a 
                :href="getWaChatUrl(order)" 
                target="_blank" 
                class="btn-icon-action wa-chat-btn" 
                title="Kirim Chat via WhatsApp (Direct API)"
              >
                <i class="fab fa-whatsapp"></i> Chat
              </a>

              <button 
                type="button"
                @click="openEditOrderModal(order)" 
                class="btn-icon-action edit-btn" 
                title="Edit Pesanan Ini"
              >
                <i class="fas fa-edit"></i>
                <span>Edit</span>
              </button>

              <button 
                @click="deleteOrder(order.id)" 
                class="btn-icon-action delete-btn" 
                title="Hapus Pesanan Ini"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- VIEW MODE 2: TABLE VIEW -->
      <div v-else class="dashboard-section" style="display: block; background: transparent; padding: 0;">
        <div style="overflow-x: auto;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th style="width: 110px;">Tanggal</th>
                <th>Layanan</th>
                <th>Klien</th>
                <th>WhatsApp</th>
                <th>Catatan</th>
                <th style="width: 140px; text-align: center;">Status</th>
                <th style="width: 110px; text-align: center;">Pembayaran</th>
                <th style="width: 100px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td data-label="Tanggal">
                  <span style="font-family: monospace; font-size: 0.82rem;">{{ formatDate(order.created_at) }}</span>
                </td>
                <td data-label="Layanan">
                  <span class="order-service-badge" style="font-size: 0.78rem; padding: 3px 8px;">
                    {{ order.order_type }}
                  </span>
                </td>
                <td data-label="Klien">
                  <div style="font-weight: 600; color: #ffffff;">{{ order.client_name }}</div>
                  <small style="opacity: 0.6; font-size: 0.75rem;">{{ order.client_email || '-' }}</small>
                </td>
                <td data-label="WhatsApp">
                  <a :href="getWaChatUrl(order)" target="_blank" class="order-wa-link">
                    <i class="fab fa-whatsapp"></i> {{ order.client_whatsapp }}
                  </a>
                </td>
                <td data-label="Catatan" style="font-size: 0.8rem; max-width: 240px; white-space: normal; line-height: 1.4;">
                  <div v-if="order.order_notes">
                    <div :class="['table-notes-text', { 'is-collapsed': !expandedNotes[order.id] && (order.order_notes.length > 60 || order.order_notes.includes('\n')) }]">
                      {{ order.order_notes }}
                    </div>
                    <button 
                      v-if="order.order_notes.length > 60 || order.order_notes.includes('\n')"
                      type="button" 
                      @click="toggleNote(order.id)" 
                      class="order-notes-toggle"
                      style="margin-top: 4px;"
                    >
                      <span>{{ expandedNotes[order.id] ? 'Tutup' : 'Selengkapnya' }}</span>
                      <i :class="expandedNotes[order.id] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                    </button>
                  </div>
                  <span v-else style="color: #6b7280;">-</span>
                </td>
                <td data-label="Status" style="text-align: center;">
                  <select 
                    :value="order.status || 'pending'"
                    @change="updateOrderStatus(order.id, $event.target.value)" 
                    :class="['status-select', order.status || 'pending']"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td data-label="Pembayaran" style="text-align: center;">
                  <select 
                    :value="order.payment_status || 'unpaid'"
                    @change="updatePaymentStatus(order.id, $event.target.value)" 
                    :class="['status-badge', order.payment_status || 'unpaid']" 
                    style="border:none; cursor:pointer;"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td data-label="Aksi" style="text-align: center;">
                  <div style="display:flex; gap:6px; justify-content: center;">
                    <a :href="getWaChatUrl(order)" target="_blank" class="btn-icon-action wa-chat-btn" title="Kirim Chat via WhatsApp" style="padding: 5px 8px;">
                      <i class="fab fa-whatsapp"></i>
                    </a>
                    <button 
                      type="button"
                      @click="openEditOrderModal(order)" 
                      class="btn-icon-action edit-btn" 
                      title="Edit Pesanan Ini" 
                      style="padding: 5px 8px;"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteOrder(order.id)" class="btn-icon-action delete-btn" title="Hapus Pesanan" style="padding: 5px 8px;">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= MODAL: TAMBAH / EDIT PESANAN ================= -->
      <div v-if="showOrderModal" class="modal-backdrop" @click.self="closeOrderModal">
        <div class="crud-form-card modal-content animate-scale" style="max-width: 620px; max-height: 90vh; overflow-y: auto; padding: 28px;">
          <button type="button" class="modal-close-btn" @click="closeOrderModal" aria-label="Close modal">&times;</button>
          
          <h3 class="form-title" style="font-size:1.2rem; margin-bottom: 20px;">
            {{ modalMode === 'edit' ? '// EDIT_DATA_PESANAN' : '// TAMBAH_PESANAN_BARU' }}
          </h3>

          <form @submit.prevent="saveOrder" class="admin-form">
            <div class="form-group">
              <label>Nama Klien *</label>
              <input 
                type="text" 
                v-model="orderForm.client_name" 
                required 
                placeholder="Contoh: Budi Santoso, PT Maju Bersama, dsb." 
                class="form-control"
              />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label>Nomor WhatsApp *</label>
                <input 
                  type="text" 
                  v-model="orderForm.client_whatsapp" 
                  required 
                  placeholder="Contoh: 08123456789 atau 628123456789" 
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>Email Klien (Opsional)</label>
                <input 
                  type="email" 
                  v-model="orderForm.client_email" 
                  placeholder="contoh: klien@email.com" 
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Jenis Layanan Yang Dipesan *</label>
              <select v-model="selectedServicePreset" @change="onServicePresetChange" class="form-control" style="margin-bottom: 8px;">
                <option value="">-- Pilih Dari Katalog Layanan --</option>
                <option v-for="srv in availableServices" :key="srv" :value="srv">{{ srv }}</option>
                <option value="CUSTOM">+ Tulis Layanan Lainnya (Kustom)</option>
              </select>

              <input 
                type="text" 
                v-model="orderForm.order_type" 
                required 
                placeholder="Masukkan judul layanan, misal: Desain Logo, Desain Kaos, dsb." 
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Catatan Pesanan / Detail Brief</label>
              <textarea 
                v-model="orderForm.order_notes" 
                rows="3" 
                placeholder="Spesifikasi request klien, deadline, catatan khusus, dll." 
                class="form-control"
              ></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Status Pesanan</label>
                <select v-model="orderForm.status" class="form-control">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div class="form-group">
                <label>Status Pembayaran</label>
                <select v-model="orderForm.payment_status" class="form-control">
                  <option value="unpaid">Unpaid (Belum Lunas)</option>
                  <option value="paid">Paid (Lunas)</option>
                </select>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div style="display:flex; gap:10px; margin-top: 15px;">
              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="isSubmitting"
                style="width: auto; padding: 12px 28px;"
              >
                <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin"></i> MENYIMPAN...</span>
                <span v-else>
                  <i class="fas fa-check"></i>
                  {{ modalMode === 'edit' ? 'SIMPAN PERUBAHAN' : 'SIMPAN PESANAN' }}
                </span>
              </button>
              <button 
                type="button" 
                @click="closeOrderModal" 
                class="btn-cancel" 
                style="margin: 0; width: auto; padding: 12px 28px;"
              >
                BATAL
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Back Link -->
      <div style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/shop" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.75rem; letter-spacing: 1px;">
          <i class="fas fa-external-link-alt"></i> Back to Public Site
        </NuxtLink>
      </div>

    </div>

    <!-- Floating Toast Notification for Copy Chat -->
    <transition name="toast-fade">
      <div v-if="toastMessage" class="toast-notify">
        <i class="fas fa-check-circle" style="color: #34d399; font-size: 1.15rem;"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'admin'
})

// Orders state
const orders = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMsg = ref('')

// Toast & Copy State
const copiedOrderId = ref(null)
const toastMessage = ref('')

// Catatan Klien expand/collapse state
const expandedNotes = ref({})
const toggleNote = (id) => {
  expandedNotes.value[id] = !expandedNotes.value[id]
}

// View mode: 'grid' (default) | 'table'
const viewMode = ref('grid')

// Search & Filter
const searchKeyword = ref('')
const statusFilter = ref('ALL')
const paymentFilter = ref('ALL')

// Modal state
const showOrderModal = ref(false)
const modalMode = ref('add') // 'add' | 'edit'
const editingOrderId = ref(null)
const selectedServicePreset = ref('')

const defaultOrderForm = () => ({
  client_name: '',
  client_whatsapp: '',
  client_email: '',
  order_type: '',
  order_notes: '',
  status: 'pending',
  payment_status: 'unpaid'
})

const orderForm = ref(defaultOrderForm())

// Available catalog services fallback & fetched
const defaultServices = [
  'Desain Logo',
  'Desain Kaos',
  'Feed Instagram',
  'Desain Stiker',
  'Desain Mug',
  'Desain Lanyard',
  'Desain ID Card',
  'Pembuatan Website',
  'Fotografi',
  'Desain Cover Buku'
]

const availableServices = ref([...defaultServices])

// Global admin refresh trigger
const refreshTrigger = useState('admin-refresh-trigger', () => 0)

watch(refreshTrigger, () => {
  fetchOrders()
})

// Metrics calculations
const countPending = computed(() => orders.value.filter(o => o.status === 'pending').length)
const countInProgress = computed(() => orders.value.filter(o => o.status === 'in-progress').length)
const countCompleted = computed(() => orders.value.filter(o => o.status === 'completed').length)

// Filtered Orders
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Status filter
    if (statusFilter.value !== 'ALL' && order.status !== statusFilter.value) {
      return false
    }
    // Payment filter
    if (paymentFilter.value !== 'ALL' && order.payment_status !== paymentFilter.value) {
      return false
    }
    // Search keyword
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.toLowerCase()
      const nameMatch = (order.client_name || '').toLowerCase().includes(q)
      const waMatch = (order.client_whatsapp || '').toLowerCase().includes(q)
      const emailMatch = (order.client_email || '').toLowerCase().includes(q)
      const serviceMatch = (order.order_type || '').toLowerCase().includes(q)
      const notesMatch = (order.order_notes || '').toLowerCase().includes(q)
      return nameMatch || waMatch || emailMatch || serviceMatch || notesMatch
    }
    return true
  })
})

const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = 'ALL'
  paymentFilter.value = 'ALL'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const getWaMessageText = (order) => {
  if (!order) return ''

  // Ambil status pesanan dan pembayaran
  const status = order.status || 'pending'
  const payment = order.payment_status || 'unpaid'

  // Format sapaan nama klien & layanan
  const rawName = (order.client_name || '').trim()
  let clientGreeting = 'Kak'
  if (rawName) {
    clientGreeting = rawName.toLowerCase().startsWith('kak ') ? `*${rawName}*` : `Kak *${rawName}*`
  }

  const serviceName = order.order_type ? `*${order.order_type}*` : '*Layanan Kami*'

  // Rincian rekening pembayaran resmi Asixnam
  const paymentDetails = [
    '💳 *INFORMASI PEMBAYARAN:*',
    '• *Bank BRI:* 001001061913504',
    '• *DANA:* 085943548498',
    '• *ShopeePay:* 081323596022',
    '• *A/N:* Mohamad Khoirul Anam',
    '',
    '📸 _Mohon kirimkan bukti transfer setelah pembayaran agar dapat segera kami verifikasi._'
  ]

  let lines = []

  // 1. Pesanan Selesai tapi Belum Lunas
  if (status === 'completed' && payment === 'unpaid') {
    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Kabar gembira! Kami dari *Asixnam* ingin menginformasikan bahwa pesanan Kakak untuk layanan ${serviceName} telah *SELESAI* dikerjakan. 🎉✨`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Pengerjaan: *Selesai (Completed)* ✅',
      '• Status Pembayaran: *Belum Lunas (Unpaid)* ⏳',
      '',
      'Untuk pengiriman file master / hasil akhir pesanan, mohon menyelesaikan pembayaran melalui rekening berikut:',
      '',
      ...paymentDetails,
      '',
      'Terima kasih banyak telah mempercayakan kebutuhan Kakak kepada *Asixnam*! 🙏✨'
    ]

  // 2. Pesanan Selesai dan Sudah Lunas
  } else if (status === 'completed' && payment === 'paid') {
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : ''
    const queryParams = new URLSearchParams()
    if (order.client_name) queryParams.append('name', order.client_name.trim())
    if (order.order_type) queryParams.append('service', order.order_type.trim())
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const testiUrl = `${origin}/form-testi${queryString}`

    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Kabar gembira! Pesanan Kakak untuk layanan ${serviceName} telah *SELESAI* dikerjakan dan pembayaran sudah kami terima (*Lunas*). 🎉✅`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Pengerjaan: *Selesai (Completed)* ✅',
      '• Status Pembayaran: *Lunas (Paid)* 💚',
      '',
      'File / hasil pengerjaan siap digunakan. Semoga Kakak puas dengan hasil karya kami! 🌟',
      '',
      '⭐ *Beri Rating & Testimoni:*',
      'Kepuasan Kakak adalah prioritas utama kami. Mohon kesediaan Kakak meluangkan waktu 1 menit untuk memberikan penilaian bintang & ulasan melalui link berikut:',
      `👉 ${testiUrl}`,
      '',
      'Terima kasih banyak atas kepercayaan Kakak memilih *Asixnam*. Kami sangat menantikan project dan pesanan Kakak berikutnya! 🙏✨'
    ]

  // 3. Sedang Dikerjakan tapi Belum Lunas
  } else if (status === 'in-progress' && payment === 'unpaid') {
    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Kami dari *Asixnam* ingin mengabarkan bahwa pesanan Kakak untuk layanan ${serviceName} saat ini *SEDANG DALAM PROSES PENGERJAAN*. 🎨⏳`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Pengerjaan: *Dalam Proses (In Progress)* 🔄',
      '• Status Pembayaran: *Belum Lunas (Unpaid)* ⏳',
      '',
      'Sebagai pengingat ramah, pembayaran pesanan masih tercatat belum lunas. Kakak dapat melakukan pembayaran melalui rekening berikut:',
      '',
      ...paymentDetails,
      '',
      'Terima kasih banyak atas kepercayaannya kepada *Asixnam*! 🙏✨'
    ]

  // 4. Sedang Dikerjakan dan Sudah Lunas
  } else if (status === 'in-progress' && payment === 'paid') {
    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Pesanan Kakak untuk layanan ${serviceName} saat ini *SEDANG KAMI KERJAKAN* dengan maksimal. 🎨⏳`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Pengerjaan: *Dalam Proses (In Progress)* 🔄',
      '• Status Pembayaran: *Lunas (Paid)* ✅',
      '',
      'Pembayaran telah kami terima dengan baik. Kami akan segera memberikan update kembali begitu pesanan rampung dikerjakan. 🚀',
      '',
      'Terima kasih telah mempercayakan project Kakak kepada *Asixnam*! 🙏✨'
    ]

  // 5. Menunggu Antrean (Pending) dan Belum Lunas
  } else if (status === 'pending' && payment === 'unpaid') {
    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Terima kasih telah melakukan pemesanan di *Asixnam*! ✨`,
      `Pesanan Kakak untuk layanan ${serviceName} telah kami terima di sistem antrean kami. 📋`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Antrean: *Menunggu Pengerjaan (Pending)* ⏳',
      '• Status Pembayaran: *Belum Lunas (Unpaid)* 💳',
      '',
      'Agar pesanan dapat segera kami jadwalkan dan mulai dikerjakan, mohon melakukan pembayaran / DP melalui rekening berikut:',
      '',
      ...paymentDetails,
      '',
      'Terima kasih banyak, kami tunggu konfirmasinya ya Kak! 🙏✨'
    ]

  // 6. Menunggu Antrean (Pending) dan Sudah Lunas
  } else if (status === 'pending' && payment === 'paid') {
    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Terima kasih! Pesanan Kakak untuk layanan ${serviceName} telah kami terima dan pembayaran sudah terverifikasi *LUNAS*. ✅✨`,
      '',
      '📋 *Rincian Pesanan:*',
      `• Layanan: ${serviceName}`,
      '• Status Antrean: *Menunggu Antrean (Pending)* ⏳',
      '• Status Pembayaran: *Lunas (Paid)* 💚',
      '',
      'Pesanan Kakak sudah masuk ke jadwal pengerjaan dan akan segera diproses oleh tim kami secepatnya. 🚀',
      '',
      'Terima kasih atas kepercayaannya kepada *Asixnam*! 🙏✨'
    ]

  // 7. Status Lainnya (Fallback)
  } else {
    const statusLabel = status === 'completed' ? 'Selesai (Completed) ✅' : status === 'in-progress' ? 'Dalam Proses (In Progress) 🔄' : 'Menunggu (Pending) ⏳'
    const paymentLabel = payment === 'paid' ? 'Lunas (Paid) ✅' : 'Belum Lunas (Unpaid) ⏳'

    lines = [
      `Halo ${clientGreeting} 👋`,
      '',
      `Kami dari *Asixnam* ingin menginformasikan pembaruan status pesanan Kakak untuk layanan ${serviceName}. 📋✨`,
      '',
      '📋 *Status Terkini Pesanan:*',
      `• Layanan: ${serviceName}`,
      `• Status Pengerjaan: *${statusLabel}*`,
      `• Status Pembayaran: *${paymentLabel}*`,
      '',
      'Jika ada pertanyaan atau kebutuhan revisi, silakan hubungi kami melalui chat ini ya Kak. 😊',
      '',
      'Terima kasih telah mempercayai *Asixnam*! 🙏✨'
    ]
  }

  return lines.join('\n')
}

// WhatsApp URL menggunakan api.whatsapp.com/send langsung (menghindari bug redirect wa.me yang menghapus emoji)
const getWaChatUrl = (order) => {
  if (!order || !order.client_whatsapp) return '#'

  // Format nomor WhatsApp
  let num = String(order.client_whatsapp).replace(/[^0-9]/g, '')

  if (num.startsWith('620')) {
    num = '62' + num.slice(3)
  } else if (num.startsWith('0')) {
    num = '62' + num.slice(1)
  } else if (num.startsWith('8')) {
    num = '62' + num
  }

  const text = getWaMessageText(order)
  return `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(text)}`
}

// Fitur Salin Pesan (Backup 100% aman untuk paste langsung dengan seluruh emoji utuh)
const copyOrderWaMessage = async (order) => {
  const text = getWaMessageText(order)
  if (!text) return

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copiedOrderId.value = order.id
    toastMessage.value = 'Teks chat dan emoji berhasil disalin ke clipboard!'
    setTimeout(() => {
      if (copiedOrderId.value === order.id) {
        copiedOrderId.value = null
      }
    }, 2500)
    setTimeout(() => {
      toastMessage.value = ''
    }, 3500)
  } catch (err) {
    console.error('Gagal menyalin pesan:', err)
  }
}



// Fetch Orders from Supabase
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

// Fetch Services catalog to populate service selection
const fetchAvailableServices = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('services')
      .select('title')
      .order('order_num', { ascending: true })

    if (!error && data && data.length > 0) {
      availableServices.value = data.map(s => s.title)
    }
  } catch (err) {
    console.warn('Could not fetch services list:', err.message)
  }
}

// Modal actions
const openAddOrderModal = () => {
  modalMode.value = 'add'
  editingOrderId.value = null
  orderForm.value = defaultOrderForm()
  selectedServicePreset.value = ''
  showOrderModal.value = true
}

const openEditOrderModal = (order) => {
  if (!order) return
  modalMode.value = 'edit'
  editingOrderId.value = order.id
  orderForm.value = {
    client_name: order.client_name || '',
    client_whatsapp: order.client_whatsapp || '',
    client_email: order.client_email || '',
    order_type: order.order_type || '',
    order_notes: order.order_notes || '',
    status: order.status || 'pending',
    payment_status: order.payment_status || 'unpaid'
  }

  if (availableServices.value.includes(order.order_type)) {
    selectedServicePreset.value = order.order_type
  } else {
    selectedServicePreset.value = 'CUSTOM'
  }

  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  editingOrderId.value = null
  modalMode.value = 'add'
}

const onServicePresetChange = () => {
  if (selectedServicePreset.value && selectedServicePreset.value !== 'CUSTOM') {
    orderForm.value.order_type = selectedServicePreset.value
  } else if (selectedServicePreset.value === 'CUSTOM') {
    orderForm.value.order_type = ''
  }
}

const saveOrder = async () => {
  if (!orderForm.value.client_name || !orderForm.value.client_whatsapp || !orderForm.value.order_type) {
    alert('Harap isi Nama Klien, Nomor WhatsApp, dan Jenis Layanan.')
    return
  }

  isSubmitting.value = true
  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      client_name: orderForm.value.client_name.trim(),
      client_whatsapp: orderForm.value.client_whatsapp.trim(),
      client_email: orderForm.value.client_email ? orderForm.value.client_email.trim() : null,
      order_type: orderForm.value.order_type.trim(),
      order_notes: orderForm.value.order_notes ? orderForm.value.order_notes.trim() : null,
      status: orderForm.value.status || 'pending',
      payment_status: orderForm.value.payment_status || 'unpaid'
    }

    if (modalMode.value === 'edit' && editingOrderId.value) {
      const { error } = await $supabase
        .from('orders')
        .update(payload)
        .eq('id', editingOrderId.value)

      if (error) throw error

      alert('Pesanan berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('orders')
        .insert([payload])

      if (error) throw error

      alert('Pesanan baru berhasil ditambahkan!')
    }

    closeOrderModal()
    await fetchOrders()
  } catch (err) {
    alert((modalMode.value === 'edit' ? 'Gagal memperbarui pesanan: ' : 'Gagal menambahkan pesanan: ') + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const saveNewOrder = saveOrder

// Update order status
const updateOrderStatus = async (id, status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    
    // Update local state smoothly
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = status
  } catch (err) {
    alert('Update status gagal: ' + err.message)
    await fetchOrders()
  }
}

// Update payment status
const updatePaymentStatus = async (id, payment_status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)

    if (error) throw error

    // Update local state smoothly
    const order = orders.value.find(o => o.id === id)
    if (order) order.payment_status = payment_status
  } catch (err) {
    alert('Update status pembayaran gagal: ' + err.message)
    await fetchOrders()
  }
}

// Delete order
const deleteOrder = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini secara permanen?')) return
  
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    orders.value = orders.value.filter(o => o.id !== id)
    alert('Pesanan berhasil dihapus.')
  } catch (err) {
    alert('Gagal menghapus pesanan: ' + err.message)
    await fetchOrders()
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
      await fetchAvailableServices()
    }
  }
})
</script>

<style scoped>
/* Page Header Wrapper */
.page-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title-box {
  flex: 1;
  min-width: 280px;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.header-actions-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* View Mode Toggle Button */
.view-mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(197, 168, 128, 0.2);
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
}

.mode-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary, #6b7280);
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: var(--text-primary, #8a7051);
  color: #ffffff;
}

body.dark-mode .mode-btn.active {
  background: #9f7615;
  color: #ffffff;
}

/* Quick Metrics Stats Grid */
.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 25px;
}

@media (max-width: 1024px) {
  .stats-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-cards-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.stat-card-widget {
  background: var(--bg-secondary, #161616);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

body.dark-mode .stat-card-widget {
  background: #161616 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.stat-card-widget:hover {
  transform: translateY(-2px);
  border-color: rgba(197, 168, 128, 0.4) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.stat-widget-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-widget-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

body.dark-mode .stat-widget-label {
  color: rgba(255, 255, 255, 0.55);
}

.stat-widget-val {
  font-size: 1.85rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.stat-widget-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Card Themes */
.gray-card .stat-widget-icon {
  background: rgba(107, 114, 128, 0.15);
  color: #9ca3af;
}

.purple-card .stat-widget-icon {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.yellow-card .stat-widget-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.blue-card .stat-widget-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.green-card .stat-widget-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.red-card .stat-widget-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* Loading & Empty State Boxes */
.loading-state-box, .orders-empty-box {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(197, 168, 128, 0.2);
  border-radius: 14px;
}

/* ================= ORDERS GRID LAYOUT ================= */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
}

.order-card {
  background: var(--bg-secondary, #141414);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

body.dark-mode .order-card {
  background: #141414;
  border-color: rgba(197, 168, 128, 0.15);
}

.order-card:hover {
  transform: translateY(-3px);
  border-color: rgba(197, 168, 128, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.order-card-header {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.order-date-text {
  font-size: 0.78rem;
  color: #9ca3af;
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-card-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.order-client-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.3;
}

.order-client-email {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 3px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-service-badge {
  background: rgba(138, 112, 81, 0.15);
  color: var(--text-primary, #c5a880);
  border: 1px solid rgba(138, 112, 81, 0.3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
}

.order-wa-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #25d366;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.order-wa-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.order-notes-box {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
  border-left: 3px solid rgba(197, 168, 128, 0.5);
  line-height: 1.5;
  margin-top: 4px;
}

.order-notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  gap: 8px;
}

.order-notes-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.order-notes-toggle {
  background: transparent;
  border: none;
  color: var(--text-primary, #c5a880);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.order-notes-toggle:hover {
  background: rgba(197, 168, 128, 0.15);
  color: #ffffff;
}

.order-notes-content {
  white-space: pre-wrap;
  word-break: break-word;
  transition: max-height 0.3s ease;
}

.order-notes-content.is-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-notes-content:not(.is-collapsed) {
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
}

/* Custom sleek scrollbar for notes box */
.order-notes-content::-webkit-scrollbar {
  width: 4px;
}

.order-notes-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.order-notes-content::-webkit-scrollbar-thumb {
  background: rgba(197, 168, 128, 0.4);
  border-radius: 4px;
}

/* Table Notes */
.table-notes-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
}

.table-notes-text.is-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-card-footer {
  padding: 12px 18px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.card-action-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-icon-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary, #4b5563);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.btn-icon-action:hover {
  background: rgba(138, 112, 81, 0.15);
  color: var(--text-primary, #8a7051);
  transform: translateY(-1px);
}

.btn-icon-action.wa-chat-btn {
  color: #25d366;
  border-color: rgba(37, 211, 102, 0.3);
  background: rgba(37, 211, 102, 0.1);
  font-weight: 600;
}

.btn-icon-action.wa-chat-btn:hover {
  background: rgba(37, 211, 102, 0.2);
  border-color: #25d366;
}

.btn-icon-action.edit-btn {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
  background: rgba(56, 189, 248, 0.1);
  font-weight: 600;
}

.btn-icon-action.edit-btn:hover {
  background: rgba(56, 189, 248, 0.2);
  border-color: #38bdf8;
  color: #7dd3fc;
}

.btn-icon-action.copy-chat-btn {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.08);
}

.btn-icon-action.copy-chat-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: #60a5fa;
  color: #93c5fd;
}

.btn-icon-action.copy-chat-btn.copied {
  color: #34d399 !important;
  border-color: rgba(52, 211, 153, 0.5) !important;
  background: rgba(52, 211, 153, 0.15) !important;
}

/* Toast Notification */
.toast-notify {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #18181b;
  color: #f3f4f6;
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid rgba(52, 211, 153, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  font-size: 0.88rem;
  font-weight: 500;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.btn-icon-action.delete-btn {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
  background: rgba(239, 68, 68, 0.08);
}

.btn-icon-action.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.modal-close-btn:hover {
  color: #ffffff;
}

.animate-scale {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
