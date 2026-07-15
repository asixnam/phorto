<template>
  <div>
    <section class="checkout-section" style="padding: 120px 20px 60px;">
      <div class="container" style="max-width: 800px;">
        <div style="text-align: center; margin-bottom: 50px;">
          <div class="section-tag" style="display: inline-block;">// ORDER_UPLINK_ESTABLISHED</div>
          <h1 class="hero-title" style="font-size: clamp(2.5rem, 10vw, 80px); margin: 20px 0;">KONFIRMASI PESANAN</h1>
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
                <label>JENIS_PEMESANAN</label>
                <select v-model="serviceNameInput" required class="form-select">
                  <option value="" disabled selected>Pilih Layanan</option>
                  <option value="Desain Logo">Desain Logo</option>
                  <option value="Desain Kaos">Desain Kaos</option>
                  <option value="Feed Instagram">Feed Instagram</option>
                  <option value="Desain Stiker">Desain Stiker</option>
                  <option value="Desain Mug">Desain Mug</option>
                  <option value="Desain Lanyard">Desain Lanyard</option>
                  <option value="Desain ID Card">Desain ID Card</option>
                  <option value="Pembuatan Website">Pembuatan Website</option>
                  <option value="Fotografi">Fotografi</option>
                  <option value="Desain Cover Buku">Desain Cover Buku</option>
                </select>
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
const serviceNameInput = ref('')
const orderNotes = ref('')

const isSubmitting = ref(false)
const isSubmitted = ref(false)

onMounted(() => {
  if (route.query.service) {
    serviceNameInput.value = route.query.service
  }
})

const waRedirectionUrl = computed(() => {
  const service = serviceNameInput.value || ''
  const name = clientName.value || ''
  const text = `Halo Anam, saya sudah melakukan pemesanan ${service} dan ingin konfirmasi pembayaran.`
  return `https://wa.me/6281323596022?text=${encodeURIComponent(text)}`
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  const formData = {
    client_name: clientName.value,
    client_whatsapp: clientWA.value,
    client_email: clientEmail.value,
    order_type: serviceNameInput.value,
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
