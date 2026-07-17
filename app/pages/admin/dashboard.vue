<template>
  <div id="adminDashboard">
    <div class="container" style="padding-top: 120px; max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px;">
        <div class="section-tag">// COMMAND_CENTER</div>
        <h1 class="section-title">Dashboard <span>Project</span></h1>
      </div>

      <!-- TAB 1: ORDERS -->
      <div v-if="activeAdminTab === 'orders'">
        <!-- Stats Summary -->
        <div class="stats-grid">
          <div class="stat-card">
            <h3>TOTAL_PROJECT</h3>
            <div class="stat-value">{{ statTotal }}</div>
          </div>
          <div class="stat-card">
            <h3>BELUM_DP / UNPAID</h3>
            <div class="stat-value">{{ statUnpaid }}</div>
          </div>
          <div class="stat-card">
            <h3>LUNAS / PAID</h3>
            <div class="stat-value">{{ statPaid }}</div>
          </div>
          <div class="stat-card">
            <h3>SELESAI / COMPLETED</h3>
            <div class="stat-value" style="color: #05df72;">{{ statCompleted }}</div>
          </div>
        </div>

        <!-- Table Section -->
        <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Layanan</th>
                <th>Klien</th>
                <th>WhatsApp</th>
                <th>Catatan</th>
                <th>Status</th>
                <th>Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="8" style="text-align:center; padding: 40px;">ACCESSING_DATABASE...</td>
              </tr>
              <tr v-else-if="errorMsg">
                <td colspan="8" style="text-align:center; color: red; padding: 40px;">ERROR: {{ errorMsg }}</td>
              </tr>
              <tr v-else-if="orders.length === 0">
                <td colspan="8" style="text-align:center; padding: 40px;">NO_DATA_FOUND</td>
              </tr>
              <tr v-else v-for="order in orders" :key="order.id">
                <td data-label="Tanggal">{{ new Date(order.created_at).toLocaleDateString() }}</td>
                <td data-label="Layanan" style="color: var(--text-primary)">{{ order.order_type }}</td>
                <td data-label="Klien">
                  {{ order.client_name }}<br>
                  <small style="opacity:0.5">{{ order.client_email }}</small>
                </td>
                <td data-label="WhatsApp">
                  <a :href="'https://wa.me/' + order.client_whatsapp" target="_blank" style="color: #25D366; text-decoration:none">
                    <i class="fab fa-whatsapp"></i> {{ order.client_whatsapp }}
                  </a>
                </td>
                <td data-label="Catatan" style="font-size: 0.8rem; max-width: 200px; white-space: normal;">
                  {{ order.order_notes || '-' }}
                </td>
                <td data-label="Status">
                  <select 
                    @change="updateOrderStatus(order.id, $event.target.value)" 
                    :class="['status-select', order.status]"
                  >
                    <option value="pending" :selected="order.status === 'pending'">Pending</option>
                    <option value="in-progress" :selected="order.status === 'in-progress'">In Progress</option>
                    <option value="completed" :selected="order.status === 'completed'">Completed</option>
                  </select>
                </td>
                <td data-label="Pembayaran">
                  <select 
                    @change="updatePaymentStatus(order.id, $event.target.value)" 
                    :class="['status-badge', order.payment_status]" 
                    style="border:none; cursor:pointer;"
                  >
                    <option value="unpaid" :selected="order.payment_status === 'unpaid'">Unpaid</option>
                    <option value="paid" :selected="order.payment_status === 'paid'">Paid</option>
                  </select>
                </td>
                <td data-label="Aksi">
                  <button @click="deleteOrder(order.id)" class="btn-delete" style="opacity:0.5; border:none; background:none; cursor:pointer;">
                    <i class="fas fa-trash" style="color: #ff0055;"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: PORTFOLIO -->
      <div v-if="activeAdminTab === 'portfolio'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
          <h2 class="form-title" style="margin:0">// MANAGEMENT_PORTFOLIO</h2>
          <div style="display:flex; gap:10px;">
            <button @click="triggerSeedPortfolio" class="btn-cancel" style="border-color:#00f3ff; color:#00f3ff; margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
            <button @click="showPortfolioForm = !showPortfolioForm" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
              {{ showPortfolioForm ? 'TUTUP FORM' : 'TAMBAH KARYA BARU' }}
            </button>
          </div>
        </div>

        <!-- Form container (collapsible) -->
        <div v-if="showPortfolioForm || isEditingPortfolio" class="crud-form-card" style="margin-bottom: 30px;">
          <h3 class="form-title" style="font-size:1.1rem; margin-bottom: 20px;">{{ isEditingPortfolio ? '// EDIT_PORTFOLIO_ITEM' : '// ADD_PORTFOLIO_ITEM' }}</h3>
          <form @submit.prevent="savePortfolio" class="admin-form">
            <div class="form-group">
              <label>Kategori</label>
              <select v-model="newPortfolio.category" class="form-control">
                <option value="Instagram">Feed Instagram (Embed)</option>
                <option value="Reels">Reels Instagram</option>
                <option value="Merchandise">Merchandise (Image)</option>
                <option value="Logo">Logo (Image)</option>
                <option value="Photography">Photography (Image)</option>
                <option value="Website">Website Project</option>
              </select>
            </div>

            <div class="form-group">
              <label>Judul Karya / Judul Website</label>
              <input type="text" v-model="newPortfolio.title" required placeholder="Contoh: Logo Cafe A" class="form-control" />
            </div>

            <div class="form-group">
              <label>Deskripsi (Untuk Website / Opsional)</label>
              <textarea v-model="newPortfolio.description" rows="3" placeholder="Deskripsi detail proyek..." class="form-control"></textarea>
            </div>

            <div class="form-group">
              <label>Image URL (Untuk Reels / Merch / Logo / Photo)</label>
              <input type="text" v-model="newPortfolio.image_url" placeholder="Contoh: https://lh3.googleusercontent.com/d/..." class="form-control" />
            </div>

            <!-- Upload File Cover / Image -->
            <div class="form-group" v-if="['Reels', 'Merchandise', 'Photography', 'Logo'].includes(newPortfolio.category)">
              <label>Atau Upload File Cover / Image (.jpg, .png)</label>
              <input type="file" @change="onFileChange" accept="image/png, image/jpeg, image/jpg" class="form-control" style="background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.15); padding: 8px;" />
              <div v-if="isUploading" style="font-size: 0.85rem; color: #00f3ff; margin-top: 5px;">
                <i class="fas fa-spinner fa-spin"></i> Sedang mengunggah gambar...
              </div>
            </div>

            <div class="form-group">
              <label>Link URL (Link Reels / Embed Instagram / Live Website)</label>
              <input type="text" v-model="newPortfolio.link_url" placeholder="Contoh: https://www.instagram.com/p/..." class="form-control" />
            </div>

            <div class="form-group">
              <label>Tech Tags (Khusus Website, pisahkan dengan koma)</label>
              <input type="text" v-model="newPortfolio.tags_string" placeholder="Vue, Nuxt, Node.js" class="form-control" />
            </div>

            <div style="display:flex; gap:10px;">
              <button type="submit" class="btn-submit" style="width: auto; padding: 10px 24px;">{{ isEditingPortfolio ? 'UPDATE KARYA' : 'SIMPAN KARYA' }}</button>
              <button type="button" @click="cancelEditPortfolio" class="btn-cancel" style="margin: 0; width: auto; padding: 10px 24px;">BATAL</button>
            </div>
          </form>
        </div>

        <!-- Filter & Table List -->
        <div class="filter-bar" style="margin-bottom:20px;">
          <select v-model="portfolioFilter" class="form-control" style="max-width: 200px;">
            <option value="ALL">Semua Kategori</option>
            <option value="Instagram">Instagram</option>
            <option value="Reels">Reels</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Logo">Logo</option>
            <option value="Photography">Photography</option>
            <option value="Website">Website</option>
          </select>
        </div>

        <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Link / File</th>
                <th style="width:220px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="portfolioList.length === 0">
                <td colspan="6" style="text-align:center; padding:40px;">PORTFOLIO_DATABASE_EMPTY. Silakan muat "LOAD EXAMPLE DATA" untuk mengisi data bawaan.</td>
              </tr>
              <tr v-else v-for="item in filteredPortfolioList" :key="item.id">
                <td data-label="Preview">
                  <img v-if="item.image_url" :src="item.image_url" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.1);" />
                  <span v-else style="opacity:0.3">-</span>
                </td>
                <td data-label="Judul" style="font-weight:bold; color: #00f3ff;">{{ item.title }}</td>
                <td data-label="Kategori"><span class="meta-tag" style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius:4px;">{{ item.category }}</span></td>
                <td data-label="Deskripsi" style="font-size:0.8rem; max-width:250px; white-space:normal;">{{ item.description || '-' }}</td>
                <td data-label="Link / File" style="font-size:0.8rem; max-width:150px; overflow:hidden; text-overflow:ellipsis;">
                  <a v-if="item.link_url" :href="item.link_url" target="_blank" style="color:#00f3ff; text-decoration:none;">{{ item.link_url }}</a>
                  <span v-else>-</span>
                </td>
                <td data-label="Aksi">
                  <div style="display:flex; gap:8px;">
                    <a v-if="item.link_url || item.image_url" :href="item.link_url || item.image_url" target="_blank" class="btn-edit-item" style="text-decoration:none; text-align:center; background: rgba(0,243,255,0.05);">
                      <i class="fas fa-eye"></i> Lihat
                    </a>
                    <button @click="startEditPortfolio(item)" class="btn-edit-item">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button @click="deletePortfolioItem(item.id)" class="btn-delete-item">
                      <i class="fas fa-trash"></i> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: TESTIMONIALS -->
      <div v-if="activeAdminTab === 'testimonials'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
          <h2 class="form-title" style="margin:0">// MANAGEMENT_TESTIMONIALS</h2>
          <div style="display:flex; gap:10px;">
            <button @click="triggerSeedTestimonials" class="btn-cancel" style="border-color:#00f3ff; color:#00f3ff; margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
            <button @click="showTestimonialForm = !showTestimonialForm" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
              {{ showTestimonialForm ? 'TUTUP FORM' : 'TAMBAH TESTIMONI BARU' }}
            </button>
          </div>
        </div>

        <div v-if="showTestimonialForm || isEditingTestimonial" class="crud-form-card" style="margin-bottom: 30px;">
          <h3 class="form-title" style="font-size:1.1rem; margin-bottom: 20px;">{{ isEditingTestimonial ? '// EDIT_TESTIMONIAL' : '// ADD_TESTIMONIAL' }}</h3>
          <form @submit.prevent="saveTestimonial" class="admin-form">
            <div class="form-group">
              <label>Nama Klien</label>
              <input type="text" v-model="newTestimonial.name" required placeholder="Contoh: Agna Nia" class="form-control" />
            </div>

            <div class="form-group">
              <label>Jabatan / Perusahaan Klien</label>
              <input type="text" v-model="newTestimonial.role" required placeholder="Contoh: Founder Ermora" class="form-control" />
            </div>

            <div class="form-group">
              <label>Avatar Image URL (Opsional)</label>
              <input type="text" v-model="newTestimonial.avatar_url" placeholder="Contoh: https://lh3.googleusercontent.com/..." class="form-control" />
            </div>

            <!-- Upload Avatar File -->
            <div class="form-group">
              <label>Atau Upload Avatar (.jpg, .png)</label>
              <input type="file" @change="onAvatarFileChange" accept="image/png, image/jpeg, image/jpg" class="form-control" style="background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.15); padding: 8px;" />
              <div v-if="isUploadingAvatar" style="font-size: 0.85rem; color: #00f3ff; margin-top: 5px;">
                <i class="fas fa-spinner fa-spin"></i> Sedang mengunggah avatar...
              </div>
            </div>

            <div class="form-group">
              <label>Rating Bintang</label>
              <select v-model="newTestimonial.rating" class="form-control">
                <option :value="5">5 Bintang</option>
                <option :value="4">4 Bintang</option>
                <option :value="3">3 Bintang</option>
                <option :value="2">2 Bintang</option>
                <option :value="1">1 Bintang</option>
              </select>
            </div>

            <div class="form-group">
              <label>Pesan Ulasan / Testimoni</label>
              <textarea v-model="newTestimonial.body" required rows="4" placeholder="Tulis ulasan klien di sini..." class="form-control"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
              <button type="submit" class="btn-submit" style="width: auto; padding: 10px 24px;">{{ isEditingTestimonial ? 'UPDATE TESTIMONI' : 'SIMPAN TESTIMONI' }}</button>
              <button type="button" @click="cancelEditTestimonial" class="btn-cancel" style="margin: 0; width: auto; padding: 10px 24px;">BATAL</button>
            </div>
          </form>
        </div>

        <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Klien</th>
                <th>Jabatan/Perusahaan</th>
                <th>Rating</th>
                <th>Ulasan</th>
                <th style="width:150px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="testimonialList.length === 0">
                <td colspan="6" style="text-align:center; padding:40px;">TESTIMONIAL_DATABASE_EMPTY. Silakan tambahkan baru.</td>
              </tr>
              <tr v-else v-for="t in testimonialList" :key="t.id">
                <td data-label="Avatar">
                  <img v-if="t.avatar_url" :src="t.avatar_url" style="width:40px; height:40px; object-fit:cover; border-radius:50%; border:1px solid rgba(255,255,255,0.1);" />
                  <i v-else class="fas fa-user-circle" style="font-size:24px; opacity:0.3;"></i>
                </td>
                <td data-label="Klien" style="font-weight:bold; color: #00f3ff;">{{ t.name }}</td>
                <td data-label="Jabatan/Perusahaan">{{ t.role }}</td>
                <td data-label="Rating">
                  <span style="color:#ffd700">★</span> {{ t.rating }}/5
                </td>
                <td data-label="Ulasan" style="font-size:0.8rem; max-width:300px; white-space:normal;">{{ t.body }}</td>
                <td data-label="Aksi">
                  <div style="display:flex; gap:8px;">
                    <button @click="startEditTestimonial(t)" class="btn-edit-item">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button @click="deleteTestimonialItem(t.id)" class="btn-delete-item">
                      <i class="fas fa-trash"></i> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: RESUME -->
      <div v-if="activeAdminTab === 'resume'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
          <h2 class="form-title" style="margin:0">// MANAGEMENT_RESUME</h2>
          <div style="display:flex; gap:10px;">
            <button @click="triggerSeedResume" class="btn-cancel" style="border-color:#00f3ff; color:#00f3ff; margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
            <button @click="showResumeForm = !showResumeForm" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
              {{ showResumeForm ? 'TUTUP FORM' : 'TAMBAH TIMELINE BARU' }}
            </button>
          </div>
        </div>

        <div v-if="showResumeForm || isEditingResume" class="crud-form-card" style="margin-bottom: 30px;">
          <h3 class="form-title" style="font-size:1.1rem; margin-bottom: 20px;">{{ isEditingResume ? '// EDIT_TIMELINE_ITEM' : '// ADD_TIMELINE_ITEM' }}</h3>
          <form @submit.prevent="saveResume" class="admin-form">
            <div class="form-group">
              <label>Kategori Tab</label>
              <select v-model="newResume.tab" class="form-control">
                <option value="biography">Internship / Biography</option>
                <option value="organization">Organization</option>
                <option value="education">Education</option>
                <option value="job">Job / Work Experience</option>
              </select>
            </div>

            <div class="form-group">
              <label>Nama Lembaga / Perusahaan</label>
              <input type="text" v-model="newResume.title" required placeholder="Contoh: Universitas Nahdlatul Ulama" class="form-control" />
            </div>

            <div class="form-group">
              <label>Jabatan / Peran / Jurusan</label>
              <input type="text" v-model="newResume.role" placeholder="Contoh: Informatika / Desain Grafis" class="form-control" />
            </div>

            <div class="form-group">
              <label>Periode Waktu</label>
              <input type="text" v-model="newResume.period" required placeholder="Contoh: 2022–2023 | Februari 2026 - Sekarang" class="form-control" />
            </div>

            <div class="form-group">
              <label>Deskripsi Detail Kegiatan</label>
              <textarea v-model="newResume.description" rows="4" placeholder="Tuliskan deskripsi peran dan kontribusi Anda..." class="form-control"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
              <button type="submit" class="btn-submit" style="width: auto; padding: 10px 24px;">{{ isEditingResume ? 'UPDATE TIMELINE' : 'SIMPAN TIMELINE' }}</button>
              <button type="button" @click="cancelEditResume" class="btn-cancel" style="margin: 0; width: auto; padding: 10px 24px;">BATAL</button>
            </div>
          </form>
        </div>

        <div class="filter-bar" style="margin-bottom:20px;">
          <select v-model="resumeFilter" class="form-control" style="max-width: 200px;">
            <option value="ALL">Semua Kategori</option>
            <option value="biography">Internship</option>
            <option value="organization">Organization</option>
            <option value="education">Education</option>
            <option value="job">Job</option>
          </select>
        </div>

        <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Lembaga/Perusahaan</th>
                <th>Jabatan/Peran</th>
                <th>Kategori Tab</th>
                <th>Periode</th>
                <th>Deskripsi</th>
                <th style="width:150px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="resumeList.length === 0">
                <td colspan="6" style="text-align:center; padding:40px;">RESUME_DATABASE_EMPTY. Silakan tambahkan baru.</td>
              </tr>
              <tr v-else v-for="item in filteredResumeList" :key="item.id">
                <td data-label="Lembaga/Perusahaan" style="font-weight:bold; color: #00f3ff;">{{ item.title }}</td>
                <td data-label="Jabatan/Peran">{{ item.role || '-' }}</td>
                <td data-label="Kategori Tab" style="text-transform:uppercase; font-size:0.75rem;">{{ item.tab }}</td>
                <td data-label="Periode">{{ item.period }}</td>
                <td data-label="Deskripsi" style="font-size:0.8rem; max-width:300px; white-space:normal;">{{ item.description || '-' }}</td>
                <td data-label="Aksi">
                  <div style="display:flex; gap:8px;">
                    <button @click="startEditResume(item)" class="btn-edit-item">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button @click="deleteResumeItem(item.id)" class="btn-delete-item">
                      <i class="fas fa-trash"></i> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 5: ABOUT ME -->
      <div v-if="activeAdminTab === 'about'" class="about-edit-layout">
        <h2 class="form-title">// UPDATE_ABOUT_ME_INFO</h2>
        <form @submit.prevent="saveAboutMe" class="admin-form">
          <div class="form-group">
            <label>BACKGROUND_LORE (Tentang Saya - Lore Dasar)</label>
            <textarea v-model="aboutMeData.background.content" required rows="6" class="form-control" placeholder="Tuliskan latar belakang profil Anda..."></textarea>
          </div>

          <div class="form-group" style="margin-top: 30px;">
            <label>TECHNICAL_SKILLS (Tentang Saya - Kemampuan Teknis)</label>
            <textarea v-model="aboutMeData.skills.content" required rows="6" class="form-control" placeholder="Tuliskan penjelasan tentang kemampuan dan keahlian Anda..."></textarea>
          </div>

          <button type="submit" class="btn-submit" style="max-width: 300px; margin-top: 30px;">SIMPAN PERUBAHAN</button>
        </form>
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

// Shared active tab state from AdminHeader navbar selection
const activeAdminTab = useState('active-admin-tab', () => 'orders')

// Form visibility states
const showPortfolioForm = ref(false)
const showTestimonialForm = ref(false)
const showResumeForm = ref(false)

// Orders variables & operations
const orders = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const statTotal = computed(() => orders.value.length)
const statUnpaid = computed(() => orders.value.filter(o => o.payment_status === 'unpaid').length)
const statPaid = computed(() => orders.value.filter(o => o.payment_status === 'paid').length)
const statCompleted = computed(() => orders.value.filter(o => o.status === 'completed').length)

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

const updateOrderStatus = async (id, status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Update failed: ' + err.message)
  }
}

const updatePaymentStatus = async (id, payment_status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Update failed: ' + err.message)
  }
}

const deleteOrder = async (id) => {
  if (!confirm('DELETE_ORDER_PERMANENTLY?')) return
  
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Delete failed: ' + err.message)
  }
}

// Portfolio variables & Full CRUD Operations
const portfolioList = ref([])
const portfolioFilter = ref('ALL')
const isEditingPortfolio = ref(false)
const isUploading = ref(false)

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.statusMessage || 'Upload failed')
    }

    const result = await response.json()
    newPortfolio.value.image_url = result.url
    alert('Gambar cover berhasil diunggah!')
  } catch (err) {
    alert('Gagal mengunggah gambar: ' + err.message)
  } finally {
    isUploading.value = false
    // Reset file input value so same file can be re-selected if needed
    if (event.target) {
      event.target.value = ''
    }
  }
}
const editingPortfolioId = ref(null)
const newPortfolio = ref({
  category: 'Instagram',
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  tags_string: ''
})

const filteredPortfolioList = computed(() => {
  if (portfolioFilter.value === 'ALL') return portfolioList.value
  return portfolioList.value.filter(item => item.category === portfolioFilter.value)
})

const fetchPortfolio = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    portfolioList.value = data || []
  } catch (err) {
    console.error('Fetch portfolio failed:', err.message)
  }
}

const startEditPortfolio = (item) => {
  isEditingPortfolio.value = true
  editingPortfolioId.value = item.id
  showPortfolioForm.value = true
  newPortfolio.value = {
    category: item.category,
    title: item.title,
    description: item.description || '',
    image_url: item.image_url || '',
    link_url: item.link_url || '',
    tags_string: item.tags ? item.tags.join(', ') : ''
  }
}

const cancelEditPortfolio = () => {
  isEditingPortfolio.value = false
  editingPortfolioId.value = null
  showPortfolioForm.value = false
  newPortfolio.value = {
    category: 'Instagram',
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    tags_string: ''
  }
}

const formatImageOrMediaUrl = (url) => {
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
  if (url.includes('instagram.com')) {
    if (url.includes('/media/')) return url
    const matchInsta = url.match(/\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
    if (matchInsta && matchInsta[1]) {
      return `https://www.instagram.com/p/${matchInsta[1]}/media/?size=l`
    }
  }
  return url
}

const savePortfolio = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const tags = newPortfolio.value.tags_string 
      ? newPortfolio.value.tags_string.split(',').map(t => t.trim()) 
      : []
    const payload = {
      category: newPortfolio.value.category,
      title: newPortfolio.value.title,
      description: newPortfolio.value.description || null,
      image_url: formatImageOrMediaUrl(newPortfolio.value.image_url) || null,
      link_url: newPortfolio.value.link_url || null,
      tags
    }

    if (isEditingPortfolio.value) {
      const { error } = await $supabase
        .from('portfolio')
        .update(payload)
        .eq('id', editingPortfolioId.value)
      if (error) throw error
      alert('Karya berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('portfolio')
        .insert([payload])
      if (error) throw error
      alert('Karya berhasil ditambahkan!')
    }

    cancelEditPortfolio()
    await fetchPortfolio()
  } catch (err) {
    alert('Save portfolio failed: ' + err.message)
  }
}

const deletePortfolioItem = async (id) => {
  if (!confirm('DELETE_PORTFOLIO_ITEM_PERMANENTLY?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('portfolio').delete().eq('id', id)
    if (error) throw error
    if (isEditingPortfolio.value && editingPortfolioId.value === id) {
      cancelEditPortfolio()
    }
    await fetchPortfolio()
  } catch (err) {
    alert('Delete failed: ' + err.message)
  }
}

// Testimonials variables & Full CRUD Operations
const testimonialList = ref([])
const isEditingTestimonial = ref(false)
const isUploadingAvatar = ref(false)

const onAvatarFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.statusMessage || 'Upload failed')
    }

    const result = await response.json()
    newTestimonial.value.avatar_url = result.url
    alert('Avatar berhasil diunggah!')
  } catch (err) {
    alert('Gagal mengunggah avatar: ' + err.message)
  } finally {
    isUploadingAvatar.value = false
    if (event.target) {
      event.target.value = ''
    }
  }
}
const editingTestimonialId = ref(null)
const newTestimonial = ref({
  name: '',
  role: '',
  avatar_url: '',
  body: '',
  rating: 5
})

const fetchTestimonials = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    testimonialList.value = data || []
  } catch (err) {
    console.error('Fetch testimonials failed:', err.message)
  }
}

const startEditTestimonial = (item) => {
  isEditingTestimonial.value = true
  editingTestimonialId.value = item.id
  showTestimonialForm.value = true
  newTestimonial.value = {
    name: item.name,
    role: item.role,
    avatar_url: item.avatar_url || '',
    body: item.body,
    rating: item.rating
  }
}

const cancelEditTestimonial = () => {
  isEditingTestimonial.value = false
  editingTestimonialId.value = null
  showTestimonialForm.value = false
  newTestimonial.value = {
    name: '',
    role: '',
    avatar_url: '',
    body: '',
    rating: 5
  }
}

const saveTestimonial = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      name: newTestimonial.value.name,
      role: newTestimonial.value.role,
      avatar_url: formatImageOrMediaUrl(newTestimonial.value.avatar_url) || null,
      body: newTestimonial.value.body,
      rating: parseInt(newTestimonial.value.rating)
    }

    if (isEditingTestimonial.value) {
      const { error } = await $supabase
        .from('testimonials')
        .update(payload)
        .eq('id', editingTestimonialId.value)
      if (error) throw error
      alert('Testimoni berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('testimonials')
        .insert([payload])
      if (error) throw error
      alert('Testimoni berhasil ditambahkan!')
    }

    cancelEditTestimonial()
    await fetchTestimonials()
  } catch (err) {
    alert('Save testimonial failed: ' + err.message)
  }
}

const deleteTestimonialItem = async (id) => {
  if (!confirm('DELETE_TESTIMONIAL_PERMANENTLY?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('testimonials').delete().eq('id', id)
    if (error) throw error
    if (isEditingTestimonial.value && editingTestimonialId.value === id) {
      cancelEditTestimonial()
    }
    await fetchTestimonials()
  } catch (err) {
    alert('Delete failed: ' + err.message)
  }
}

// Resume variables & Full CRUD Operations
const resumeList = ref([])
const resumeFilter = ref('ALL')
const isEditingResume = ref(false)
const editingResumeId = ref(null)
const newResume = ref({
  tab: 'biography',
  title: '',
  role: '',
  period: '',
  description: ''
})

const filteredResumeList = computed(() => {
  if (resumeFilter.value === 'ALL') return resumeList.value
  return resumeList.value.filter(item => item.tab === resumeFilter.value)
})

const fetchResume = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('resume')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    resumeList.value = data || []
  } catch (err) {
    console.error('Fetch resume failed:', err.message)
  }
}

const startEditResume = (item) => {
  isEditingResume.value = true
  editingResumeId.value = item.id
  showResumeForm.value = true
  newResume.value = {
    tab: item.tab,
    title: item.title,
    role: item.role || '',
    period: item.period,
    description: item.description || ''
  }
}

const cancelEditResume = () => {
  isEditingResume.value = false
  editingResumeId.value = null
  showResumeForm.value = false
  newResume.value = {
    tab: 'biography',
    title: '',
    role: '',
    period: '',
    description: ''
  }
}

const saveResume = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const payload = {
      tab: newResume.value.tab,
      title: newResume.value.title,
      role: newResume.value.role || null,
      period: newResume.value.period,
      description: newResume.value.description || null
    }

    if (isEditingResume.value) {
      const { error } = await $supabase
        .from('resume')
        .update(payload)
        .eq('id', editingResumeId.value)
      if (error) throw error
      alert('Timeline berhasil diperbarui!')
    } else {
      const { error } = await $supabase
        .from('resume')
        .insert([payload])
      if (error) throw error
      alert('Timeline berhasil ditambahkan!')
    }

    cancelEditResume()
    await fetchResume()
  } catch (err) {
    alert('Save resume failed: ' + err.message)
  }
}

const deleteResumeItem = async (id) => {
  if (!confirm('DELETE_RESUME_ITEM_PERMANENTLY?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('resume').delete().eq('id', id)
    if (error) throw error
    if (isEditingResume.value && editingResumeId.value === id) {
      cancelEditResume()
    }
    await fetchResume()
  } catch (err) {
    alert('Delete failed: ' + err.message)
  }
}

// About Me variables & Updates
const aboutMeData = ref({
  background: { id: null, content: '' },
  skills: { id: null, content: '' }
})

const fetchAboutMe = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('about_me')
      .select('*')
    if (error) throw error
    if (data) {
      const bg = data.find(i => i.section === 'background')
      if (bg) {
        aboutMeData.value.background.id = bg.id
        aboutMeData.value.background.content = bg.content
      }
      const sk = data.find(i => i.section === 'skills')
      if (sk) {
        aboutMeData.value.skills.id = sk.id
        aboutMeData.value.skills.content = sk.content
      }
    }
  } catch (err) {
    console.error('Fetch about me failed:', err.message)
  }
}

const saveAboutMe = async () => {
  try {
    const { $supabase } = useNuxtApp()
    
    // Save Background
    const { error: bgError } = await $supabase
      .from('about_me')
      .upsert({
        section: 'background',
        title: 'BACKGROUND_LORE',
        content: aboutMeData.value.background.content
      }, { onConflict: 'section' })
    if (bgError) throw bgError

    // Save Skills
    const { error: skError } = await $supabase
      .from('about_me')
      .upsert({
        section: 'skills',
        title: 'TECHNICAL_SKILLS',
        content: aboutMeData.value.skills.content
      }, { onConflict: 'section' })
    if (skError) throw skError

    alert('Profil about me berhasil diperbarui!')
    await fetchAboutMe()
  } catch (err) {
    alert('Save about me failed: ' + err.message)
  }
}

// Default Seed Data
const defaultPortfolioItems = [
  { category: 'Instagram', title: 'Instagram 28', link_url: 'https://www.instagram.com/p/DY6YiPfmVUi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 27', link_url: 'https://www.instagram.com/p/DaelRdTR8ZK/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 26', link_url: 'https://www.instagram.com/p/DXv9vohgXSw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 25', link_url: 'https://www.instagram.com/p/DW5b1l1CRSD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 24', link_url: 'https://www.instagram.com/p/DXJjfX2keDn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 23', link_url: 'https://www.instagram.com/p/DWm7-0RkTpl/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 20', link_url: 'https://www.instagram.com/p/DWQuV5CGLRi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 19', link_url: 'https://www.instagram.com/p/DWYhU77AsOF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 18', link_url: 'https://www.instagram.com/p/DWKuDa-kZ-W/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 17', link_url: 'https://www.instagram.com/p/DVgAJjFkUlE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 15', link_url: 'https://www.instagram.com/p/DVYQutID-Ue/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 12', link_url: 'https://www.instagram.com/p/DUsP0EFEVJD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 11', link_url: 'https://www.instagram.com/p/DUuahM0D7OS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 10', link_url: 'https://www.instagram.com/p/DTk8JLUEpc4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 9', link_url: 'https://www.instagram.com/p/DSU1GevCRvn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 8', link_url: 'https://www.instagram.com/p/DPG_ZzviSPd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 7', link_url: 'https://www.instagram.com/p/DSLTQVgEzQ5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 6', link_url: 'https://www.instagram.com/p/DQ_ygAgDzDn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 5', link_url: 'https://www.instagram.com/p/DRggmQhj1Jb/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 4', link_url: 'https://www.instagram.com/p/DSEgQsODxzt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 3', link_url: 'https://www.instagram.com/p/DQ3HFGnj9ps/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  
  { category: 'Reels', title: 'Reels 1', image_url: 'https://lh3.googleusercontent.com/d/1X3cBfPw_HK-MQeeXxhOxg7rsPvGU1bQ_=w1000', link_url: 'https://www.instagram.com/reel/DHLp9EPybiH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  
  { category: 'Merchandise', title: 'Merchandise 5', image_url: 'https://lh3.googleusercontent.com/d/18O44CJww_mAA7Qw4m-9c4yhP02CIAcFQ=w1000' },
  { category: 'Merchandise', title: 'Merchandise 4', image_url: 'https://lh3.googleusercontent.com/d/1lmO1PJEsUbuIDghD4yJj8GrgQAbXQZSO=w1000' },
  { category: 'Merchandise', title: 'Merchandise 3', image_url: 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000' },
  { category: 'Merchandise', title: 'Merchandise 2', image_url: 'https://lh3.googleusercontent.com/d/1DlXuWc0m5xKo05JmXqxrrX3Gx78j8PnD=w1000' },
  { category: 'Merchandise', title: 'Merchandise 1', image_url: 'https://lh3.googleusercontent.com/d/1eDE3kO4pLLULDZkq59dEA2I5L8WQghV0=w1000' },
  
  { category: 'Logo', title: 'Logo 1', image_url: 'https://lh3.googleusercontent.com/d/10UlUJMX5hT5EZHfMghOMWeR-JTlEgR3U=w1000' },
  { category: 'Logo', title: 'Logo 2', image_url: 'https://lh3.googleusercontent.com/d/1QixAoJ58I4rpLRixVSyw_0vQDCRKZUp3=w1000' },
  { category: 'Logo', title: 'Logo 3', image_url: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000' },
  { category: 'Logo', title: 'Logo 4', image_url: 'https://lh3.googleusercontent.com/d/1D5nuJ3sy3vBXkWoLpePK83XC3GM-qYub=w1000' },
  { category: 'Logo', title: 'Logo 5', image_url: 'https://lh3.googleusercontent.com/d/1X3cBfPw_HK-MQeeXxhOxg7rsPvGU1bQ_=w1000' },
  { category: 'Logo', title: 'Logo 6', image_url: 'https://lh3.googleusercontent.com/d/1e5JbaTtDWl9qmY1SubXC2oLRLlpWRWXl=w1000' },

  { category: 'Photography', title: 'Photo 1', image_url: 'https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl=w1000' },
  { category: 'Photography', title: 'Photo 2', image_url: 'https://lh3.googleusercontent.com/d/1eOocRLC-0cUns9WZ_VGQjd4tUF1wflBn=w1000' },
  { category: 'Photography', title: 'Photo 3', image_url: 'https://lh3.googleusercontent.com/d/1M1kZIB_CaWd9NMgCMMvooaiVZnrZkCUw=w1000' },
  { category: 'Photography', title: 'Photo 4', image_url: 'https://lh3.googleusercontent.com/d/1cjb4wHFqT4U0aT0DE8nAOn5klsjJLPRH=w1000' },
  { category: 'Photography', title: 'Photo 5', image_url: 'https://lh3.googleusercontent.com/d/1HNxvAjDBk8aRLu2TvTLYCFTNYXDaYgpl=w1000' },
  { category: 'Photography', title: 'Photo 6', image_url: 'https://lh3.googleusercontent.com/d/1m2VcKRUQ08ieqTCFp6TujWMxvzgGq-ri=w1000' },
  { category: 'Photography', title: 'Photo 7', image_url: 'https://lh3.googleusercontent.com/d/1RdooRldxPpu6nxKdjzk5DLFPec4uoIHv=w1000' },
  { category: 'Photography', title: 'Photo 8', image_url: 'https://lh3.googleusercontent.com/d/1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc=w1000' },
  { category: 'Photography', title: 'Photo 9', image_url: 'https://lh3.googleusercontent.com/d/1KFBd8nRIoo12jcXgfrWFyV7q-s6eFUv2=w1000' },
  { category: 'Photography', title: 'Photo 10', image_url: 'https://lh3.googleusercontent.com/d/1beIbT6eVGa-vlCkGVyF6XTGQuKiILE_0=w1000' },
  
  {
    category: 'Website',
    title: 'Web Pondok Pesantren Khozinatul Ulum An-Nawa',
    description: 'Platform manajemen pesantren masa depan dengan antarmuka modern yang responsif, integrasi basis data real-time untuk data santri',
    link_url: 'https://annawa.vercel.app',
    tags: ['Vue', 'Node.js', 'TailwindCSS', 'Nuxt.js', 'PostgreSQL']
  },
  {
    category: 'Website',
    title: 'Web Satuan Tugas Pencegahan & Penanganan Kekerasan di Perguruan Tinggi',
    description: 'Platform manajemen layanan Pengaduan Kekerasan di Tingkat Perguruan Tinggi responsif, integrasi basis data real-time untuk data kekerasan di perguruan tinggi',
    link_url: 'https://satgasppks.vercel.app',
    tags: ['Vue', 'Node.js', 'TailwindCSS', 'Nuxt.js', 'PostgreSQL']
  }
]

const defaultTestimonials = [
  {
    name: 'Agna Nia Zahra',
    role: 'Wakil Ketua KAMABA Yogyakarta',
    avatar_url: '',
    body: '"Setiap produk punya pasarnya sendiri, namun desain ini kurang cocok bagi saya. Kata "Born in Blora" kurang menarik; bagian depan lebih bagus jika tulisan "Blora" saja. Bagian belakang sebaiknya dipecah menjadi tiga tema berbeda agar identitasnya lebih kuat dan fokus"',
    rating: 3
  },
  {
    name: 'Luthfi Nishfi',
    role: 'Alumni Mahasiswi UNU Yogyakarta',
    avatar_url: 'https://lh3.googleusercontent.com/d/1KFBd8nRIoo12jcXgfrWFyV7q-s6eFUv2',
    body: '"bagus banget hasil fotonya"',
    rating: 5
  },
  {
    name: 'Franciska Nur Widya Ningrum',
    role: 'Guru Bahasa Inggris',
    avatar_url: 'https://lh3.googleusercontent.com/d/1beIbT6eVGa-vlCkGVyF6XTGQuKiILE_0',
    body: '"Coming Soon"',
    rating: 5
  },
  {
    name: 'Anik Ida Wijayanti',
    role: 'Mahasiswa UNY',
    avatar_url: 'https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl',
    body: 'Oke jujur ya… ini fotografer vibes-nya mantepp poll😭 Hasil fotonya? GILA SIH 🔥 Candid dapet, pose juga tetep natural. Yang biasanya aku awkward depan kamera aja bisa keliatan santai 😆 Editannya juga nggak lebay— clean, aesthetic , dan tetep “aku bgt”. Jadi nggak yang tiba-tiba muka berubah jadi orang lain wkwk. Yang paling aku suka: dia ngerti vibe . Mau foto yang chill , fun , atau agak cinematic dikit, semuanya kena ',
    rating: 5
  },
  {
    name: 'Erma',
    role: 'Founder Ermora',
    avatar_url: '',
    body: '"Kemarin request logo buat fashion Designnya cepet, rapi, minimalis, harga sesuai budget mau mahaallllll banget bisa, mau yang murahhh pun bisa 🔥 Ultra HD hasilnya, ga pemulahan di cetak dikain"',
    rating: 5
  },
  {
    name: 'Agus Prasetya',
    role: 'Founder Mahara',
    avatar_url: '',
    body: 'Designya bagus, pengerjaan cepat, hasil memuaskan',
    rating: 5
  },
  {
    name: 'Erin Gayatri',
    role: 'Diretur Center For GEDSI',
    avatar_url: '',
    body: 'Selama di Media Center GEDSI UNU Yogyakarta, Anam berkontribusi besar dalam desain konten kreatif dan video pendek, termasuk proyek kolaborasi skala besar. Ia bekerja cepat, komunikatif dalam revisi, serta piawai dalam dokumentasi kegiatan. Sosok yang santun dan mudah berbaur ini memiliki potensi besar untuk karier yang cemerlang.',
    rating: 5
  }
]

const defaultResumeItems = [
  {
    tab: 'biography',
    title: 'Direktorat GEDSI Universitas Nahdlatul Ulama Yogyakarta',
    role: '',
    period: 'Periode 1: 2022–2023 | Periode 2: Desember 2024 – Sekarang',
    description: 'Selama bekerja di Direktorat GEDSI Universitas Nahdlatul Ulama Yogyakarta, saya bertanggung jawab dalam merancang berbagai materi kampanye dan publikasi digital untuk mendukung kegiatan organisasi. Selain itu, saya juga mengelola akun media sosial resmi GEDSI dengan fokus pada peningkatan interaksi dan penyampaian pesan yang efektif. Saya turut berkontribusi dalam penyusunan strategi komunikasi visual agar setiap konten yang dipublikasikan memiliki identitas dan nilai estetika yang konsisten.'
  },
  {
    tab: 'biography',
    title: 'Rumah Batik Jinggar (UMKM Yogyakarta)',
    role: '',
    period: '2023',
    description: 'Sebagai Desain Grafis di Rumah Batik Jinggar, saya bertanggung jawab dalam membuat berbagai konten visual untuk kebutuhan promosi produk batik, baik untuk media sosial maupun materi pemasaran lainnya. Selain itu, saya juga berperan dalam membantu pengembangan branding dan identitas visual UMKM agar memiliki citra yang konsisten dan menarik di mata konsumen.'
  },
  {
    tab: 'organization',
    title: 'KAMABA Yogyakarta (Keluarga Mahasiswa Blora Yogyakarta)',
    role: 'Desain Grafis & Admin Media Sosial (2022-2023) | Ketua Umum (2023-2024)',
    period: '2022–2024',
    description: 'Sebagai Desain Grafis & Admin Media Sosial di KAMABA Yogyakarta, saya bertanggung jawab dalam merancang berbagai konten visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga mengelola akun media sosial resmi KAMABA dengan fokus pada peningkatan interaksi dan penyampaian informasi yang efektif kepada anggota dan masyarakat luas.'
  },
  {
    tab: 'organization',
    title: 'UKM JQH IAC UNU Yogyakarta',
    role: 'Desain Grafis',
    period: '2023-2024',
    description: 'Sebagai Desain Grafis di UKM JQH IAC UNU Yogyakarta, saya bertanggung jawab dalam merancang berbagai konten visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga mengelola akun media sosial resmi UKM JQH IAC UNU dengan fokus pada peningkatan interaksi dan penyampaian informasi yang efektif kepada anggota dan masyarakat luas.'
  },
  {
    tab: 'organization',
    title: 'Mustika Amarta',
    role: 'Admin Sosial Media',
    period: '2025-Sekarang',
    description: 'Sebagai Desain Grafis dan Admin Sosial media di Mustika Amarta, saya bertanggung jawab dalam merancang berbagai konten visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga mengelola akun media sosial resmi Mustika Amarta dengan fokus pada peningkatan interaksi dan penyampaian informasi yang efektif kepada anggota dan masyarakat luas.'
  },
  {
    tab: 'organization',
    title: 'NataKarsa',
    role: 'Founder',
    period: 'Sekarang',
    description: 'sebuah Komunitas yang berfokus pada dunia developer yang bertujuan agar para developer dapat saling berkolaborasi dan berbagi pengetahuan.'
  },
  {
    tab: 'education',
    title: 'Universitas Nahdlatul Ulama Yogyakarta',
    role: 'Informatika',
    period: 'Lulus 2025',
    description: 'Judul Skripsi : Rancang Bangun Sistem Pengaduan Kekerasan Seksual Berbasis Web di Universitas Nahdlatul Ulama Yogyakarta Menggunakan Methode Prototype'
  },
  {
    tab: 'education',
    title: 'MA Khozinatul Ulum',
    role: 'Ilmu Pengetahuan Alam',
    period: 'Lulus 2021',
    description: 'Aktif dalam kegiatan ekstrakurikuler Organisai Siswa Intra Sekolah (OSIS)'
  },
  {
    tab: 'job',
    title: 'PT. Cetak Laba Bersih',
    role: 'Desain Grafis',
    period: 'November 2025 - Januari 2026',
    description: ''
  },
  {
    tab: 'job',
    title: 'PT. Peksi Gunaraharja',
    role: 'Desain Grafis',
    period: 'Februari 2026 - Sekarang',
    description: ''
  }
]

const triggerSeedPortfolio = async () => {
  if (!confirm('Apakah Anda ingin memuat data contoh portfolio ke database Supabase?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('portfolio').insert(defaultPortfolioItems)
    if (error) throw error
    alert('Data contoh portfolio berhasil dimuat!')
    await fetchPortfolio()
  } catch (err) {
    alert('Seeding portfolio gagal: ' + err.message)
  }
}

const triggerSeedTestimonials = async () => {
  if (!confirm('Apakah Anda ingin memuat data contoh testimoni ke database Supabase?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('testimonials').insert(defaultTestimonials)
    if (error) throw error
    alert('Data contoh testimoni berhasil dimuat!')
    await fetchTestimonials()
  } catch (err) {
    alert('Seeding testimoni gagal: ' + err.message)
  }
}

const triggerSeedResume = async () => {
  if (!confirm('Apakah Anda ingin memuat data contoh resume timeline ke database Supabase?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('resume').insert(defaultResumeItems)
    if (error) throw error
    alert('Data contoh resume berhasil dimuat!')
    await fetchResume()
  } catch (err) {
    alert('Seeding resume gagal: ' + err.message)
  }
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await Promise.all([
        fetchOrders(),
        fetchPortfolio(),
        fetchTestimonials(),
        fetchResume(),
        fetchAboutMe()
      ])
    }
  }
})
</script>

<style scoped>
/* Forms styling */
.crud-form-card, .about-edit-layout {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 243, 255, 0.15);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.05);
}

.form-title {
  font-family: var(--font-primary);
  color: #00f3ff;
  font-size: 1.2rem;
  margin-bottom: 25px;
  letter-spacing: 1px;
}

.admin-form .form-group {
  margin-bottom: 20px;
}

.admin-form label {
  display: block;
  font-family: var(--font-primary);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #00f3ff;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
}

.btn-submit {
  background: transparent;
  border: 1px solid #00f3ff;
  color: #00f3ff;
  padding: 12px 24px;
  font-family: var(--font-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.btn-submit:hover {
  background: #00f3ff;
  color: #000;
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 12px 24px;
  font-family: var(--font-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.btn-cancel:hover {
  border-color: #fff;
  color: #fff;
}

.filter-bar {
  margin-bottom: 20px;
}

.meta-tag {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 3px;
}

.btn-edit-item {
  background: transparent;
  border: 1px solid rgba(0, 243, 255, 0.3);
  color: #00f3ff;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-edit-item:hover {
  background: #00f3ff;
  color: #000;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
}

.btn-delete-item {
  background: transparent;
  border: 1px solid rgba(255, 0, 85, 0.3);
  color: #ff0055;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-delete-item:hover {
  background: #ff0055;
  color: #fff;
  box-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
}
</style>
