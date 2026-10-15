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

                  <!-- Lainnya / Custom Option -->
                  <label 
                    class="checkbox-card"
                    :class="{ 'is-checked': showCustomInput }"
                    @click.prevent="toggleCustomInput"
                    style="cursor: pointer;"
                  >
                    <div class="checkbox-box">
                      <i class="fas fa-check" v-if="showCustomInput"></i>
                    </div>
                    <span class="checkbox-label">
                      <i class="fas fa-pen" style="font-size: 0.8rem; margin-right: 4px; opacity: 0.7;"></i>
                      Lainnya (Kustom)
                    </span>
                  </label>
                </div>

                <!-- Custom service input field (shown when Lainnya is checked) -->
                <div v-if="showCustomInput" class="custom-service-input-wrap">
                  <div style="position: relative;">
                    <i class="fas fa-pen" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-primary, #8a7051); font-size: 0.85rem;"></i>
                    <input
                      type="text"
                      v-model="customServiceInput"
                      @input="onCustomServiceInput"
                      placeholder="Tuliskan jenis layanan yang Anda butuhkan..."
                      class="custom-service-text-input"
                      style="padding-left: 40px;"
                      maxlength="120"
                    />
                  </div>
                  <small style="color: #9ca3af; font-size: 0.78rem; margin-top: 5px; display: block;">
                    <i class="fas fa-info-circle"></i> Tulis layanan kustom yang tidak ada di daftar di atas.
                  </small>
                </div>
              </div>
              <div class="form-group">
                <label>CATATAN_MISI</label>
                <textarea v-model="orderNotes" rows="4" placeholder="Detail pesanan atau request khusus..."></textarea>
              </div>

              <!-- Payment Section -->
              <!-- <div class="payment-info" style="margin-top: 30px; background: rgba(5, 223, 114, 0.05);">
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
              </div> -->

              <button type="submit" class="service-cta" :disabled="isSubmitting"
                style="width: 100%; border: none; cursor: pointer; margin-top: 30px; padding: 20px;">
                <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin"></i> PROCESSING_UPLINK...</span>
                <span v-else><i class="fas fa-paper-plane"></i> KIRIM PESANAN & BAYAR SEKARANG</span>
              </button>
            </form>
          </template>

          <template v-else>
            <div class="success-screen">
              <!-- Success Icon & Header -->
              <div class="success-header">
                <div class="success-icon-ring">
                  <i class="fas fa-check"></i>
                </div>
                <h2 class="success-title">PESANAN TERKIRIM!</h2>
                <p class="success-subtitle">
                  Terima kasih, pesanan Anda telah kami terima.<br>
                  Selesaikan pembayaran melalui salah satu metode di bawah ini.
                </p>
              </div>

              <!-- Payment Methods Grid -->
              <div class="success-payment-section">
                <div class="success-section-label">
                  <i class="fas fa-credit-card"></i> METODE PEMBAYARAN
                </div>

                <div class="payment-cards-grid">

                  <!-- Bank BRI Card -->
                  <div class="payment-brand-card bri-card">
                    <div class="brand-card-top">
                      <div class="brand-logo bri-logo">
                        <span class="bri-text">BRI</span>
                      </div>
                      <div class="brand-badge">Transfer Bank</div>
                    </div>
                    <div class="brand-card-number">001001061913504</div>
                    <div class="brand-card-name">
                      <i class="fas fa-user-circle" style="font-size: 0.75rem;"></i>
                      A.n Mohamad Khoirul Anam
                    </div>
                    <button 
                      type="button" 
                      class="copy-btn"
                      @click="copyToClipboard('001001061913504', 'bri')"
                      :class="{ 'copied': copiedKey === 'bri' }"
                    >
                      <i :class="copiedKey === 'bri' ? 'fas fa-check' : 'fas fa-copy'"></i>
                      {{ copiedKey === 'bri' ? 'Tersalin!' : 'Salin No. Rekening' }}
                    </button>
                  </div>

                  <!-- DANA Card -->
                  <div class="payment-brand-card dana-card">
                    <div class="brand-card-top">
                      <div class="brand-logo dana-logo">
                        <span class="dana-text">DANA</span>
                      </div>
                      <div class="brand-badge">E-Wallet</div>
                    </div>
                    <div class="brand-card-number">085943548498</div>
                    <div class="brand-card-name">
                      <i class="fas fa-user-circle" style="font-size: 0.75rem;"></i>
                      A.n Mohamad Khoirul Anam
                    </div>
                    <button 
                      type="button" 
                      class="copy-btn"
                      @click="copyToClipboard('085943548498', 'dana')"
                      :class="{ 'copied': copiedKey === 'dana' }"
                    >
                      <i :class="copiedKey === 'dana' ? 'fas fa-check' : 'fas fa-copy'"></i>
                      {{ copiedKey === 'dana' ? 'Tersalin!' : 'Salin Nomor' }}
                    </button>
                  </div>

                  <!-- ShopeePay Card -->
                  <div class="payment-brand-card shopee-card">
                    <div class="brand-card-top">
                      <div class="brand-logo shopee-logo">
                        <i class="fas fa-shopping-bag" style="color: #ffffff; font-size: 1rem; margin-right: 5px;"></i>
                        <span class="shopee-text">ShopeePay</span>
                      </div>
                      <div class="brand-badge">E-Wallet</div>
                    </div>
                    <div class="brand-card-number">081323596022</div>
                    <div class="brand-card-name">
                      <i class="fas fa-user-circle" style="font-size: 0.75rem;"></i>
                      A.n Mohamad Khoirul Anam
                    </div>
                    <button 
                      type="button" 
                      class="copy-btn"
                      @click="copyToClipboard('081323596022', 'shopee')"
                      :class="{ 'copied': copiedKey === 'shopee' }"
                    >
                      <i :class="copiedKey === 'shopee' ? 'fas fa-check' : 'fas fa-copy'"></i>
                      {{ copiedKey === 'shopee' ? 'Tersalin!' : 'Salin Nomor' }}
                    </button>
                  </div>

                </div>

                <!-- Payment note -->
                <div class="payment-dp-note">
                  <i class="fas fa-info-circle" style="color: #fbbf24; flex-shrink: 0;"></i>
                  <span>
                    <strong>DP 50% atau Pelunasan</strong> — Silakan simpan bukti transfer dan konfirmasi via WhatsApp di bawah.
                  </span>
                </div>
              </div>

              <!-- WhatsApp Confirm Button -->
              <a :href="waRedirectionUrl" target="_blank" class="service-cta wa-confirm-btn">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i> KONFIRMASI PEMBAYARAN VIA WHATSAPP
              </a>

              <div style="margin-top: 18px; text-align: center;">
                <NuxtLink to="/shop" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.8rem; letter-spacing: 1px;">
                  <i class="fas fa-arrow-left"></i> Kembali ke Shop
                </NuxtLink>
              </div>
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

const defaultAvailableServices = [
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

const availableServices = ref([...defaultAvailableServices])

const isSubmitting = ref(false)
const isSubmitted = ref(false)

// Copy-to-clipboard state for payment numbers
const copiedKey = ref('')
const copyToClipboard = async (text, key) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = '' }, 2000)
  } catch {
    // fallback silent
  }
}

// "Lainnya / Kustom" option state
const showCustomInput = ref(false)
const customServiceInput = ref('')
const CUSTOM_KEY = '__CUSTOM__'

const toggleCustomInput = () => {
  showCustomInput.value = !showCustomInput.value
  if (!showCustomInput.value) {
    // Remove custom entry from selectedServices when unchecked
    customServiceInput.value = ''
    selectedServices.value = selectedServices.value.filter(s => !s.startsWith(CUSTOM_KEY))
  } else {
    // Add placeholder so validation knows it's selected
    if (customServiceInput.value.trim()) {
      selectedServices.value = [...selectedServices.value.filter(s => !s.startsWith(CUSTOM_KEY)), CUSTOM_KEY + customServiceInput.value.trim()]
    }
  }
}

const onCustomServiceInput = () => {
  // Keep selectedServices in sync with what user types
  if (showCustomInput.value) {
    selectedServices.value = [
      ...selectedServices.value.filter(s => !s.startsWith(CUSTOM_KEY)),
      ...(customServiceInput.value.trim() ? [CUSTOM_KEY + customServiceInput.value.trim()] : [])
    ]
  }
}

// Helper: get clean display-ready service list (strips CUSTOM_KEY prefix)
const getCleanServiceList = () => {
  return selectedServices.value.map(s =>
    s.startsWith(CUSTOM_KEY) ? s.replace(CUSTOM_KEY, '') : s
  )
}

onMounted(async () => {
  if (route.query.service) {
    selectedServices.value = [route.query.service]
  }

  try {
    const { $supabase } = useNuxtApp()
    if ($supabase) {
      const { data, error } = await $supabase
        .from('services')
        .select('title, is_active')
        .order('order_num', { ascending: true })

      if (!error && data && data.length > 0) {
        const titles = data.filter(s => s.is_active !== false).map(s => s.title)
        if (titles.length > 0) {
          // If query param service exists and not in list, keep it
          if (route.query.service && !titles.includes(route.query.service)) {
            titles.unshift(route.query.service)
          }
          availableServices.value = titles
        }
      }
    }
  } catch (err) {
    console.warn('Checkout services fetch notice:', err)
  }
})

const waRedirectionUrl = computed(() => {
  const services = getCleanServiceList().join(', ') || ''
  const name = clientName.value || ''
  const text = `Halo Anam, saya sudah melakukan pemesanan ${services} dan ingin konfirmasi pembayaran.`
  return `https://wa.me/6281323596022?text=${encodeURIComponent(text)}`
})

const handleSubmit = async () => {
  // Validate: need at least one selection, and if custom is checked it must have text
  const hasRegularSelection = selectedServices.value.some(s => !s.startsWith(CUSTOM_KEY))
  const hasCustom = showCustomInput.value
  const customText = customServiceInput.value.trim()

  if (!hasRegularSelection && !hasCustom) {
    alert('Silakan pilih minimal satu jenis pemesanan.')
    return
  }

  if (hasCustom && !customText) {
    alert('Anda memilih opsi "Lainnya", harap tuliskan jenis layanan yang Anda butuhkan.')
    return
  }

  isSubmitting.value = true
  
  const cleanServices = getCleanServiceList()
  
  const formData = {
    client_name: clientName.value,
    client_whatsapp: clientWA.value,
    client_email: clientEmail.value,
    order_type: cleanServices.join(', '),
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

/* Success Screen Layout */
.success-screen {
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.success-header {
  text-align: center;
  margin-bottom: 32px;
}

.success-icon-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border: 2px solid rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
}

.success-icon-ring i {
  font-size: 2.2rem;
  color: #10b981;
}

.success-title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.success-subtitle {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* Payment Section Wrapper */
.success-payment-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.success-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-primary, #c5a880);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Payment Brand Cards Grid */
.payment-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .payment-cards-grid {
    grid-template-columns: 1fr;
  }
}

.payment-brand-card {
  border-radius: 12px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.payment-brand-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

.payment-brand-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

/* BRI Brand */
.bri-card {
  background: linear-gradient(135deg, rgba(0, 91, 170, 0.12), rgba(0, 91, 170, 0.05));
  border-color: rgba(0, 91, 170, 0.35);
}

.bri-card::before {
  background: #005BAA;
}

.bri-logo {
  background: #005BAA;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bri-text {
  color: #ffffff;
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 1.5px;
  font-family: 'Arial Black', sans-serif;
}

/* DANA Brand */
.dana-card {
  background: linear-gradient(135deg, rgba(16, 142, 233, 0.12), rgba(16, 142, 233, 0.05));
  border-color: rgba(16, 142, 233, 0.35);
}

.dana-card::before {
  background: linear-gradient(90deg, #108EE9, #1CBDEF);
}

.dana-logo {
  background: linear-gradient(90deg, #108EE9, #1CBDEF);
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dana-text {
  color: #ffffff;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 2px;
  font-family: 'Arial Black', sans-serif;
}

/* ShopeePay Brand */
.shopee-card {
  background: linear-gradient(135deg, rgba(238, 77, 45, 0.12), rgba(238, 77, 45, 0.05));
  border-color: rgba(238, 77, 45, 0.35);
}

.shopee-card::before {
  background: linear-gradient(90deg, #EE4D2D, #FF6B35);
}

.shopee-logo {
  background: linear-gradient(90deg, #EE4D2D, #FF6B35);
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.shopee-text {
  color: #ffffff;
  font-weight: 900;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  font-family: 'Arial Black', sans-serif;
}

/* Card parts */
.brand-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.brand-badge {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.brand-card-number {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
  padding: 4px 0;
}

.brand-card-name {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Copy button */
.copy-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  margin-top: 4px;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.copy-btn.copied {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.5);
  color: #10b981;
}

/* Payment DP note */
.payment-dp-note {
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* WA confirm button */
.wa-confirm-btn {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  width: 100%;
  margin-top: 0;
  box-sizing: border-box;
}

/* Custom / Lainnya input field styles */
.custom-service-input-wrap {
  margin-top: 14px;
  padding: 16px 18px;
  background: rgba(138, 112, 81, 0.07);
  border: 1px solid rgba(197, 168, 128, 0.3);
  border-radius: 8px;
  animation: fadeSlideDown 0.25s ease;
}

@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.custom-service-text-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(197, 168, 128, 0.35);
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.92rem;
  color: var(--text-secondary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.custom-service-text-input:focus {
  outline: none;
  border-color: var(--text-primary, #8a7051);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.12);
  color: #ffffff;
}

body.dark-mode .custom-service-text-input {
  color: rgba(255, 255, 255, 0.85);
}
</style>
