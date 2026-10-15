<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1300px; margin: 0 auto; padding-top: 20px; padding-bottom: 50px;">
      
      <!-- Top Action Bar -->
      <div class="page-header-wrapper">
        <div class="page-title-box">
          <h2 class="form-title" style="margin:0">// PENGELOLAAN_LAYANAN_DAN_KATEGORI</h2>
          <p class="page-subtitle">
            Kelola katalog layanan freelance, kategori, harga, dan integrasi dengan halaman publik Shop & Checkout.
          </p>
        </div>
        
        <div class="header-actions-wrap">
          <!-- View Mode Switcher -->
          <div v-if="activeTab === 'services'" class="view-mode-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="['mode-btn', { active: viewMode === 'grid' }]" 
              title="Tampilan Grid Card"
            >
              <i class="fas fa-th-large"></i> Grid
            </button>
            <button 
              @click="viewMode = 'table'" 
              :class="['mode-btn', { active: viewMode === 'table' }]" 
              title="Tampilan Tabel"
            >
              <i class="fas fa-list"></i> Tabel
            </button>
          </div>

          <button @click="triggerSeedServices" class="btn-cancel" style="margin:0; width:auto; padding: 9px 16px;">
            <i class="fas fa-database"></i> LOAD EXAMPLE DATA
          </button>
          <button @click="openAddServiceModal" class="btn-submit" style="margin:0; width:auto; padding: 9px 18px;">
            <i class="fas fa-plus"></i> TAMBAH LAYANAN
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="stats-cards-grid">
        <div class="stat-card-widget gray-card" style="cursor: pointer;" @click="activeTab = 'services'; resetFilters()" title="Klik untuk lihat semua layanan">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL LAYANAN</span>
            <span class="stat-widget-val">{{ servicesList.length }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-layer-group"></i>
          </div>
        </div>

        <div class="stat-card-widget green-card" style="cursor: pointer;" @click="activeTab = 'services'; statusFilter = 'active'" title="Klik untuk filter layanan aktif">
          <div class="stat-widget-left">
            <span class="stat-widget-label">LAYANAN AKTIF</span>
            <span class="stat-widget-val">{{ activeServicesCount }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>

        <div class="stat-card-widget yellow-card" style="cursor: pointer;" @click="activeTab = 'categories'" title="Klik untuk kelola kategori">
          <div class="stat-widget-left">
            <span class="stat-widget-label">TOTAL KATEGORI</span>
            <span class="stat-widget-val">{{ categoriesList.length }}</span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-folder"></i>
          </div>
        </div>

        <a href="/shop" target="_blank" class="stat-card-widget blue-card" style="cursor: pointer; text-decoration: none;" title="Buka Halaman Publik Shop">
          <div class="stat-widget-left">
            <span class="stat-widget-label">HALAMAN PUBLIK</span>
            <span class="stat-widget-val shop-link-val">
              /shop <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i>
            </span>
          </div>
          <div class="stat-widget-icon">
            <i class="fas fa-store"></i>
          </div>
        </a>
      </div>

      <!-- Tab Switcher Navigation -->
      <div class="tab-nav-wrapper">
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
          <i class="fas fa-tags"></i> Kelola Kategori ({{ categoriesList.length }})
        </button>
      </div>

      <!-- SQL Warning Toast if table missing -->
      <div v-if="dbError" class="db-error-alert">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <div style="flex: 1;">
            <strong><i class="fas fa-exclamation-triangle"></i> Supabase Notice:</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.85rem;">{{ dbError }}</p>
            <p style="margin: 5px 0 10px 0; font-size: 0.8rem; opacity: 0.9;">
              Tabel <code>services</code> dan <code>service_categories</code> belum ada di database Supabase Anda. Klik tombol di bawah untuk menyalin perintah SQL, lalu jalankan di Supabase SQL Editor.
            </p>
            <button 
              type="button" 
              @click="copySqlScript" 
              class="btn-submit" 
              style="width: auto; padding: 6px 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px;"
            >
              <i class="fas fa-copy"></i> Salin Skrip SQL Supabase
            </button>
          </div>
          <button @click="dbError = null" style="background:none; border:none; color:#fca5a5; cursor:pointer; font-size: 1.2rem;">&times;</button>
        </div>
      </div>

      <!-- ================= TAB 1: SERVICES MANAGEMENT ================= -->
      <div v-if="activeTab === 'services'">
        <!-- Filter & Search Bar -->
        <div class="filter-bar" style="display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: wrap; align-items: center;">
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

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state-box">
          <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--text-primary, #8a7051); margin-bottom: 12px;"></i>
          <div style="font-family: monospace; letter-spacing: 1px;">MEMUAT_DATA_LAYANAN...</div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredServicesList.length === 0" class="services-empty-box">
          <div style="opacity: 0.5; margin-bottom: 12px; font-size: 2.8rem; color: var(--text-primary, #8a7051);">
            <i class="fas fa-box-open"></i>
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">Tidak Ada Layanan Ditemukan</h3>
          <p style="color: #6b7280; font-size: 0.9rem; max-width: 450px; margin: 0 auto 15px auto;">
            {{ servicesList.length === 0 ? 'Belum ada katalog layanan. Silakan tambahkan layanan baru atau muat data contoh.' : 'Tidak ada layanan yang cocok dengan pencarian / filter Anda.' }}
          </p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button v-if="servicesList.length === 0" @click="triggerSeedServices" class="btn-submit" style="width:auto; padding: 8px 18px;">
              <i class="fas fa-database"></i> Muat Data Contoh
            </button>
            <button v-else @click="resetFilters" class="btn-cancel" style="width:auto; padding: 8px 18px;">
              <i class="fas fa-undo"></i> Reset Filter
            </button>
          </div>
        </div>

        <!-- VIEW MODE 1: MODERN GRID CARDS (DEFAULT & RESPONSIVE) -->
        <div v-else-if="viewMode === 'grid'" class="services-admin-grid">
          <div 
            v-for="item in filteredServicesList" 
            :key="item.id || item.title" 
            class="service-admin-card"
            :class="{ 'is-card-inactive': item.is_active === false }"
          >
            <!-- Card Image Cover -->
            <div class="service-card-cover">
              <img 
                v-if="item.image" 
                :src="item.image" 
                :alt="item.title" 
                class="service-cover-img" 
                loading="lazy" 
              />
              <div v-else class="service-cover-placeholder">
                <i class="fas fa-image"></i>
              </div>

              <!-- Overlay Badges -->
              <div class="cover-top-badges">
                <span class="card-cat-badge">
                  <i class="fas fa-tag"></i> {{ item.category || 'Lainnya' }}
                </span>
                
                <button 
                  @click="toggleServiceStatus(item)"
                  :class="['card-status-badge', item.is_active !== false ? 'status-active' : 'status-inactive']"
                  :title="item.is_active !== false ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'"
                >
                  <i :class="['fas', item.is_active !== false ? 'fa-check-circle' : 'fa-times-circle']"></i>
                  {{ item.is_active !== false ? 'Aktif' : 'Off' }}
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="service-card-body">
              <div class="card-title-price-row">
                <h3 class="service-card-title">{{ item.title }}</h3>
                <span class="service-price-chip">{{ item.price || 'Sesuai Request' }}</span>
              </div>

              <p class="service-card-desc">
                {{ item.description || 'Tidak ada deskripsi layanan.' }}
              </p>

              <!-- Tags / Features -->
              <div class="card-tags-list">
                <span 
                  v-for="(tag, idx) in parseTags(item.tags)" 
                  :key="idx" 
                  class="card-tag-pill"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Card Footer & Actions -->
            <div class="service-card-footer">
              <span class="order-seq-badge" title="Urutan Tampilan">
                #{{ item.order_num || 0 }}
              </span>

              <div class="card-action-btns">
                <a 
                  :href="item.link || `/checkout?service=${encodeURIComponent(item.title)}`" 
                  target="_blank" 
                  class="btn-icon-action shop-link-btn" 
                  title="Lihat Link Pemesanan"
                >
                  <i class="fas fa-shopping-cart"></i>
                </a>

                <button 
                  @click="startEditService(item)" 
                  class="btn-edit-action" 
                  title="Edit Layanan"
                >
                  <i class="fas fa-edit"></i> Edit
                </button>

                <button 
                  @click="deleteServiceItem(item)" 
                  class="btn-icon-action delete-btn" 
                  title="Hapus Layanan"
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
                  <th style="width: 70px;">Gambar</th>
                  <th>Layanan & Tag</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Deskripsi</th>
                  <th style="width: 90px; text-align: center;">Status</th>
                  <th style="width: 160px; text-align: center;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredServicesList" :key="item.id || item.title">
                  <td data-label="Gambar">
                    <div class="service-table-img-wrap">
                      <img v-if="item.image" :src="item.image" :alt="item.title" class="service-table-img" loading="lazy" />
                      <div v-else class="service-table-img-placeholder"><i class="fas fa-image"></i></div>
                    </div>
                  </td>
                  <td data-label="Layanan">
                    <div style="font-weight:bold; color: var(--text-primary); font-size: 0.95rem;">{{ item.title }}</div>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px;">
                      <span v-for="(tag, idx) in parseTags(item.tags)" :key="idx" class="card-tag-pill" style="font-size: 0.7rem; padding: 2px 6px;">{{ tag }}</span>
                    </div>
                  </td>
                  <td data-label="Kategori">
                    <span class="card-cat-badge" style="position: static; font-size: 0.78rem;">{{ item.category || 'Lainnya' }}</span>
                  </td>
                  <td data-label="Harga">
                    <span style="font-weight: 600; color: #25d366; font-size: 0.85rem;">{{ item.price || 'Sesuai Request' }}</span>
                  </td>
                  <td data-label="Deskripsi" style="font-size:0.8rem; max-width:260px; white-space:normal; opacity: 0.85;">
                    {{ item.description || '-' }}
                  </td>
                  <td data-label="Status" style="text-align: center;">
                    <button 
                      @click="toggleServiceStatus(item)" 
                      :class="['card-status-badge', item.is_active !== false ? 'status-active' : 'status-inactive']"
                      style="position: static; display: inline-flex;"
                    >
                      <i :class="['fas', item.is_active !== false ? 'fa-check' : 'fa-times']"></i>
                      {{ item.is_active !== false ? 'Aktif' : 'Off' }}
                    </button>
                  </td>
                  <td data-label="Aksi" style="text-align: center;">
                    <div style="display:flex; gap:6px; justify-content: center; flex-wrap: wrap;">
                      <a :href="item.link || `/checkout?service=${encodeURIComponent(item.title)}`" target="_blank" class="btn-icon-action shop-link-btn" title="Link Pemesanan">
                        <i class="fas fa-shopping-cart"></i>
                      </a>
                      <button @click="startEditService(item)" class="btn-edit-action" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteServiceItem(item)" class="btn-icon-action delete-btn" title="Hapus">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ================= TAB 2: CATEGORIES MANAGEMENT ================= -->
      <div v-if="activeTab === 'categories'">
        <div class="categories-layout-grid">
          
          <!-- Category Add / Edit Form Card -->
          <div class="crud-form-card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <h3 class="form-title" style="font-size:1.05rem; margin: 0;">
                {{ isEditingCategory ? '// EDIT_KATEGORI' : '// TAMBAH_KATEGORI_BARU' }}
              </h3>
              <span v-if="isEditingCategory" class="order-seq-badge">Mode Edit</span>
            </div>
            
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
                  style="max-width: 140px;"
                />
              </div>

              <div style="display:flex; gap:10px; margin-top: 10px;">
                <button type="submit" class="btn-submit" style="width: auto; padding: 10px 22px;">
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

          <!-- Categories List (Responsive Cards) -->
          <div class="crud-form-card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <h3 class="form-title" style="font-size:1.05rem; margin: 0;">
                // DAFTAR_KATEGORI_TERDAFTAR ({{ categoriesList.length }})
              </h3>
            </div>
            
            <div v-if="categoriesList.length === 0" style="text-align: center; padding: 40px; color: #6b7280;">
              Belum ada kategori tersimpan. Silakan isi form di sebelah kiri untuk menambah kategori baru.
            </div>

            <div v-else class="categories-cards-list">
              <div 
                v-for="cat in categoriesList" 
                :key="cat.id || cat.name" 
                class="category-item-card"
              >
                <div class="cat-item-left">
                  <div class="cat-icon-box">
                    <i class="fas fa-folder"></i>
                  </div>
                  <div>
                    <div class="cat-name-text">{{ cat.name }}</div>
                    <div class="cat-slug-text">slug: {{ cat.slug }}</div>
                    <p v-if="cat.description" class="cat-desc-text">{{ cat.description }}</p>
                  </div>
                </div>

                <div class="cat-item-right">
                  <span class="cat-count-badge">
                    {{ getServicesCountByCategory(cat.name) }} Layanan
                  </span>
                  
                  <div style="display: flex; gap: 6px;">
                    <button @click="startEditCategory(cat)" class="btn-edit-action" title="Edit Kategori">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button @click="deleteCategory(cat)" class="btn-icon-action delete-btn" title="Hapus Kategori">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= MODAL: ADD / EDIT SERVICE ================= -->
      <div v-if="showServiceModal" class="modal-backdrop" @click.self="closeServiceModal">
        <div class="crud-form-card modal-content animate-scale" style="max-width: 680px; max-height: 90vh; overflow-y: auto; padding: 28px;">
          <button type="button" class="modal-close-btn" @click="closeServiceModal" aria-label="Close modal">&times;</button>
          
          <h3 class="form-title" style="font-size:1.2rem; margin-bottom: 20px;">
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

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label>Kategori *</label>
                <select v-model="serviceForm.category" required class="form-control">
                  <option disabled value="">Pilih Kategori</option>
                  <option v-for="cat in categoriesList" :key="cat.id || cat.name" :value="cat.name">
                    {{ cat.name }}
                  </option>
                </select>
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
              <label>Gambar Layanan (URL atau Upload Langsung)</label>
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
              <div v-if="serviceForm.image" style="margin-top: 10px; display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px;">
                <img :src="serviceForm.image" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);" />
                <div style="font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                  <span style="color: #25d366;"><i class="fas fa-check-circle"></i> Gambar Terpasang</span>
                </div>
                <button type="button" @click="serviceForm.image = ''" class="btn-icon-action delete-btn" style="padding: 4px 8px; font-size: 0.75rem;">
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

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
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

      <!-- Back Link -->
      <div style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/shop" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.75rem; letter-spacing: 1px;">
          <i class="fas fa-external-link-alt"></i> Back to Public Site
        </NuxtLink>
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

// View Mode: 'grid' (default) | 'table'
const viewMode = ref('grid')

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

const sqlServicesScript = `-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  order_num integer DEFAULT 0
);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  tags text[] DEFAULT '{}'::text[],
  price text,
  link text,
  is_active boolean DEFAULT true,
  order_num integer DEFAULT 0
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for public access (Anon key)
CREATE POLICY "Allow public read access for service_categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for service_categories" ON public.service_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access for service_categories" ON public.service_categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access for service_categories" ON public.service_categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access for services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access for services" ON public.services FOR DELETE USING (true);

-- 5. Seed initial service categories
INSERT INTO public.service_categories (name, slug, description, order_num) VALUES
  ('Graphic Design', 'graphic-design', 'Desain grafis, logo branding, identitas visual', 1),
  ('Merchandise & Print', 'merchandise-print', 'Desain kaos, merchandise, stiker, mug, cetak', 2),
  ('Social Media', 'social-media', 'Feed Instagram, reels, dan konten visual media sosial', 3),
  ('Web Development', 'web-development', 'Pembuatan website profesional, responsif & modern', 4),
  ('Multimedia & Fotografi', 'multimedia-fotografi', 'Jasa fotografi, video editing & multimedia', 5),
  ('Lainnya', 'lainnya', 'Layanan kustom lainnya sesuai kebutuhan klien', 6)
ON CONFLICT (name) DO NOTHING;

-- 6. Seed initial services
INSERT INTO public.services (title, category, description, image, tags, price, link, is_active, order_num) VALUES
  ('Desain Logo', 'Graphic Design', 'Pembuatan logo profesional yang mencerminkan identitas bisnis Anda dengan desain yang unik dan memorable.', 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000', ARRAY['Custom Design', 'Multiple Revisions', 'Vector Format', 'Start From 100k'], 'Start From 100k', '/checkout?service=Desain Logo', true, 1),
  ('Desain Kaos', 'Merchandise & Print', 'Desain kaos kreatif untuk brand personal, acara, atau bisnis dengan pilihan style yang beragam.', 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000', ARRAY['Desain Kustom', 'Mockup Preview', 'Start From 100k'], 'Start From 100k', '/checkout?service=Desain Kaos', true, 2),
  ('Feed Instagram', 'Social Media', 'Desain feed Instagram yang aesthetic dan konsisten untuk meningkatkan visual branding akun Anda.', 'https://lh3.googleusercontent.com/d/1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4=w1000', ARRAY['Grid Layout', 'Tema Konsisten', 'HD Resolution', 'Start From 50k'], 'Start From 50k', '/checkout?service=Feed Instagram', true, 3),
  ('Desain Stiker', 'Merchandise & Print', 'Desain stiker unik dan eye-catching untuk produk, merchandise, atau keperluan promosi bisnis.', 'https://lh3.googleusercontent.com/d/1pkCZDxiUV-_ylQEw0A_Ce6GwyF2S_P22=w1000', ARRAY['Custom Design', 'Berbagai Ukuran', 'Print Ready', 'Start From 40k'], 'Start From 40k', '/checkout?service=Desain Stiker', true, 4),
  ('Desain Mug', 'Merchandise & Print', 'Desain mug berkualitas untuk merchandise, hadiah, atau koleksi pribadi dengan hasil print yang sempurna.', 'https://lh3.googleusercontent.com/d/10mS9Kp2baYjRZtwHcJB-VgRlGF4QE-31=w1000', ARRAY['Custom Design', 'Mockup Preview', 'Start From 50k'], 'Start From 50k', '/checkout?service=Desain Mug', true, 5),
  ('Desain Lanyard', 'Merchandise & Print', 'Desain lanyard profesional untuk acara, identitas karyawan, atau merchandise dengan detail yang sempurna.', 'https://lh3.googleusercontent.com/d/1hI8tTrLVQALecjtQeFcT5fxxo3I1eu-9=w1000', ARRAY['Custom Design', 'Berbagai Material', 'Print Ready', 'Start From 50k'], 'Start From 50k', '/checkout?service=Desain Lanyard', true, 6),
  ('Desain ID Card', 'Merchandise & Print', 'Desain kartu identitas profesional untuk perusahaan, sekolah, atau organisasi dengan standar kualitas tinggi.', 'https://lh3.googleusercontent.com/d/1l8B6QSJLEAy7zt-Ve87moX_94ORm3IuX=w1000', ARRAY['Custom Design', 'PVC Material', 'Print Ready', 'Start From 20k'], 'Start From 20k', '/checkout?service=Desain ID Card', true, 7),
  ('Pembuatan Website', 'Web Development', 'Pengembangan website profesional menggunakan teknologi terkini untuk memberikan pengalaman pengguna terbaik.', 'https://lh3.googleusercontent.com/d/1f07kczRvgEMIxRP-VRnkAx4cjG_8-dnX=w1000', ARRAY['Responsive Design', 'SEO Optimized', 'Full Support', 'Start From 5jt'], 'Start From 5jt', '/checkout?service=Pembuatan Website', true, 8),
  ('Fotografi', 'Multimedia & Fotografi', 'Jasa fotografi profesional untuk acara, produk, atau keperluan komersial dengan hasil berkualitas tinggi.', 'https://lh3.googleusercontent.com/d/1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc=w1000', ARRAY['Foto & Editing', 'Profesional', 'Berbagai Paket', 'Start From 300k'], 'Start From 300k', '/checkout?service=Fotografi', true, 9),
  ('Desain Cover Buku', 'Graphic Design', 'Desain cover buku yang menarik dan profesional untuk merepresentasikan isi cerita atau materi buku Anda.', 'https://lh3.googleusercontent.com/d/1CEgGGx3TLvtYUWR4a0QCRHX7_YeRFHYc=w1000', ARRAY['Custom Design', '3D Mockup', 'Print Ready', 'Start From 50k'], 'Start From 50k', '/checkout?service=Desain Cover Buku', true, 10);
`

const copySqlScript = async () => {
  try {
    await navigator.clipboard.writeText(sqlServicesScript)
    alert('Skrip SQL berhasil disalin ke clipboard! Silakan buka Supabase Dashboard -> SQL Editor, tempel (paste) skrip tersebut lalu klik tombol RUN.')
  } catch {
    alert('Silakan salin skrip SQL dari file schema.sql.')
  }
}

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

.stat-widget-val.shop-link-val {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #60a5fa;
  margin-top: 4px;
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

.public-shop-link {
  font-size: 0.92rem;
  font-weight: bold;
  color: var(--text-primary, #8a7051);
  text-decoration: none;
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s;
}

.public-shop-link:hover {
  opacity: 0.8;
}

/* Tab Navigation */
.tab-nav-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  overflow-x: auto;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 18px;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
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

/* Loading & Empty Box */
.loading-state-box, .services-empty-box {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(197, 168, 128, 0.2);
  border-radius: 14px;
}

/* ================= SERVICES ADMIN GRID ================= */
.services-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .services-admin-grid {
    grid-template-columns: 1fr;
  }
}

/* Individual Service Admin Card */
.service-admin-card {
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

body.dark-mode .service-admin-card {
  background: #141414;
  border-color: rgba(197, 168, 128, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.service-admin-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-color: rgba(197, 168, 128, 0.4);
}

body.dark-mode .service-admin-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-color: rgba(197, 168, 128, 0.4);
}

.service-admin-card.is-card-inactive {
  opacity: 0.7;
  filter: grayscale(0.3);
}

/* Service Card Cover */
.service-card-cover {
  position: relative;
  width: 100%;
  height: 180px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.service-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.service-admin-card:hover .service-cover-img {
  transform: scale(1.04);
}

.service-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 2.2rem;
  background: rgba(255, 255, 255, 0.03);
}

/* Cover Overlay Badges */
.cover-top-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.card-cat-badge {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  letter-spacing: 0.4px;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.card-status-badge {
  pointer-events: auto;
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
  backdrop-filter: blur(4px);
}

.card-status-badge.status-active {
  background: rgba(16, 185, 129, 0.9);
  color: #ffffff;
}

.card-status-badge.status-inactive {
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
}

.card-status-badge:hover {
  filter: brightness(1.15);
  transform: scale(1.05);
}

/* Card Body */
.service-card-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.card-title-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.service-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary, #8a7051);
  line-height: 1.35;
}

body.dark-mode .service-card-title {
  color: #ffffff;
}

.service-price-chip {
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.25);
  color: #25d366;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.service-card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary, #4b5563);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.85;
}

body.dark-mode .service-card-desc {
  color: rgba(255, 255, 255, 0.7);
}

/* Card Tags */
.card-tags-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 6px;
}

.card-tag-pill {
  font-size: 0.72rem;
  padding: 3px 8px;
  background: rgba(138, 112, 81, 0.12);
  color: var(--text-primary, #8a7051);
  border: 1px solid rgba(138, 112, 81, 0.2);
  border-radius: 4px;
  letter-spacing: 0.3px;
}

body.dark-mode .card-tag-pill {
  background: rgba(255, 255, 255, 0.05);
  color: #c5a880;
  border-color: rgba(255, 255, 255, 0.08);
}

/* Card Footer */
.service-card-footer {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

body.dark-mode .service-card-footer {
  background: rgba(255, 255, 255, 0.02);
}

.order-seq-badge {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 7px;
  border-radius: 4px;
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
  font-size: 0.85rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon-action:hover {
  background: rgba(138, 112, 81, 0.15);
  color: var(--text-primary, #8a7051);
  transform: translateY(-1px);
}

.btn-icon-action.shop-link-btn {
  color: #00d1ff;
  border-color: rgba(0, 209, 255, 0.25);
  background: rgba(0, 209, 255, 0.08);
}

.btn-icon-action.shop-link-btn:hover {
  background: rgba(0, 209, 255, 0.2);
  border-color: #00d1ff;
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

.btn-edit-action {
  background: var(--text-primary, #8a7051);
  color: #ffffff;
  border: 1px solid var(--text-primary, #8a7051);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.btn-edit-action:hover {
  filter: brightness(1.15);
  transform: translateY(-1px);
}

/* ================= CATEGORIES SECTION ================= */
.categories-layout-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .categories-layout-grid {
    grid-template-columns: 1fr;
  }
}

.categories-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  gap: 15px;
  flex-wrap: wrap;
  transition: all 0.2s ease;
}

.category-item-card:hover {
  border-color: rgba(197, 168, 128, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.cat-item-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 200px;
}

.cat-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(138, 112, 81, 0.15);
  color: var(--text-primary, #8a7051);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.cat-name-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary, #8a7051);
}

body.dark-mode .cat-name-text {
  color: #ffffff;
}

.cat-slug-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.cat-desc-text {
  font-size: 0.78rem;
  opacity: 0.75;
  margin: 3px 0 0 0;
  line-height: 1.35;
}

.cat-item-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.cat-count-badge {
  background: rgba(197, 168, 128, 0.15);
  color: var(--text-primary, #8a7051);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

body.dark-mode .cat-count-badge {
  color: #c5a880;
}

/* Table image styles */
.service-table-img-wrap {
  width: 46px;
  height: 46px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-table-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-table-img-placeholder {
  color: #6b7280;
  font-size: 1.1rem;
}
</style>
