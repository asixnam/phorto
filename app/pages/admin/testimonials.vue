<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px; flex-wrap:wrap; gap:10px;">
        <h2 class="form-title" style="margin:0">// PENGELOLAAN_TESTIMONI_KLIEN</h2>
        <div style="display:flex; gap:10px;">
          <button @click="triggerSeedTestimonials" class="btn-cancel" style="margin:0; width:auto; padding: 8px 16px;">LOAD EXAMPLE DATA</button>
          <button @click="showTestimonialForm = true" class="btn-submit" style="margin:0; width:auto; padding: 8px 16px;">
            TAMBAH TESTIMONI BARU
          </button>
        </div>
      </div>

      <!-- Form container (modal popup) -->
      <div v-if="showTestimonialForm || isEditingTestimonial" class="modal-backdrop" @click.self="cancelEditTestimonial">
        <div class="crud-form-card modal-content animate-scale">
          <button type="button" class="modal-close-btn" @click="cancelEditTestimonial" aria-label="Close modal">&times;</button>
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
              <div v-if="isUploadingAvatar" style="font-size: 0.85rem; color: var(--accent-blue); margin-top: 5px;">
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
              <td colspan="6" style="text-align:center; padding:40px;">TESTIMONIAL_DATABASE_EMPTY. Silakan tambahkan baru atau load data contoh.</td>
            </tr>
            <tr v-else v-for="t in testimonialList" :key="t.id">
              <td data-label="Avatar">
                <img v-if="t.avatar_url" :src="t.avatar_url" style="width:40px; height:40px; object-fit:cover; border-radius:50%; border:1px solid rgba(255,255,255,0.1);" />
                <i v-else class="fas fa-user-circle" style="font-size:24px; opacity:0.3;"></i>
              </td>
              <td data-label="Klien" style="font-weight:bold; color: var(--accent-blue);">{{ t.name }}</td>
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
      
      <div style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/shop" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.7rem;">
          <i class="fas fa-external-link-alt"></i> Back to Public Site
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { compressImage } from '~/utils/image'


definePageMeta({
  layout: 'admin'
})

const showTestimonialForm = ref(false)
const testimonialList = ref([])
const isEditingTestimonial = ref(false)
const isUploadingAvatar = ref(false)
const editingTestimonialId = ref(null)

const newTestimonial = ref({
  name: '',
  role: '',
  avatar_url: '',
  body: '',
  rating: 5
})

const refreshTrigger = useState('admin-refresh-trigger', () => 0)
watch(refreshTrigger, () => {
  fetchTestimonials()
})

const onAvatarFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploadingAvatar.value = true
  try {
    // Compress and resize avatar client-side (max 200x200 pixels, quality 0.8)
    const compressedBlob = await compressImage(file, 200, 200, 0.8)
    
    // Construct a standard filename with .jpg extension for the compressed blob
    const originalName = file.name || 'avatar.png'
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
      let errMsg = 'Upload failed'
      try {
        const text = await response.text()
        try {
          const errData = JSON.parse(text)
          errMsg = errData.statusMessage || errData.message || errMsg
        } catch (_) {
          errMsg = text || response.statusText || errMsg
        }
      } catch (_) {
        errMsg = response.statusText || errMsg
      }
      throw new Error(errMsg)
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
      avatar_url: newTestimonial.value.avatar_url || null,
      body: newTestimonial.value.body,
      rating: newTestimonial.value.rating
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
  if (!confirm('DELETE_TESTIMONIAL_ITEM_PERMANENTLY?')) return
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

const defaultTestimonialItems = [
  { name: 'Agna Nia', role: 'Founder Ermora', rating: 5, body: 'Wah, luar biasa sekali hasil desain logo dan feed instagram dari kak Anam! Sangat profesional dan tepat waktu. Rekomendasi banget untuk yang lagi cari jasa desain grafis di Jogja.' },
  { name: 'Rian Dwi', role: 'Marketing Manager Cafe Kopi Kita', rating: 5, body: 'Terima kasih banyak kak, desain kaos merchandise cafe kami laku keras! Pelayanannya ramah, responsif, dan bersedia merevisi sesuai keinginan kami.' }
]

const triggerSeedTestimonials = async () => {
  if (!confirm('Apakah Anda ingin memuat data contoh testimoni ke database Supabase?')) return
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.from('testimonials').insert(defaultTestimonialItems)
    if (error) throw error
    alert('Data contoh testimoni berhasil dimuat!')
    await fetchTestimonials()
  } catch (err) {
    alert('Seeding testimonials gagal: ' + err.message)
  }
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await fetchTestimonials()
    }
  }
})
</script>
