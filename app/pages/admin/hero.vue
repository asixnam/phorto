<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
        <h2 class="form-title" style="margin:0">// KELOLA_HERO_BANNER</h2>
      </div>
      <div class="crud-form-card" style="padding: 30px;">
        <h3 class="form-title" style="font-size:1.1rem; margin-bottom: 20px;">// EDIT_HERO_BANNER_CONTENT</h3>
        <div style="font-size:0.9rem; color:rgba(255,255,255,0.7); margin-bottom: 20px; line-height: 1.6;">
          Sesuaikan pesan utama, slogan, dan latar belakang visual yang muncul di halaman utama portofolio Anda.
        </div>
        <form @submit.prevent="saveHero" class="admin-form">
          <div class="form-group">
            <label>Judul Utama (Title)</label>
            <input type="text" value="Ciptakan Kenanganmu & Kembangkan Kreasimu" class="form-control" />
          </div>
          <div class="form-group">
            <label>Slogan (Tagline)</label>
            <input type="text" value="// VISUAL_LOG_CAPTURE & CODE_UPLINK_OPERATOR" class="form-control" />
          </div>
          <div class="form-group">
            <label>Latar Belakang Gambar (Hero Image URL)</label>
            <input type="text" value="/dekstop.png" class="form-control" />
          </div>
          <button type="submit" class="btn-submit">Perbarui Banner</button>
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
import { onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const saveHero = () => {
  alert('Demo Mode: Konten Banner berhasil diperbarui!')
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    }
  }
})
</script>
