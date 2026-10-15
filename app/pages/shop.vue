<script setup>
import { ref, computed, onMounted } from 'vue'

// Initial default services fallback
const defaultServices = [
  {
    title: 'Desain Logo',
    category: 'Graphic Design',
    description: 'Pembuatan logo profesional yang mencerminkan identitas bisnis Anda dengan desain yang unik dan memorable.',
    image: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000',
    tags: ['Custom Design', 'Multiple Revisions', 'Vector Format', 'Start From 100k'],
    link: '/checkout?service=Desain Logo'
  },
  {
    title: 'Desain Kaos',
    category: 'Merchandise & Print',
    description: 'Desain kaos kreatif untuk brand personal, acara, atau bisnis dengan pilihan style yang beragam.',
    image: 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000',
    tags: ['Desain Kustom', 'Mockup Preview', 'Start From 100k'],
    link: '/checkout?service=Desain Kaos'
  },
  {
    title: 'Feed Instagram',
    category: 'Social Media',
    description: 'Desain feed Instagram yang aesthetic dan konsisten untuk meningkatkan visual branding akun Anda.',
    image: 'https://lh3.googleusercontent.com/d/1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4=w1000',
    tags: ['Grid Layout', 'Tema Konsisten', 'HD Resolution', 'Start From 50k'],
    link: '/checkout?service=Feed Instagram'
  },
  {
    title: 'Desain Stiker',
    category: 'Merchandise & Print',
    description: 'Desain stiker unik dan eye-catching untuk produk, merchandise, atau keperluan promosi bisnis.',
    image: 'https://lh3.googleusercontent.com/d/1pkCZDxiUV-_ylQEw0A_Ce6GwyF2S_P22=w1000',
    tags: ['Custom Design', 'Berbagai Ukuran', 'Print Ready', 'Start From 40k'],
    link: '/checkout?service=Desain Stiker'
  },
  {
    title: 'Desain Mug',
    category: 'Merchandise & Print',
    description: 'Desain mug berkualitas untuk merchandise, hadiah, atau koleksi pribadi dengan hasil print yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/10mS9Kp2baYjRZtwHcJB-VgRlGF4QE-31=w1000',
    tags: ['Custom Design', 'Mockup Preview', 'Start From 50k'],
    link: '/checkout?service=Desain Mug'
  },
  {
    title: 'Desain Lanyard',
    category: 'Merchandise & Print',
    description: 'Desain lanyard profesional untuk acara, identitas karyawan, atau merchandise dengan detail yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/1hI8tTrLVQALecjtQeFcT5fxxo3I1eu-9=w1000',
    tags: ['Custom Design', 'Berbagai Material', 'Print Ready', 'Start From 50k'],
    link: '/checkout?service=Desain Lanyard'
  },
  {
    title: 'Desain ID Card',
    category: 'Merchandise & Print',
    description: 'Desain kartu identitas profesional untuk perusahaan, sekolah, atau organisasi dengan standar kualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1l8B6QSJLEAy7zt-Ve87moX_94ORm3IuX=w1000',
    tags: ['Custom Design', 'PVC Material', 'Print Ready', 'Start From 20k'],
    link: '/checkout?service=Desain ID Card'
  },
  {
    title: 'Pembuatan Website',
    category: 'Web Development',
    description: 'Pengembangan website profesional menggunakan teknologi terkini untuk memberikan pengalaman pengguna terbaik.',
    image: 'https://lh3.googleusercontent.com/d/1f07kczRvgEMIxRP-VRnkAx4cjG_8-dnX=w1000',
    tags: ['Responsive Design', 'SEO Optimized', 'Full Support', 'Start From 5jt'],
    link: '/checkout?service=Pembuatan Website'
  },
  {
    title: 'Fotografi',
    category: 'Multimedia & Fotografi',
    description: 'Jasa fotografi profesional untuk acara, produk, atau keperluan komersial dengan hasil berkualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc=w1000',
    tags: ['Foto & Editing', 'Profesional', 'Berbagai Paket', 'Start From 300k'],
    link: '/checkout?service=Fotografi'
  },
  {
    title: 'Desain Cover Buku',
    category: 'Graphic Design',
    description: 'Desain cover buku yang menarik dan profesional untuk merepresentasikan isi cerita atau materi buku Anda.',
    image: 'https://lh3.googleusercontent.com/d/1CEgGGx3TLvtYUWR4a0QCRHX7_YeRFHYc=w1000',
    tags: ['Custom Design', '3D Mockup', 'Print Ready', 'Start From 50k'],
    link: '/checkout?service=Desain Cover Buku'
  }
]

const services = ref([...defaultServices])
const categories = ref([])
const selectedCategory = ref('ALL')
const searchKeyword = ref('')
const isLoading = ref(false)

// Parse tags helper
const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    return tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}

// Available categories computed from loaded categories and current services
const availableCategories = computed(() => {
  const catSet = new Set()
  // Add categories from database list
  categories.value.forEach(c => {
    if (c.name) catSet.add(c.name)
  })
  // Also collect any category used by existing services
  services.value.forEach(s => {
    if (s.category) catSet.add(s.category)
  })
  return Array.from(catSet)
})

// Filtered services
const filteredServices = computed(() => {
  return services.value.filter(service => {
    // Only show active services (or default if undefined)
    if (service.is_active === false) return false

    // Filter by category
    if (selectedCategory.value !== 'ALL' && service.category !== selectedCategory.value) {
      return false
    }

    // Filter by search query
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.toLowerCase()
      const titleMatch = (service.title || '').toLowerCase().includes(q)
      const descMatch = (service.description || '').toLowerCase().includes(q)
      const catMatch = (service.category || '').toLowerCase().includes(q)
      const tagsMatch = parseTags(service.tags).some(t => t.toLowerCase().includes(q))
      return titleMatch || descMatch || catMatch || tagsMatch
    }

    return true
  })
})

const getCategoryCount = (categoryName) => {
  if (categoryName === 'ALL') {
    return services.value.filter(s => s.is_active !== false).length
  }
  return services.value.filter(s => s.is_active !== false && s.category === categoryName).length
}

const resetFilter = () => {
  selectedCategory.value = 'ALL'
  searchKeyword.value = ''
}

// Load dynamic services and categories from Supabase
const loadServicesData = async () => {
  try {
    const { $supabase } = useNuxtApp()
    if (!$supabase) return

    isLoading.value = true

    // Fetch categories
    const { data: catData, error: catErr } = await $supabase
      .from('service_categories')
      .select('*')
      .order('order_num', { ascending: true })

    if (!catErr && catData && catData.length > 0) {
      categories.value = catData
    }

    // Fetch services
    const { data: servData, error: servErr } = await $supabase
      .from('services')
      .select('*')
      .order('order_num', { ascending: true })
      .order('created_at', { ascending: false })

    if (!servErr && servData && servData.length > 0) {
      services.value = servData
    }
  } catch (err) {
    console.warn('Load services notice:', err.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadServicesData()
})
</script>

<template>
  <div>
    <section id="shop" class="shop" style="padding-top: 120px; padding-bottom: 80px;">
      <div class="container" style="text-align: center;">
        <div class="section-tag">// SERVICE_CAPABILITIES_UPLINK</div>
        <h2 class="section-title">Layanan <span>Freelance</span></h2>
        <p class="section-subtitle">
          Deep search successfully... <span class="typing-effect">decrypted_services_established</span>
        </p>

        <!-- Service Search & Category Filter Toolbar -->
        <div class="shop-toolbar" style="max-width: 900px; margin: 30px auto 40px auto;">
          <!-- Search Input -->
          <div class="shop-search-wrapper">
            <i class="fas fa-search shop-search-icon"></i>
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="Cari layanan (contoh: Logo, Kaos, Website, Stiker)..." 
              class="shop-search-input"
            />
            <button 
              v-if="searchKeyword" 
              @click="searchKeyword = ''" 
              class="shop-search-clear"
              aria-label="Clear Search"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Category Pills Filter Bar -->
          <div class="shop-categories-scroll">
            <button 
              @click="selectedCategory = 'ALL'"
              :class="['category-pill-btn', { active: selectedCategory === 'ALL' }]"
            >
              Semua ({{ getCategoryCount('ALL') }})
            </button>
            <button 
              v-for="cat in availableCategories" 
              :key="cat"
              @click="selectedCategory = cat"
              :class="['category-pill-btn', { active: selectedCategory === cat }]"
            >
              {{ cat }} ({{ getCategoryCount(cat) }})
            </button>
          </div>

          <!-- Active Filter Indicator / Result Count -->
          <div v-if="searchKeyword || selectedCategory !== 'ALL'" class="filter-results-status">
            <span>
              Menampilkan <strong>{{ filteredServices.length }}</strong> layanan
              <span v-if="selectedCategory !== 'ALL'"> dalam kategori "<strong>{{ selectedCategory }}</strong>"</span>
              <span v-if="searchKeyword"> dengan kata kunci "<strong>{{ searchKeyword }}</strong>"</span>
            </span>
            <button @click="resetFilter" class="btn-reset-filter">
              <i class="fas fa-undo"></i> Reset Filter
            </button>
          </div>
        </div>

        <!-- Services Grid -->
        <div v-if="filteredServices.length > 0" class="services-grid">
          <div v-for="service in filteredServices" :key="service.id || service.title" class="service-card">
            <div class="service-image-wrapper">
              <img :src="service.image" :alt="service.title" class="service-card-img" loading="lazy" />
              <span v-if="service.category" class="service-card-category-badge">
                {{ service.category }}
              </span>
            </div>
            <div class="service-details">
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-features">
                <span v-for="(tag, idx) in parseTags(service.tags)" :key="idx" class="feature-tag">
                  {{ tag }}
                </span>
              </div>
              <NuxtLink :to="service.link || `/checkout?service=${encodeURIComponent(service.title)}`" class="service-cta">
                <i class="fas fa-shopping-cart"></i> Pesan Sekarang
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="services-empty-state">
          <div class="empty-icon-wrap">
            <i class="fas fa-search-minus"></i>
          </div>
          <h3 class="empty-title">Layanan Tidak Ditemukan</h3>
          <p class="empty-desc">
            Tidak ada layanan yang sesuai dengan kriteria pencarian atau kategori yang dipilih.
          </p>
          <button @click="resetFilter" class="btn-signal" style="margin-top: 15px; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-undo"></i> Tampilkan Semua Layanan
          </button>
        </div>

        <!-- CTA Section -->
        <section id="contact" class="signal-uplink" style="margin-top: 50px; padding: 60px 0; border-radius: 20px;">
          <div class="signal-header">
            <div class="section-tag">MISSION_DOSSIER</div>
            <span class="binary-code">COMMUNICATION UPLINK</span>
            <h2 class="connection-title">START PROJECT</h2>
          </div>

          <div class="signal-card" style="max-width: 800px; margin: 0 auto;">
            <p class="signal-text text-center">
              Hubungi saya untuk konsultasi gratis dan dapatkan penawaran<br>
              terbaik untuk kebutuhan digital Anda.
            </p>

            <div class="signal-actions" style="justify-content: center; gap: 20px; flex-wrap: wrap;">
              <a href="https://wa.me/6281323596022" class="btn-signal" target="_blank" style="background: var(--bg-social); border-color: var(--accent-blue); color: var(--accent-blue);">
                <i class="fab fa-whatsapp"></i>
                Chat WhatsApp
              </a>
              <NuxtLink to="/checkout" class="btn-signal">
                <i class="fas fa-shopping-cart"></i>
                Pesan Sekarang
              </NuxtLink>
            </div>

            <div class="terminal-status">
              <div class="status-bars">
                <div class="bar" style="background: rgba(37, 211, 102, 0.1);"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
              SYSTEM READY
            </div>
          </div>
        </section>

      </div>
    </section>
  </div>
</template>

<style scoped>
/* Toolbar and search styles */
.shop-toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shop-search-wrapper {
  position: relative;
  width: 100%;
}

.shop-search-input {
  width: 100%;
  padding: 14px 44px 14px 44px;
  background: rgba(197, 168, 128, 0.05);
  border: 1px solid rgba(197, 168, 128, 0.2);
  border-radius: 30px;
  color: var(--text-secondary, #1c1b18);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

body.dark-mode .shop-search-input {
  background: rgba(22, 22, 22, 0.8);
  border: 1px solid rgba(197, 168, 128, 0.25);
  color: #ffffff;
}

.shop-search-input:focus {
  outline: none;
  border-color: var(--text-primary, #8a7051);
  box-shadow: 0 0 15px rgba(138, 112, 81, 0.2);
}

.shop-search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-primary, #8a7051);
  font-size: 1rem;
}

.shop-search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.shop-search-clear:hover {
  color: #ef4444;
}

/* Category Filter Pills */
.shop-categories-scroll {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 4px 0;
}

.category-pill-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(197, 168, 128, 0.2);
  color: var(--text-secondary, #4b5563);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

body.dark-mode .category-pill-btn {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(197, 168, 128, 0.2);
}

.category-pill-btn:hover {
  border-color: var(--text-primary, #8a7051);
  color: var(--text-primary, #8a7051);
  transform: translateY(-2px);
}

.category-pill-btn.active {
  background: #8a7051;
  border-color: #8a7051;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(138, 112, 81, 0.3);
}

body.dark-mode .category-pill-btn.active {
  background: #9f7615;
  border-color: #9f7615;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(159, 118, 21, 0.4);
}

/* Filter status message */
.filter-results-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);
  margin-top: 5px;
  flex-wrap: wrap;
}

.btn-reset-filter {
  background: none;
  border: none;
  color: var(--text-primary, #8a7051);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
}

/* Badge on Service Card */
.service-image-wrapper {
  position: relative;
}

.service-card-category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  letter-spacing: 0.5px;
  z-index: 2;
}

/* Empty State */
.services-empty-state {
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(197, 168, 128, 0.2);
  border-radius: 16px;
  max-width: 600px;
  margin: 30px auto;
}

.empty-icon-wrap {
  font-size: 2.5rem;
  color: var(--text-primary, #8a7051);
  opacity: 0.6;
  margin-bottom: 15px;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.9rem;
  color: #6b7280;
}
</style>
