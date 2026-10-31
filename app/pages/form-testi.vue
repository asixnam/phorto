<template>
  <div class="testi-page-wrapper">
    <section class="testi-section">
      <div class="container" style="max-width: 760px;">
        
        <!-- Header & Title -->
        <div class="hero-content">
          <div class="section-tag" style="display: inline-block;">// CLIENT_EXPERIENCE_TRANSMISSION</div>
          <h1 class="hero-title">RATING &amp; TESTIMONI</h1>
          <p class="hero-subtitle">
            Terima kasih telah mempercayakan project Anda kepada <strong>Asixnam</strong>.<br>
            Ulasan dan penilaian Anda sangat berharga bagi kami untuk terus memberikan hasil karya terbaik.
          </p>
        </div>

        <!-- Main Form Container -->
        <div id="testiContainer" class="about-card form-card-box">
          <template v-if="!isSubmitted">
            <form @submit.prevent="submitTestimonial" class="testi-form">
              
              <!-- 1. Star Rating Selection -->
              <div class="form-group rating-selection-group">
                <label class="form-label-bold">BERIKAN RATING KEPUASAN *</label>
                <div class="star-picker-wrap">
                  <div class="star-rating-row">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="star-btn"
                      :class="{ 'is-active': star <= (hoverRating || rating) }"
                      @mouseenter="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                      @click="rating = star"
                      :title="`${star} Bintang`"
                    >
                      <i class="fas fa-star"></i>
                    </button>
                  </div>
                  <div class="rating-feedback-badge">
                    <span>{{ getRatingDescription(hoverRating || rating) }}</span>
                  </div>
                </div>
              </div>

              <!-- 2. Client Identity Inputs (Name & Role/Service) -->
              <div class="form-row-grid">
                <div class="form-group">
                  <label class="form-label-bold">NAMA LENGKAP / BRAND *</label>
                  <input
                    type="text"
                    v-model="name"
                    required
                    placeholder="Contoh: Budi Santoso / Ermora Cafe"
                    class="testi-input"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label-bold">PERAN / JABATAN / USAHA *</label>
                  <input
                    type="text"
                    v-model="role"
                    required
                    placeholder="Contoh: Owner Ermora / Klien Desain Logo"
                    class="testi-input"
                  />
                </div>
              </div>

              <!-- 3. Testimonial Body (Review Message) -->
              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                  <label class="form-label-bold" style="margin-bottom:0;">ULASAN &amp; KESAN PESAN *</label>
                  <span style="font-size:0.75rem; color:#9ca3af;">{{ body.length }} karakter</span>
                </div>
                <textarea
                  v-model="body"
                  rows="4"
                  required
                  placeholder="Ceritakan pengalaman Anda bekerja sama dengan Asixnam, kualitas hasil karya, kecepatan pengerjaan, keramahan layanan, dll..."
                  class="testi-input testi-textarea"
                ></textarea>
              </div>

              <!-- 4. Client Photo / Avatar (Optional) -->
              <div class="form-group">
                <label class="form-label-bold">FOTO PROFIL / LOGO BRAND (OPSIONAL)</label>
                <div class="avatar-upload-area">
                  <div class="avatar-preview-box">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar Preview" class="avatar-img-preview" />
                    <div v-else class="avatar-placeholder">
                      <i class="fas fa-user"></i>
                    </div>
                  </div>

                  <div class="avatar-upload-actions">
                    <label class="upload-btn-label">
                      <i class="fas fa-cloud-upload-alt"></i>
                      <span>{{ isUploading ? 'Mengunggah...' : 'Pilih Foto (.jpg, .png)' }}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        @change="onAvatarFileChange"
                        :disabled="isUploading"
                        style="display: none;"
                      />
                    </label>
                    <p class="avatar-hint-text">
                      Disarankan foto wajah atau logo brand. Maks. ukuran otomatis dikompresi.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="error-msg-box">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Submit CTA Button -->
              <button
                type="submit"
                class="service-cta submit-testi-btn"
                :disabled="isSubmitting || isUploading"
              >
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> MENGIRIM TESTIMONI...
                </span>
                <span v-else>
                  <i class="fas fa-paper-plane"></i> KIRIM TESTIMONI &amp; RATING
                </span>
              </button>

            </form>
          </template>

          <!-- Success Screen -->
          <template v-else>
            <div class="success-screen animate-scale">
              <div class="success-header">
                <div class="success-icon-ring">
                  <i class="fas fa-check"></i>
                </div>
                <h2 class="success-title">TESTIMONI TERKIRIM!</h2>
                <p class="success-subtitle">
                  Terima kasih banyak <strong>{{ name }}</strong> atas ulasan dan rating yang Anda berikan.<br>
                  Dukungan dan apresiasi Anda sangat berarti bagi kemajuan <strong>Asixnam</strong>! 🙏✨
                </p>
              </div>

              <!-- Summary Card of Submitted Review -->
              <div class="submitted-review-preview">
                <div class="review-preview-header">
                  <div class="review-avatar-ring">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img-preview" />
                    <div v-else class="avatar-placeholder-sm">{{ name ? name.charAt(0).toUpperCase() : 'A' }}</div>
                  </div>
                  <div>
                    <h4 class="preview-name">{{ name }}</h4>
                    <span class="preview-role">{{ role }}</span>
                  </div>
                </div>

                <div class="preview-stars">
                  <i v-for="s in rating" :key="s" class="fas fa-star"></i>
                </div>

                <p class="preview-body">"{{ body }}"</p>
              </div>

              <!-- Action Links -->
              <div class="success-actions-grid">
                <NuxtLink to="/cv#testimonials" class="btn-hud btn-cyan" style="text-decoration:none;">
                  <i class="fas fa-comments"></i> LIHAT TESTIMONI PUBLIK
                </NuxtLink>
                <NuxtLink to="/shop" class="btn-hud btn-outline" style="text-decoration:none;">
                  <i class="fas fa-shopping-bag"></i> KUNJUNGI SHOP
                </NuxtLink>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <NuxtLink to="/" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.8rem; letter-spacing: 1px;">
                  <i class="fas fa-arrow-left"></i> Kembali ke Beranda
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>

        <!-- Back to Home -->
        <div v-if="!isSubmitted" style="text-align: center; margin-top: 25px;">
          <NuxtLink to="/" style="color: var(--text-primary); text-decoration: none; font-size: 0.8rem; letter-spacing: 2px;">
            <i class="fas fa-arrow-left"></i> KEMBALI KE BERANDA
          </NuxtLink>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { compressImage } from '~/utils/image'

// Page Metadata
useHead({
  title: 'Beri Rating & Testimoni - Asixnam Creative Studio',
  meta: [
    { name: 'description', content: 'Kirimkan pengalaman, ulasan, dan penilaian Anda bersama Asixnam Creative Studio.' }
  ]
})

const route = useRoute()

// Form State
const name = ref('')
const role = ref('')
const body = ref('')
const rating = ref(5)
const hoverRating = ref(0)
const avatarUrl = ref('')

const isUploading = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

// Pre-fill from URL query params (e.g., /form-testi?name=Budi&service=Desain+Logo)
onMounted(() => {
  if (route.query.name) {
    name.value = String(route.query.name).trim()
  }
  if (route.query.service) {
    const srv = String(route.query.service).trim()
    role.value = srv.toLowerCase().startsWith('klien ') ? srv : `Klien ${srv}`
  }
})

// Description for star ratings
const getRatingDescription = (starCount) => {
  switch (starCount) {
    case 5:
      return '⭐⭐⭐⭐⭐ - Sangat Puas & Melebihi Ekspektasi! 🎉'
    case 4:
      return '⭐⭐⭐⭐ - Puas & Hasil Keren! 👍'
    case 3:
      return '⭐⭐⭐ - Cukup Baik & Sesuai Kebutuhan 😊'
    case 2:
      return '⭐⭐ - Kurang Memuaskan 😐'
    case 1:
      return '⭐ - Sangat Kurang Memuaskan 🙁'
    default:
      return 'Pilih jumlah bintang'
  }
}

// Avatar upload handling
const onAvatarFileChange = async (event) => {
  const file = event.target?.files?.[0]
  if (!file) return

  isUploading.value = true
  errorMessage.value = ''

  try {
    // Compress avatar image client-side to max 400x400
    const compressedBlob = await compressImage(file, 400, 400, 0.8)

    const originalName = file.name || 'avatar.png'
    const extIdx = originalName.lastIndexOf('.')
    const nameWithoutExt = extIdx !== -1 ? originalName.slice(0, extIdx) : originalName
    const filename = `avatar-${Date.now()}-${nameWithoutExt}.jpg`

    const formData = new FormData()
    formData.append('file', compressedBlob, filename)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      let msg = 'Gagal mengunggah foto profil'
      try {
        const errJson = await response.json()
        if (errJson && errJson.statusMessage) msg = errJson.statusMessage
      } catch (_) {
        msg = response.statusText || msg
      }
      throw new Error(msg)
    }

    const result = await response.json()
    if (result && result.url) {
      avatarUrl.value = result.url
    }
  } catch (err) {
    errorMessage.value = 'Gagal upload avatar: ' + err.message
  } finally {
    isUploading.value = false
    if (event.target) {
      event.target.value = ''
    }
  }
}

// Submit to Supabase testimonials table
const submitTestimonial = async () => {
  if (!name.value.trim() || !role.value.trim() || !body.value.trim()) {
    errorMessage.value = 'Mohon lengkapi Nama, Peran/Jabatan, dan Ulasan Anda.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const { $supabase } = useNuxtApp()
    if (!$supabase) {
      throw new Error('Koneksi database tidak tersedia.')
    }

    const payload = {
      name: name.value.trim(),
      role: role.value.trim(),
      body: body.value.trim(),
      rating: Number(rating.value) || 5,
      avatar_url: avatarUrl.value ? avatarUrl.value.trim() : null
    }

    const { error } = await $supabase
      .from('testimonials')
      .insert([payload])

    if (error) throw error

    isSubmitted.value = true
  } catch (err) {
    errorMessage.value = 'Gagal mengirim testimoni: ' + err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.testi-page-wrapper {
  min-height: 100vh;
}

.testi-section {
  padding: 120px 20px 80px;
}

.hero-content {
  text-align: center;
  margin: 0 auto 35px;
}

.hero-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin: 15px 0 10px;
  color: #ffffff;
}

.hero-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.6;
}

.form-card-box {
  background: var(--bg-secondary, #141414);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

@media (max-width: 640px) {
  .form-card-box {
    padding: 24px 18px;
  }
}

.testi-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label-bold {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary, #c5a880);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Star Rating */
.rating-selection-group {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(197, 168, 128, 0.25);
  border-radius: 12px;
  padding: 18px 20px;
  text-align: center;
}

.star-picker-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.star-rating-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.star-btn {
  background: transparent;
  border: none;
  font-size: 2.2rem;
  color: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
}

.star-btn:hover {
  transform: scale(1.22);
}

.star-btn.is-active {
  color: #fbbf24;
  text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
}

.rating-feedback-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e5e7eb;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.25);
  padding: 5px 14px;
  border-radius: 20px;
}

/* Inputs */
.testi-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.testi-input:focus {
  border-color: var(--text-primary, #c5a880);
  box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.15);
}

.testi-textarea {
  resize: vertical;
  min-height: 110px;
  line-height: 1.5;
}

/* Avatar Upload Area */
.avatar-upload-area {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
}

.avatar-preview-box {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--text-primary, #c5a880);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #6b7280;
  font-size: 1.4rem;
}

.avatar-upload-actions {
  flex: 1;
}

.upload-btn-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(197, 168, 128, 0.12);
  border: 1px solid rgba(197, 168, 128, 0.3);
  color: var(--text-primary, #c5a880);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn-label:hover {
  background: rgba(197, 168, 128, 0.25);
  color: #ffffff;
}

.avatar-hint-text {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 5px 0 0 0;
}

/* Error Alert */
.error-msg-box {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Submit CTA */
.submit-testi-btn {
  width: 100%;
  background: var(--text-primary, #8a7051);
  color: #ffffff;
  border: none;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 16px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  margin-top: 10px;
}

.submit-testi-btn:hover:not(:disabled) {
  background: #a38561;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(138, 112, 81, 0.35);
}

.submit-testi-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Screen */
.success-screen {
  text-align: center;
  padding: 20px 10px;
}

.success-header {
  margin-bottom: 25px;
}

.success-icon-ring {
  width: 70px;
  height: 70px;
  background: rgba(16, 185, 129, 0.12);
  border: 2px solid #10b981;
  color: #10b981;
  font-size: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
}

.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
}

.success-subtitle {
  color: #9ca3af;
  font-size: 0.92rem;
  line-height: 1.6;
}

.submitted-review-preview {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(197, 168, 128, 0.3);
  border-radius: 12px;
  padding: 22px;
  max-width: 500px;
  margin: 0 auto 30px;
  text-align: left;
}

.review-preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.review-avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder-sm {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.preview-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.preview-role {
  font-size: 0.78rem;
  color: #9ca3af;
}

.preview-stars {
  color: #fbbf24;
  font-size: 0.9rem;
  display: flex;
  gap: 3px;
  margin-bottom: 10px;
}

.preview-body {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  line-height: 1.5;
  margin: 0;
}

.success-actions-grid {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.animate-scale {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

