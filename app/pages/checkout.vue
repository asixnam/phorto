<template>
  <div>
    <section class="checkout-section">
      <div class="container" style="max-width: 800px;">
        <div class="hero-content">
          <div class="section-tag" style="display: inline-block;">// ORDER_UPLINK_ESTABLISHED</div>
          <h1 class="hero-title">KONFIRMASI PESANAN</h1>
        </div>

        <div id="checkoutContainer" class="about-card" style="padding: 40px; margin-bottom: 30px;">
          <template v-if="!isSubmitted">
            <form id="orderForm" class="modal-form" @submit.prevent="handleSubmit">
              <div class="form-row">
                <div class="form-group">
                  <label>NAMA_KLIEN</label>
                  <input type="text" v-model="clientName" placeholder="Masukkan nama Anda" required>
                </div>
                <div class="form-group">
                  <label>WHATSAPP_UPLINK</label>
                  <input type="text" v-model="clientWA" placeholder="Contoh: 08123456789" required>
                </div>
              </div>
              <div class="form-group">
                <label>EMAIL_ADDRESS</label>
                <input type="email" v-model="clientEmail" placeholder="nama@email.com" required>
              </div>
              <div class="form-group">
                <label>JENIS_PEMESANAN <span class="label-info">(Bisa pilih lebih dari satu)</span></label>
                <div class="checkbox-grid">
                  <label 
                    v-for="service in availableServices" 
                    :key="service" 
                    class="checkbox-card"
                    :class="{ 'is-checked': selectedServices.includes(service) }"
                  >
                    <input 
                      type="checkbox" 
                      :value="service" 
                      v-model="selectedServices"
                      class="checkbox-input"
                    />
                    <div class="checkbox-box">
                      <i class="fas fa-check" v-if="selectedServices.includes(service)"></i>
                    </div>
                    <span class="checkbox-label">{{ service }}</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>CATATAN_MISI</label>
                <textarea v-model="orderNotes" rows="4" placeholder="Detail pesanan atau request khusus..."></textarea>
              </div>

              <!-- Payment Section -->
              <div class="payment-info" style="margin-top: 30px; background: rgba(5, 223, 114, 0.05);">
                <div class="section-tag">// PAYMENT_GATEWAY</div>
                <div class="payment-details">
                  <div class="payment-method">
                    <i class="fas fa-university"></i>
                    <span>Bank BRI: <strong>001001061913504</strong></span>
                    <small>A.n Mohamad Khoirul Anam</small>
                  </div>
                  <div class="payment-method">
                    <i class="fas fa-wallet"></i>
                    <span>DANA (Aktif): <strong>085943548498 </strong></span>
                    <small>A.n Mohamad Khoirul Anam</small>
                  </div>
                  <div class="payment-method">
                    <i class="fas fa-wallet"></i>
                    <span>ShopeePay: <strong>081323596022 </strong></span>
                    <small>A.n Mohamad Khoirul Anam</small>
                  </div>
                </div>
                <p class="payment-note">*Silakan lakukan pembayaran DP 50% atau Pelunasan untuk memproses antrean.</p>
              </div>

              <button type="submit" class="service-cta" :disabled="isSubmitting"
                style="width: 100%; border: none; cursor: pointer; margin-top: 30px; padding: 20px;">
                <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin"></i> PROCESSING_UPLINK...</span>
                <span v-else><i class="fas fa-paper-plane"></i> KIRIM PESANAN & BAYAR SEKARANG</span>
              </button>
            </form>
          </template>

          <template v-else>
            <div style="text-align: center; animation: slideUp 0.5s ease;">
              <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--text-primary); margin-bottom: 20px;"></i>
              <h2 class="service-title">PESANAN TERKIRIM!</h2>
              <p style="margin-bottom: 30px; opacity: 0.8;">Data Anda telah kami terima. Silakan lakukan pembayaran untuk memproses pesanan.</p>
              
              <div class="payment-info" style="background: rgba(5, 223, 114, 0.05); text-align: left; padding: 25px;">
                <div class="section-tag">// RINCIAN_PEMBAYARAN</div>
                <div class="payment-details" style="margin: 20px 0;">
                  <div class="payment-method" style="font-size: 1.1rem; margin-bottom: 15px;">
                    <i class="fas fa-university"></i>
                    <span>Bank BRI: <br><strong>001001061913504</strong></span>
                    <small style="display:block; margin-top:5px;">A.n Mohamad Khoirul Anam</small>
                  </div>
                  <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0;">
                  <div class="payment-method" style="font-size: 1.1rem;">
                    <i class="fas fa-wallet"></i>
                    <span>DANA: <br><strong>085943548498</strong></span>
                  </div>
                  <div class="payment-method" style="font-size: 1.1rem;">
                    <i class="fas fa-wallet"></i>
                    <span>ShopeePay: <br><strong>081323596022</strong></span>
                  </div>
                </div>
                <p class="payment-note" style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">
                  <strong>TOTAL: DP 50% atau Pelunasan</strong><br>
                  Harap simpan bukti transfer Anda.
                </p>
              </div>

              <a :href="waRedirectionUrl" target="_blank" class="service-cta" style="display: block; margin-top: 30px; text-decoration: none;">
                <i class="fab fa-whatsapp"></i> KONFIRMASI VIA WHATSAPP
              </a>
            </div>
          </template>
        </div>

        <div style="text-align: center;">
          <NuxtLink to="/shop" style="color: var(--text-primary); text-decoration: none; font-size: 0.8rem; letter-spacing: 2px;">
            <i class="fas fa-arrow-left"></i> KEMBALI KE SHOP
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const clientName = ref('')
const clientWA = ref('')
const clientEmail = ref('')
const selectedServices = ref([])
const orderNotes = ref('')

const availableServices = [
  'Desain Logo',
  'Desain Kaos',
  'Feed Instagram',
  'Desain Stiker',
  'Desain Mug',
  'Desain Lanyard',
  'Desain ID Card',
  'Pembuatan Website',
  'Fotografi',
  'Desain Cover Buku'
]

const isSubmitting = ref(false)
const isSubmitted = ref(false)

onMounted(() => {
  if (route.query.service) {
    selectedServices.value = [route.query.service]
  }
})

const waRedirectionUrl = computed(() => {
  const services = selectedServices.value.join(', ') || ''
  const name = clientName.value || ''
  const text = `Halo Anam, saya sudah melakukan pemesanan ${services} dan ingin konfirmasi pembayaran.`
  return `https://wa.me/6281323596022?text=${encodeURIComponent(text)}`
})

const handleSubmit = async () => {
  if (selectedServices.value.length === 0) {
    alert('Silakan pilih minimal satu jenis pemesanan.')
    return
  }
  isSubmitting.value = true
  
  const formData = {
    client_name: clientName.value,
    client_whatsapp: clientWA.value,
    client_email: clientEmail.value,
    order_type: selectedServices.value.join(', '),
    order_notes: orderNotes.value,
    status: 'pending',
    payment_status: 'unpaid'
  }

  try {
    const { $supabase } = useNuxtApp()
    
    // In Nuxt plugin structure, $supabase is attached to the Nuxt App Context
    const { error } = await $supabase
      .from('orders')
      .insert([formData])

    if (error) throw error

    isSubmitted.value = true
    
    // Auto-open WhatsApp in a new tab as original logic
    const waMessage = `Halo Anam, saya sudah melakukan pemesanan ${formData.order_type} atas nama ${formData.client_name}.`
    window.open(`https://wa.me/6281323596022?text=${encodeURIComponent(waMessage)}`, '_blank')
  } catch (err) {
    alert('Gagal mengirim pesanan: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-section {
  padding: 120px 20px 60px;
}

.container {
  margin: 0 auto;
}

.hero-content {
  text-align: center;
  margin: 0 auto 40px !important;
}

.hero-title {
  text-align: center;
  width: 100%;
  white-space: normal !important;
  word-break: break-word;
  margin: 20px 0 !important;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  padding: 14px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  user-select: none;
}

.checkbox-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--text-primary);
  transform: translateY(-1px);
}

.checkbox-card.is-checked {
  background: rgba(138, 112, 81, 0.1);
  border-color: var(--text-primary);
  box-shadow: 0 0 10px rgba(138, 112, 81, 0.15);
}

body.dark-mode .checkbox-card.is-checked {
  background: rgba(197, 168, 128, 0.12);
  border-color: var(--text-primary);
  box-shadow: 0 0 12px rgba(197, 168, 128, 0.2);
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;
  background: transparent;
  flex-shrink: 0;
}

.checkbox-card.is-checked .checkbox-box {
  background: var(--text-primary);
  border-color: var(--text-primary);
}

.checkbox-box i {
  color: var(--bg-primary);
  font-size: 0.75rem;
}

.checkbox-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.label-info {
  color: var(--text-primary);
  font-size: 0.75rem;
  font-family: var(--font-main);
  opacity: 0.7;
  margin-left: 5px;
}

/* Form inputs styling & neater layouts */
.form-group input,
.form-group textarea {
  transition: border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--text-primary);
  outline: none;
  box-shadow: 0 0 8px rgba(197, 168, 128, 0.15);
}

.form-group {
  margin-bottom: 5px;
}

.payment-info {
  border-radius: 6px;
  border: 1px solid var(--border-color);
  transition: border-color 0.25s ease;
}

.payment-info:hover {
  border-color: var(--text-primary);
}

/* Responsiveness adjustments for checkout */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr !important;
    gap: 15px;
  }
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>
