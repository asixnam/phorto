<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div class="about-edit-layout">
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
import { ref, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'admin'
})

const aboutMeData = ref({
  background: { content: '' },
  skills: { content: '' }
})

const refreshTrigger = useState('admin-refresh-trigger', () => 0)
watch(refreshTrigger, () => {
  fetchAboutMe()
})

const fetchAboutMe = async () => {
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('about_me')
      .select('*')

    if (error) throw error

    if (data && data.length > 0) {
      const bg = data.find(item => item.section === 'background')
      const sk = data.find(item => item.section === 'skills')
      if (bg) aboutMeData.value.background = bg
      if (sk) aboutMeData.value.skills = sk
    }
  } catch (err) {
    console.error('Fetch about_me failed:', err.message)
  }
}

const saveAboutMe = async () => {
  try {
    const { $supabase } = useNuxtApp()
    
    // Save background
    const payloadBg = {
      section: 'background',
      content: aboutMeData.value.background.content
    }
    let queryBg = null
    if (aboutMeData.value.background.id) {
      queryBg = $supabase.from('about_me').update(payloadBg).eq('id', aboutMeData.value.background.id)
    } else {
      queryBg = $supabase.from('about_me').insert([payloadBg])
    }
    const { error: errBg } = await queryBg
    if (errBg) throw errBg

    // Save skills
    const payloadSk = {
      section: 'skills',
      content: aboutMeData.value.skills.content
    }
    let querySk = null
    if (aboutMeData.value.skills.id) {
      querySk = $supabase.from('about_me').update(payloadSk).eq('id', aboutMeData.value.skills.id)
    } else {
      querySk = $supabase.from('about_me').insert([payloadSk])
    }
    const { error: errSk } = await querySk
    if (errSk) throw errSk

    alert('Informasi About Me berhasil diperbarui!')
    await fetchAboutMe()
  } catch (err) {
    alert('Save failed: ' + err.message)
  }
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await fetchAboutMe()
    }
  }
})
</script>
