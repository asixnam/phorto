<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
        <h2 class="form-title" style="margin:0">// PENGELOLAAN_RESUME_TIMELINE</h2>
        <div style="display:flex; gap:10px;">
          <button @click="triggerSeedResume" class="btn-cancel" style="margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
          <button @click="showResumeForm = true" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
            TAMBAH TIMELINE BARU
          </button>
        </div>
      </div>

      <!-- Form container (modal popup) -->
      <div v-if="showResumeForm || isEditingResume" class="modal-backdrop" @click.self="cancelEditResume">
        <div class="crud-form-card modal-content animate-scale">
          <button type="button" class="modal-close-btn" @click="cancelEditResume" aria-label="Close modal">&times;</button>
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
              <input type="text" v-model="newResume.title" required placeholder="Contoh: Universitas Nahdlatul Olama" class="form-control" />
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
              <td colspan="6" style="text-align:center; padding:40px;">RESUME_DATABASE_EMPTY. Silakan tambahkan baru atau load data contoh.</td>
            </tr>
            <tr v-else v-for="item in filteredResumeList" :key="item.id">
              <td data-label="Lembaga/Perusahaan" style="font-weight:bold; color: var(--accent-blue);">{{ item.title }}</td>
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

const showResumeForm = ref(false)
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

const refreshTrigger = useState('admin-refresh-trigger', () => 0)
watch(refreshTrigger, () => {
  fetchResume()
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

const defaultResumeItems = [
  { tab: 'biography', title: 'PT Desain Grafis Indonesia', role: 'Graphic Design Intern', period: '2023 - 2024', description: 'Membantu proses kreatif pembuatan aset promosi media sosial untuk brand-brand lokal Yogyakarta, berkolaborasi dengan copywriter dan creative director.' },
  { tab: 'organization', title: 'Himpunan Mahasiswa Informatika UNU', role: 'Kepala Divisi Media & Kreatif', period: '2024 - Sekarang', description: 'Mengoordinasikan publikasi acara kemahasiswaan, mendesain materi visual promosi, dan merancang identitas visual departemen.' }
]

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
      await fetchResume()
    }
  }
})
</script>
