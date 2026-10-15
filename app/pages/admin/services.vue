<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      
      <!-- Top Action Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 class="form-title" style="margin:0">// PENGELOLAAN_LAYANAN_DAN_KATEGORI</h2>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 0.9rem;">
            Kelola katalog layanan freelance, kategori, harga, dan integrasi dengan halaman publik Shop & Checkout.
          </p>
        </div>
        
        <div style="display:flex; gap:10px; flex-wrap: wrap;">
          <button @click="triggerSeedServices" class="btn-cancel" style="margin:0; width:auto; padding: 8px 16px;">
            <i class="fas fa-database"></i> LOAD EXAMPLE DATA
          </button>
          <button @click="activeTab = 'categories'" :class="activeTab === 'categories' ? 'btn-submit' : 'btn-cancel'" style="margin:0; width:auto; padding: 8px 16px;">
            <i class="fas fa-tags"></i> KELOLA KATEGORI
          </button>
          <button @click="openAddServiceModal" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
            <i class="fas fa-plus"></i> TAMBAH LAYANAN BARU
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="stats-cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 25px;">
        <div class="stat-card-widget gray-card" style="cursor: pointer;" @click="activeTab = 'services'">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL LAYANAN</span>
            <span class="stat-widget-val">{{ servicesList.length }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-layer-group"></i>
          </div>
        </div>

        <div class="stat-card-widget green-card" style="cursor: pointer;" @click="activeTab = 'services'; statusFilter = 'active'">
          <div class="stat-widget-left">
            <span class="stat-widget-label">LAYANAN AKTIF</span>
            <span class="stat-widget-val">{{ activeServicesCount }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>

        <div class="stat-card-widget yellow-card" style="cursor: pointer;" @click="activeTab = 'categories'">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL KATEGORI</span>
            <span class="stat-widget-val">{{ categoriesList.length }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-folder"></i>
          </div>
        </div>

        <div class="stat-card-widget blue-card">
          <div class="stat-widget-left">
            <span class="stat-widget-label">HALAMAN PUBLIK</span>
            <a href="/shop" target="_blank" style="font-size: 0.95rem; font-weight: bold; color: var(--accent-blue, #8a7051); text-decoration: none; margin-top: 5px; display: inline-flex; align-items: center; gap: 5px;">
              Buka /shop <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i>
            </a>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-store"></i>
          </div>
        </div>
      </div>

      <!-- Tab Switcher Navigation -->
      <div class="tab-nav-wrapper" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">
        <button 
          @click="activeTab = 'services'" 
          :class="['tab-btn', { active: activeTab === 'services' }]"
        >
          <i class="fas fa-box-open"></i> Daftar Layanan ({{ servicesList.length }})
        </button>
        <button 
          @click="activeTab = 'categories'" 
          :class="['tab-btn', { active: activeTab === 'categories' }]"
        >
          <i class="fas fa-tags"></i> Kategori Layanan ({{ categoriesList.length }})
        </button>
      </div>

      <!-- SQL Warning Toast if table missing -->
      <div v-if="dbError" class="db-error-alert" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; color: #fca5a5;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <div>
            <strong><i class="fas fa-exclamation-triangle"></i> Supabase Notice:</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.85rem;">{{ dbError }}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.8rem; opacity: 0.9;">
              Pastikan tabel <code>services</code> dan <code>service_categories</code> sudah dibuat di Supabase SQL Editor menggunakan script di <code>schema.sql</code>.
            </p>
          </div>
          <button @click="dbError = null" style="background:none; border:none; color:#fca5a5; cursor:pointer;">&times;</button>
        </div>
      </div>

      <!-- TAB 1: SERVICES MANAGEMENT -->
      <div v-if="activeTab === 'services'">
        <!-- Filter & Search Bar -->
        <div class="filter-bar" style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
          <div style="flex: 1; min-width: 240px; position: relative;">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="Cari judul layanan, tag, atau deskripsi..." 
              class="form-control"
              style="padding-left: 36px;"
            />
            <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #6b7280; font-size: 0.9rem;"></i>
          </div>

          <select v-model="categoryFilter" class="form-control" style="max-width: 200px;">
            <option value="ALL">Semua Kategori ({{ servicesList.length }})</option>
            <option v-for="cat in categoriesList" :key="cat.id || cat.name" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>

          <select v-model="statusFilter" class="form-control" style="max-width: 160px;">
            <option value="ALL">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          <button 
            v-if="searchKeyword || categoryFilter !== 'ALL' || statusFilter !== 'ALL'"
            @click="resetFilters" 
            class="btn-cancel" 
            style="margin: 0; width: auto; padding: 9px 14px; font-size: 0.85rem;"
          >
            <i class="fas fa-undo"></i> Reset
          </button>
        </div>

        <!-- Services Table -->
        <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th style="width: 70px;">Gambar</th>
                <th>Layanan & Tag</th>
                <th>Kategori</th>
                <th>Keterangan Harga</th>
                <th>Deskripsi</th>
                <th style="width: 90px; text-align: center;">Status</th>
                <th style="width: 200px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" style="text-align:center; padding:40px;">
                  <i class="fas fa-spinner fa-spin"></i> MEMUAT_DATA_LAYANAN...
                </td>
              </tr>
              <tr v-else-if="filteredServicesList.length === 0">
                <td colspan="7" style="text-align:center; padding:40px;">
                  <div style="opacity: 0.6; margin-bottom: 10px;">
                    <i class="fas fa-box-open" style="font-size: 2rem;"></i>
                  </div>
                  <div>Tidak ada layanan yang ditemukan.</div>
                  <div style="font-size: 0.85rem; margin-top: 8px;">
                    Klik <strong>TAMBAH LAYANAN BARU</strong> atau <strong>LOAD EXAMPLE DATA</strong> untuk mengisi layanan bawaan.
                  </div>
                </td>
              </tr>
              <tr v-else v-for="item in filteredServicesList" :key="item.id || item.title">
                <td data-label="Gambar">
                  <div class="service-table-img-wrap">
                    <img 
                      v-if="item.image" 
                      :src="item.image" 
                      :alt="item.title" 
                      class="service-table-img" 
                      loading="lazy"
                    />
                    <div v-else class="service-table-img-placeholder">
                      <i class="fas fa-image"></i>
                    </div>
                  </div>
                </td>
                <td data-label="Layanan & Tag">
                  <div style="font-weight:bold; color: var(--text-primary); font-size: 0.95rem;">
                    {{ item.title }}
                  </div>
                  <div class="table-tags-wrap" style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
                    <span 
                      v-for="(tag, idx) in parseTags(item.tags)" 
                      :key="idx" 
                      class="table-tag-pill"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td data-label="Kategori">
                  <span class="meta-tag category-badge">
                    {{ item.category || 'Lainnya' }}
                  </span>
                </td>
                <td data-label="Harga">
                  <span style="font-weight: 600; color: #25d366; font-size: 0.85rem;">
                    {{ item.price || 'Sesuai Request' }}
                  </span>
                </td>
                <td data-label="Deskripsi" style="font-size:0.8rem; max-width:260px; white-space:normal; opacity: 0.85;">
                  {{ item.description || '-' }}
                </td>
                <td data-label="Status" style="text-align: center;">
                  <button 
                    @click="toggleServiceStatus(item)" 
                    :class="['status-toggle-pill', item.is_active !== false ? 'is-active' : 'is-inactive']"
                    :title="item.is_active !== false ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'"
                  >
                    <i :class="['fas', item.is_active !== false ? 'fa-check' : 'fa-times']"></i>
                    {{ item.is_active !== false ? 'Aktif' : 'Off' }}
                  </button>
                </td>
                <td data-label="Aksi">
                  <div style="display:flex; gap:6px; justify-content: center; flex-wrap: wrap;">
                    <a 
                      :href="item.link || `/checkout?service=${encodeURIComponent(item.title)}`" 
                      target="_blank" 
                      class="btn-edit-item" 
                      title="Uji Link Pemesanan"
                      style="text-decoration:none; padding: 6px 10px;"
                    >
                      <i class="fas fa-shopping-cart"></i>
                    </a>
                    <button 
                      @click="startEditService(item)" 
                      class="btn-edit-item" 
                      title="Edit Layanan"
                      style="padding: 6px 12px;"
                    >
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      @click="deleteServiceItem(item)" 
                      class="btn-delete-item" 
                      title="Hapus Layanan"
                      style="padding: 6px 12px;"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: CATEGORIES MANAGEMENT -->
      <div v-if="activeTab === 'categories'">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; align-items: start;">
          
          <!-- Category Add / Edit Form Card -->
          <div class="crud-form-card" style="padding: 24px;">
            <h3 class="form-title" style="font-size:1.05rem; margin-bottom: 16px;">
              {{ isEditingCategory ? '// EDIT_KATEGORI' : '// TAMBAH_KATEGORI_BARU' }}
            </h3>
            
            <form @submit.prevent="saveCategory" class="admin-form">
              <div class="form-group">
                <label>Nama Kategori *</label>
                <input 
                  type="text" 
                  v-model="categoryForm.name" 
                  required 
                  placeholder="Contoh: UI/UX Design, Merchandise, dsb." 
                  class="form-control"
                  @input="autoGenerateSlug"
                />
              </div>

              <div class="form-group">
                <label>Slug URL (Unik) *</label>
                <input 
                  type="text" 
                  v-model="categoryForm.slug" 
                  required 
                  placeholder="contoh: ui-ux-design" 
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>Deskripsi Kategori (Opsional)</label>
                <textarea 
                  v-model="categoryForm.description" 
                  rows="3" 
                  placeholder="Keterangan singkat mengenai kategori layanan ini..." 
                  class="form-control"
                ></textarea>
              </div>

              <div class="form-group">
                <label>Urutan Tampilan</label>
                <input 
                  type="number" 
                  v-model="categoryForm.order_num" 
                  class="form-control" 
                  style="max-width: 120px;"
                />
              </div>

              <div style="display:flex; gap:10px; margin-top: 10px;">
                <button type="submit" class="btn-submit" style="width: auto; padding: 10px 20px;">
                  <i class="fas fa-save"></i> {{ isEditingCategory ? 'Update Kategori' : 'Simpan Kategori' }}
                </button>
                <button 
                  v-if="isEditingCategory" 
                  type="button" 
                  @click="cancelEditCategory" 
                  class="btn-cancel" 
                  style="margin: 0; width: auto; padding: 10px 20px;"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          <!-- Categories List Table -->
          <div class="crud-form-card" style="padding: 24px;">
            <h3 class="form-title" style="font-size:1.05rem; margin-bottom: 16px;">
              // DAFTAR_KATEGORI_TERDAFTAR ({{ categoriesList.length }})
            </h3>
            
            <div style="overflow-x: auto;">
              <table class="dashboard-table" style="margin: 0;">
                <thead>
                  <tr>
                    <th>Nama & Slug</th>
                    <th>Jumlah Layanan</th>
                    <th style="width: 140px; text-align: center;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="categoriesList.length === 0">
                    <td colspan="3" style="text-align: center; padding: 25px;">
                      Belum ada kategori. Silakan tambahkan formulir di sebelah kiri.
                    </td>
                  </tr>
                  <tr v-else v-for="cat in categoriesList" :key="cat.id || cat.name">
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">{{ cat.name }}</div>
                      <div style="font-size: 0.75rem; color: #6b7280; font-family: monospace;">{{ cat.slug }}</div>
                      <div v-if="cat.description" style="font-size: 0.75rem; opacity: 0.7; margin-top: 4px;">{{ cat.description }}</div>
                    </td>
                    <td>
                      <span class="meta-tag" style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                        {{ getServicesCountByCategory(cat.name) }} Layanan
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div style="display: flex; gap: 6px; justify-content: center;">
                        <button @click="startEditCategory(cat)" class="btn-edit-item" title="Edit Kategori">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteCategory(cat)" class="btn-delete-item" title="Hapus Kategori">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <!-- MODAL: ADD / EDIT SERVICE -->
      <div v-if="showServiceModal" class="modal-backdrop" @click.self="closeServiceModal">
        <div class="crud-form-card modal-content animate-scale" style="max-width: 650px; max-height: 90vh; overflow-y: auto;">
          <button type="button" class="modal-close-btn" @click="closeServiceModal" aria-label="Close modal">&times;</button>
          
          <h3 class="form-title" style="font-size:1.15rem; margin-bottom: 20px;">
            {{ isEditingService ? '// EDIT_SERVICE_ITEM' : '// ADD_SERVICE_ITEM' }}
          </h3>

          <form @submit.prevent="saveService" class="admin-form">
            <div class="form-group">
              <label>Judul Layanan *</label>
              <input 
                type="text" 
                v-model="serviceForm.title" 
                required 
                placeholder="Contoh: Desain Logo, Pembuatan Website, dsb." 
                class="form-control"
                @input="handleTitleChange"
              />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div class="form-group">
                <label>Kategori *</label>
                <div style="display: flex; gap: 8px;">
                  <select v-model="serviceForm.category" required class="form-control">
                    <option disabled value="">Pilih Kategori</option>
                    <option v-for="cat in categoriesList" :key="cat.id || cat.name" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Keterangan Harga / Tarif</label>
                <input 
                  type="text" 
                  v-model="serviceForm.price" 
                  placeholder="Contoh: Start From 100k, Mulai 5jt" 
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Deskripsi Layanan *</label>
              <textarea 
                v-model="serviceForm.description" 
                rows="3" 
                required 
                placeholder="Jelaskan detail apa saja yang didapatkan klien..." 
                class="form-control"
              ></textarea>
            </div>

            <!-- Image Upload / URL Section -->
            <div class="form-group">
              <label>Gambar Layanan (URL atau Upload)</label>
              <input 
                type="text" 
                v-model="serviceForm.image" 
                placeholder="Masukkan URL Gambar (Google Drive, Cloud, Unsplash, dsb.)" 
                class="form-control"
                @blur="handleImageBlur"
              />
              
              <div style="margin-top: 8px;">
                <label style="font-size: 0.78rem; opacity: 0.8; display: block; margin-bottom: 4px;">
                  Atau Upload File Gambar (.jpg, .png, .webp):
                </label>
                <input 
                  type="file" 
                  @change="onImageFileChange" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  class="form-control" 
                  style="background: transparent; color: inherit; border: 1px dashed rgba(255, 255, 255, 0.2); padding: 8px;" 
                />
                <div v-if="isUploadingImage" style="font-size: 0.85rem; color: var(--accent-blue, #8a7051); margin-top: 5px;">
                  <i class="fas fa-spinner fa-spin"></i> Sedang mengompresi dan mengunggah gambar...
                </div>
              </div>

              <!-- Live Image Preview -->
              <div v-if="serviceForm.image" style="margin-top: 10px; display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">
                <img :src="serviceForm.image" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);" />
                <div style="font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                  <span style="color: #25d366;"><i class="fas fa-check-circle"></i> Gambar Terpasang</span>
                </div>
                <button type="button" @click="serviceForm.image = ''" class="btn-delete-item" style="padding: 4px 8px; font-size: 0.75rem;">
                  Hapus
                </button>
              </div>
            </div>

            <!-- Tags / Fitur Input -->
            <div class="form-group">
              <label>Tags / Fitur Layanan (Pisahkan dengan koma)</label>
              <input 
                type="text" 
                v-model="serviceForm.tags_string" 
                placeholder="Contoh: Custom Design, Vector Format, Start From 100k" 
                class="form-control"
              />
              <small style="opacity: 0.7; font-size: 0.78rem;">
                Tags ini akan muncul sebagai badge fitur di kartu layanan halaman Shop.
              </small>
            </div>

            <!-- Link Pemesanan -->
            <div class="form-group">
              <label>Link Pemesanan (Otomatis ke Halaman Checkout)</label>
              <input 
                type="text" 
                v-model="serviceForm.link" 
                placeholder="/checkout?service=Nama Layanan" 
                class="form-control"
              />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div class="form-group">
                <label>Urutan Tampilan</label>
                <input 
                  type="number" 
                  v-model="serviceForm.order_num" 
                  class="form-control" 
                />
              </div>

              <div class="form-group" style="justify-content: center;">
                <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; margin-top: 20px;">
                  <input 
                    type="checkbox" 
                    v-model="serviceForm.is_active" 
                    style="width: 18px; height: 18px; accent-color: #8a7051; cursor: pointer;"
                  />
                  <span>Status Aktif di Website</span>
                </label>
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
                <span v-else>{{ isEditingService ? 'UPDATE LAYANAN' : 'SIMPAN LAYANAN' }}</span>
              </button>
              <button 
                type="button" 
                @click="closeServiceModal" 
                class="btn-cancel" 
                style="margin: 0; width: auto; padding: 12px 28px;"
              >
                BATAL
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { compressImage } from '~/utils/image'

definePageMeta({
  layout: 'admin'
})

// Tab state: 'services' | 'categories'
const activeTab = ref('services')

// Lists
const servicesList = ref([])
const categoriesList = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isUploadingImage = ref(false)
const dbError = ref(null)

// Filtering
const searchKeyword = ref('')
const categoryFilter = ref('ALL')
const statusFilter = ref('ALL')

// Service modal state
const showServiceModal = ref(false)
const isEditingService = ref(false)
const editingServiceId = ref(null)

const serviceForm = ref({
  title: '',
  category: '',
  price: '',
  description: '',
  image: '',
  tags_string: '',
  link: '',
  order_num: 1,
  is_active: true
})

// Category form state
const isEditingCategory = ref(false)
const editingCategoryId = ref(null)
const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  order_num: 0
})

// Default Categories for Seeding / Fallback
const defaultCategories = [
  { name: 'Graphic Design', slug: 'graphic-design', description: 'Desain grafis, logo branding, identitas visual', order_num: 1 },
  { name: 'Merchandise & Print', slug: 'merchandise-print', description: 'Desain kaos, merchandise, stiker, mug, cetak', order_num: 2 },
  { name: 'Social Media', slug: 'social-media', description: 'Feed Instagram, reels, dan konten visual media sosial', order_num: 3 },
  { name: 'Web Development', slug: 'web-development', description: 'Pembuatan website profesional, responsif & modern', order_num: 4 },
  { name: 'Multimedia & Fotografi', slug: 'multimedia-fotografi', description: 'Jasa fotografi, video editing & multimedia', order_num: 5 },
  { name: 'Lainnya', slug: 'lainnya', description: 'Layanan kustom lainnya sesuai kebutuhan klien', order_num: 6 }
]

// Default 10 Services from shop.vue for Seeding / Fallback
const defaultServices = [
  {
    title: 'Desain Logo',
    category: 'Graphic Design',
    description: 'Pembuatan logo profesional yang mencerminkan identitas bisnis Anda dengan desain yang unik dan memorable.',
    image: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000',
    tags: ['Custom Design', 'Multiple Revisions', 'Vector Format', 'Start From 100k'],
    price: 'Start From 100k',
    link: '/checkout?service=Desain Logo',
    is_active: true,
    order_num: 1
  },
  {
    title: 'Desain Kaos',
    category: 'Merchandise & Print',
    description: 'Desain kaos kreatif untuk brand personal, acara, atau bisnis dengan pilihan style yang beragam.',
    image: 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000',
    tags: ['Desain Kustom', 'Mockup Preview', 'Start From 100k'],
    price: 'Start From 100k',
    link: '/checkout?service=Desain Kaos',
    is_active: true,
    order_num: 2
  },
  {
    title: 'Feed Instagram',
    category: 'Social Media',
    description: 'Desain feed Instagram yang aesthetic dan konsisten untuk meningkatkan visual branding akun Anda.',
    image: 'https://lh3.googleusercontent.com/d/1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4=w1000',
    tags: ['Grid Layout', 'Tema Konsisten', 'HD Resolution', 'Start From 50k'],
    price: 'Start From 50k',
    link: '/checkout?service=Feed Instagram',
    is_active: true,
    order_num: 3
  },
  {
    title: 'Desain Stiker',
    category: 'Merchandise & Print',
    description: 'Desain stiker unik dan eye-catching untuk produk, merchandise, atau keperluan promosi bisnis.',
    image: 'https://lh3.googleusercontent.com/d/1pkCZDxiUV-_ylQEw0A_Ce6GwyF2S_P22=w1000',
    tags: ['Custom Design', 'Berbagai Ukuran', 'Print Ready', 'Start From 40k'],
    price: 'Start From 40k',
    link: '/checkout?service=Desain Stiker',
    is_active: true,
    order_num: 4
  },
  {
    title: 'Desain Mug',
    category: 'Merchandise & Print',
    description: 'Desain mug berkualitas untuk merchandise, hadiah, atau koleksi pribadi dengan hasil print yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/10mS9Kp2baYjRZtwHcJB-VgRlGF4QE-31=w1000',
    tags: ['Custom Design', 'Mockup Preview', 'Start From 50k'],
    price: 'Start From 50k',
    link: '/checkout?service=Desain Mug',
    is_active: true,
    order_num: 5
  },
  {
    title: 'Desain Lanyard',
    category: 'Merchandise & Print',
    description: 'Desain lanyard profesional untuk acara, identitas karyawan, atau merchandise dengan detail yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/1hI8tTrLVQALecjtQeFcT5fxxo3I1eu-9=w1000',
    tags: ['Custom Design', 'Berbagai Material', 'Print Ready', 'Start From 50k'],
    price: 'Start From 50k',
    link: '/checkout?service=Desain Lanyard',
    is_active: true,
    order_num: 6
  },
  {
    title: 'Desain ID Card',
    category: 'Merchandise & Print',
    description: 'Desain kartu identitas profesional untuk perusahaan, sekolah, atau organisasi dengan standar kualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1l8B6QSJLEAy7zt-Ve87moX_94ORm3IuX=w1000',
    tags: ['Custom Design', 'PVC Material', 'Print Ready', 'Start From 20k'],
    price: 'Start From 20k',
    link: '/checkout?service=Desain ID Card',
    is_active: true,
    order_num: 7
  },
  {
    title: 'Pembuatan Website',
    category: 'Web Development',
    description: 'Pengembangan website profesional menggunakan teknologi terkini untuk memberikan pengalaman pengguna terbaik.',
    image: 'https://lh3.googleusercontent.com/d/1f07kczRvgEMIxRP-VRnkAx4cjG_8-dnX=w1000',
    tags: ['Responsive Design', 'SEO Optimized', 'Full Support', 'Start From 5jt'],
    price: 'Start From 5jt',
    link: '/checkout?service=Pembuatan Website',
    is_active: true,
    order_num: 8
  },
  {
    title: 'Fotografi',
    category: 'Multimedia & Fotografi',
    description: 'Jasa fotografi profesional untuk acara, produk, atau keperluan komersial dengan hasil berkualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc=w1000',
    tags: ['Foto & Editing', 'Profesional', 'Berbagai Paket', 'Start From 300k'],
    price: 'Start From 300k',
    link: '/checkout?service=Fotografi',
    is_active: true,
    order_num: 9
  },
  {
    title: 'Desain Cover Buku',
    category: 'Graphic Design',
    description: 'Desain cover buku yang menarik dan profesional untuk merepresentasikan isi cerita atau materi buku Anda.',
    image: 'https://lh3.googleusercontent.com/d/1CEgGGx3TLvtYUWR4a0QCRHX7_YeRFHYc=w1000',
    tags: ['Custom Design', '3D Mockup', 'Print Ready', 'Start From 50k'],
    price: 'Start From 50k',
    link: '/checkout?service=Desain Cover Buku',
    is_active: true,
    order_num: 10
  }
]

// Computed Metrics
const activeServicesCount = computed(() => {
  return servicesList.value.filter(s => s.is_active !== false).length
})

// Filtered Services List
const filteredServicesList = computed(() => {
  return servicesList.value.filter(item => {
    // Category filter
    if (categoryFilter.value !== 'ALL' && item.category !== categoryFilter.value) {
      return false
    }
    // Status filter
    if (statusFilter.value === 'active' && item.is_active === false) {
      return false
    }
    if (statusFilter.value === 'inactive' && item.is_active !== false) {
      return false
    }
    // Keyword search
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.toLowerCase()
      const titleMatch = (item.title || '').toLowerCase().includes(q)
      const descMatch = (item.description || '').toLowerCase().includes(q)
      const catMatch = (item.category || '').toLowerCase().includes(q)
      const tags = parseTags(item.tags).join(' ').toLowerCase()
      const tagsMatch = tags.includes(q)
      return titleMatch || descMatch || catMatch || tagsMatch
    }
    return true
  })
})

const resetFilters = () => {
  searchKeyword.value = ''
  categoryFilter.value = 'ALL'
  statusFilter.value = 'ALL'
}

const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    return tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}

const getServicesCountByCategory = (catName) => {
  return servicesList.value.filter(s => s.category === catName).length
}

const autoGenerateSlug = () => {
  if (!isEditingCategory.value) {
    categoryForm.value.slug = categoryForm.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
}

const handleTitleChange = () => {
  if (!serviceForm.value.link || serviceForm.value.link.startsWith('/checkout?service=')) {
    serviceForm.value.link = `/checkout?service=${encodeURIComponent(serviceForm.value.title)}`
  }
}

// Format media URLs (e.g., Google Drive links)
const formatMediaUrl = (url) => {
  if (!url) return ''
  if (url.includes('lh3.googleusercontent.com')) return url
  if (url.includes('drive.google.com')) {
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (matchD && matchD[1]) {
      return `https://lh3.googleusercontent.com/d/${matchD[1]}=w1000`
    }
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (matchId && matchId[1]) {
      return `https://lh3.googleusercontent.com/d/${matchId[1]}=w1000`
    }
  }
  return url
}

const handleImageBlur = () => {
  if (serviceForm.value.image) {
    serviceForm.value.image = formatMediaUrl(serviceForm.value.image)
  }
}

// Upload & Client-side Compress Image
const onImageFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploadingImage.value = true
  try {
    const compressedBlob = await compressImage(file, 1000, 1000, 0.8)
    const originalName = file.name || 'service_image.png'
    const extIdx = originalName.lastIndexOf('.')
    const nameWithoutExt = extIdx !== -1 ? originalName.slice(0, extIdx) : originalName
    const filename = `${nameWithoutExt}.jpg`

    const formData = new FormData()
    formData.append('file', compressedBlob, filename)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || 'Upload gagal')
    }

    const result = await response.json()
    serviceForm.value.image = result.url
  } catch (err) {
    alert('Gagal mengunggah gambar: ' + err.message)
  } finally {
    isUploadingImage.value = false
    if (event.target) event.target.value = ''
  }
}

// Fetch Services from Supabase
const fetchServices = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('services')
      .select('*')
      .order('order_num', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase services fetch error:', error.message)
      dbError.value = `Gagal memuat tabel 'services': ${error.message}`
      // Fallback to default if table empty
      if (servicesList.value.length === 0) {
        servicesList.value = [...defaultServices]
      }
    } else {
      servicesList.value = data || []
    }
  } catch (err) {
    console.warn('Fetch services error:', err.message)
    if (servicesList.value.length === 0) {
      servicesList.value = [...defaultServices]
    }
  }
}

// Fetch Categories from Supabase
const fetchCategories = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('service_categories')
      .select('*')
      .order('order_num', { ascending: true })

    if (error) {
      console.warn('Supabase categories fetch error:', error.message)
      if (categoriesList.value.length === 0) {
        categoriesList.value = [...defaultCategories]
      }
    } else {
      categoriesList.value = data && data.length > 0 ? data : [...defaultCategories]
    }
  } catch (err) {
    console.warn('Fetch categories error:', err.message)
    if (categoriesList.value.length === 0) {
      categoriesList.value = [...defaultCategories]
    }
  }
}

// Load Example Data Seeder
const triggerSeedServices = async () => {
  if (!confirm('Apakah Anda ingin memuat data contoh 10 Layanan & Kategori ke database Supabase?')) return
  try {
    const { $supabase } = useNuxtApp()
    
    // Seed categories
    const { error: catErr } = await $supabase
      .from('service_categories')
      .upsert(defaultCategories, { onConflict: 'name' })

    if (catErr) {
      console.warn('Seed categories notice:', catErr.message)
    }

    // Seed services
    const { error: servErr } = await $supabase
      .from('services')
      .insert(defaultServices)

    if (servErr) throw servErr

    alert('Data contoh layanan & kategori berhasil dimuat ke Supabase!')
    await fetchCategories()
    await fetchServices()
  } catch (err) {
    alert('Seeding gagal: ' + err.message + '\n\nPastikan script SQL di schema.sql sudah dijalankan di Supabase.')
    dbError.value = err.message
  }
}

// Service CRUD operations
const openAddServiceModal = () => {
  isEditingService.value = false
  editingServiceId.value = null
  serviceForm.value = {
    title: '',
    category: categoriesList.value[0]?.name || 'Graphic Design',
    price: 'Start From 100k',
    description: '',
    image: '',
    tags_string: '',
    link: '',
    order_num: (servicesList.value.length + 1),
    is_active: true
  }
  showServiceModal.value = true
}

const startEditService = (item) => {
  isEditingService.value = true
  editingServiceId.value = item.id
  serviceForm.value = {
    title: item.title,
    category: item.category || (categoriesList.value[0]?.name || 'Graphic Design'),
    price: item.price || '',
    description: item.description || '',
    image: item.image || '',
    tags_string: parseTags(item.tags).join(', '),
    link: item.link || `/checkout?service=${encodeURIComponent(item.title)}`,
    order_num: item.order_num ?? 1,
    is_active: item.is_active !== false
  }
  showServiceModal.value = true
}

const closeServiceModal = () => {
  showServiceModal.value = false
  isEditingService.value = false
  editingServiceId.value = null
}

const saveService = async () => {
  if (!serviceForm.value.title || !serviceForm.value.description) {
    alert('Harap isi judul dan deskripsi layanan.')
    return
  }

  isSubmitting.value = true
  try {
    const { $supabase } = useNuxtApp()
    
    const tagsArray = serviceForm.value.tags_string
      ? serviceForm.value.tags_string.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: serviceForm.value.title.trim(),
      category: serviceForm.value.category,
      price: serviceForm.value.price ? serviceForm.value.price.trim() : null,
      description: serviceForm.value.description.trim(),
      image: formatMediaUrl(serviceForm.value.image),
      tags: tagsArray,
      link: serviceForm.value.link || `/checkout?service=${encodeURIComponent(serviceForm.value.title)}`,
      order_num: Number(serviceForm.value.order_num) || 0,
      is_active: serviceForm.value.is_active
    }

    if (isEditingService.value && editingServiceId.value) {
      const { error } = await $supabase
        .from('services')
        .update(payload)
        .eq('id', editingServiceId.value)

      if (error) throw error
      alert('Layanan berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('services')
        .insert([payload])

      if (error) throw error
      alert('Layanan baru berhasil ditambahkan!')
    }

    closeServiceModal()
    await fetchServices()
  } catch (err) {
    alert('Gagal menyimpan layanan: ' + err.message + '\n\nPastikan tabel services sudah dibuat di Supabase.')
    dbError.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

const toggleServiceStatus = async (item) => {
  const newStatus = !(item.is_active !== false)
  try {
    const { $supabase } = useNuxtApp()
    if (item.id) {
      const { error } = await $supabase
        .from('services')
        .update({ is_active: newStatus })
        .eq('id', item.id)

      if (error) throw error
    }
    item.is_active = newStatus
  } catch (err) {
    alert('Gagal mengubah status: ' + err.message)
  }
}

const deleteServiceItem = async (item) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${item.title}"?`)) return
  try {
    const { $supabase } = useNuxtApp()
    if (item.id) {
      const { error } = await $supabase
        .from('services')
        .delete()
        .eq('id', item.id)

      if (error) throw error
    } else {
      // Local filter if unpersisted
      servicesList.value = servicesList.value.filter(s => s !== item)
    }
    alert('Layanan berhasil dihapus.')
    await fetchServices()
  } catch (err) {
    alert('Gagal menghapus layanan: ' + err.message)
  }
}

// Category CRUD operations
const startEditCategory = (cat) => {
  isEditingCategory.value = true
  editingCategoryId.value = cat.id
  categoryForm.value = {
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    order_num: cat.order_num || 0
  }
}

const cancelEditCategory = () => {
  isEditingCategory.value = false
  editingCategoryId.value = null
  categoryForm.value = {
    name: '',
    slug: '',
    description: '',
    order_num: 0
  }
}

const saveCategory = async () => {
  if (!categoryForm.value.name) {
    alert('Nama kategori wajib diisi.')
    return
  }

  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      name: categoryForm.value.name.trim(),
      slug: (categoryForm.value.slug || categoryForm.value.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryForm.value.description ? categoryForm.value.description.trim() : null,
      order_num: Number(categoryForm.value.order_num) || 0
    }

    if (isEditingCategory.value && editingCategoryId.value) {
      const { error } = await $supabase
        .from('service_categories')
        .update(payload)
        .eq('id', editingCategoryId.value)

      if (error) throw error
      alert('Kategori berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('service_categories')
        .insert([payload])

      if (error) throw error
      alert('Kategori baru berhasil ditambahkan!')
    }

    cancelEditCategory()
    await fetchCategories()
  } catch (err) {
    alert('Gagal menyimpan kategori: ' + err.message)
  }
}

const deleteCategory = async (cat) => {
  const count = getServicesCountByCategory(cat.name)
  const warn = count > 0 
    ? `Perhatian: Terdapat ${count} layanan yang menggunakan kategori "${cat.name}". Tetap hapus?` 
    : `Hapus kategori "${cat.name}"?`

  if (!confirm(warn)) return

  try {
    const { $supabase } = useNuxtApp()
    if (cat.id) {
      const { error } = await $supabase
        .from('service_categories')
        .delete()
        .eq('id', cat.id)

      if (error) throw error
    } else {
      categoriesList.value = categoriesList.value.filter(c => c.name !== cat.name)
    }
    alert('Kategori berhasil dihapus.')
    await fetchCategories()
  } catch (err) {
    alert('Gagal menghapus kategori: ' + err.message)
  }
}

// Watch global admin refresh trigger
const refreshTrigger = useState('admin-refresh-trigger', () => 0)
watch(refreshTrigger, () => {
  fetchServices()
  fetchCategories()
})

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()

    if (!session) {
      navigateTo('/admin')
    } else {
      isLoading.value = true
      await fetchCategories()
      await fetchServices()
      isLoading.value = false
    }
  }
})
</script>

<style scoped>
.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  background-color: rgba(138, 112, 81, 0.1);
  color: var(--text-primary, #8a7051);
}

.tab-btn.active {
  background-color: var(--text-primary, #8a7051);
  color: #ffffff;
}

body.dark-mode .tab-btn.active {
  background-color: #9f7615;
  color: #ffffff;
}

.service-table-img-wrap {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.service-table-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-table-img-placeholder {
  color: #6b7280;
  font-size: 1.2rem;
}

.table-tag-pill {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: rgba(138, 112, 81, 0.15);
  color: var(--text-primary, #8a7051);
  border-radius: 3px;
  letter-spacing: 0.3px;
}

body.dark-mode .table-tag-pill {
  background: rgba(197, 168, 128, 0.15);
  color: #c5a880;
}

.category-badge {
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.status-toggle-pill {
  border: none;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.status-toggle-pill.is-active {
  background: rgba(37, 211, 102, 0.15);
  color: #25d366;
}

.status-toggle-pill.is-inactive {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.status-toggle-pill:hover {
  filter: brightness(1.2);
}
</style>
