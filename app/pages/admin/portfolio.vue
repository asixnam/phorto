<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
        <h2 class="form-title" style="margin:0">// PENGELOLAAN_PORTOFOLIO_KARYA</h2>
        <div style="display:flex; gap:10px;">
          <button @click="triggerSeedPortfolio" class="btn-cancel" style="margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
          <button @click="showPortfolioForm = true" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
            TAMBAH KARYA BARU
          </button>
        </div>
      </div>

      <!-- Form container (modal popup) -->
      <div v-if="showPortfolioForm || isEditingPortfolio" class="modal-backdrop" @click.self="cancelEditPortfolio">
        <div class="crud-form-card modal-content animate-scale">
          <button type="button" class="modal-close-btn" @click="cancelEditPortfolio" aria-label="Close modal">&times;</button>
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
              <div v-if="isUploading" style="font-size: 0.85rem; color: var(--accent-blue); margin-top: 5px;">
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
              <td data-label="Judul" style="font-weight:bold; color: var(--accent-blue);">{{ item.title }}</td>
              <td data-label="Kategori"><span class="meta-tag" style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius:4px;">{{ item.category }}</span></td>
              <td data-label="Deskripsi" style="font-size:0.8rem; max-width:250px; white-space:normal;">{{ item.description || '-' }}</td>
              <td data-label="Link / File" style="font-size:0.8rem; max-width:150px; overflow:hidden; text-overflow:ellipsis;">
                <a v-if="item.link_url" :href="item.link_url" target="_blank" style="color:var(--accent-blue); text-decoration:none;">{{ item.link_url }}</a>
                <span v-else>-</span>
              </td>
              <td data-label="Aksi">
                <div style="display:flex; gap:8px;">
                  <a v-if="item.link_url || item.image_url" :href="item.link_url || item.image_url" target="_blank" class="btn-edit-item" style="text-decoration:none; text-align:center; background: rgba(138,112,81,0.05);">
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

const showPortfolioForm = ref(false)
const portfolioList = ref([])
const portfolioFilter = ref('ALL')
const isEditingPortfolio = ref(false)
const isUploading = ref(false)
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

const refreshTrigger = useState('admin-refresh-trigger', () => 0)
watch(refreshTrigger, () => {
  fetchPortfolio()
})

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
    if (event.target) {
      event.target.value = ''
    }
  }
}

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

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await fetchPortfolio()
    }
  }
})
</script>
