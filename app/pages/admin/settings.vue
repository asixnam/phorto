<template>
  <div id="adminSettings">
    <div class="container" style="max-width: 800px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      
      <!-- Page Header -->
      <div style="margin-bottom: 30px;">
        <h1 style="font-size: 1.8rem; font-weight: bold; margin: 0; color: var(--text-secondary);">Pengaturan Keamanan</h1>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 0.95rem;">Perbarui kunci akses (password) administrator untuk panel kontrol.</p>
      </div>

      <!-- Settings Card -->
      <div class="crud-form-card" style="padding: 30px;">
        <h3 class="form-title" style="font-size:1.1rem; margin-bottom: 20px;">// UPDATE_ACCESS_KEY</h3>
        
        <form @submit.prevent="changePassword" class="admin-form">
          <div class="form-group">
            <label>Kunci Akses Lama (Current Access Key)</label>
            <div style="position: relative;">
              <input 
                :type="showCurrent ? 'text' : 'password'" 
                v-model="currentPassword" 
                class="form-control" 
                required 
                placeholder="Masukkan password saat ini"
              />
              <i 
                :class="['fas', showCurrent ? 'fa-eye-slash' : 'fa-eye']"
                @click="showCurrent = !showCurrent"
                style="position: absolute; right: 15px; top: 12px; cursor: pointer; opacity: 0.5; color: var(--text-secondary);"
              ></i>
            </div>
          </div>

          <div class="form-group">
            <label>Kunci Akses Baru (New Access Key)</label>
            <div style="position: relative;">
              <input 
                :type="showNew ? 'text' : 'password'" 
                v-model="newPassword" 
                class="form-control" 
                required 
                placeholder="Masukkan password baru"
              />
              <i 
                :class="['fas', showNew ? 'fa-eye-slash' : 'fa-eye']"
                @click="showNew = !showNew"
                style="position: absolute; right: 15px; top: 12px; cursor: pointer; opacity: 0.5; color: var(--text-secondary);"
              ></i>
            </div>
          </div>

          <div class="form-group">
            <label>Konfirmasi Kunci Akses Baru (Confirm New Access Key)</label>
            <div style="position: relative;">
              <input 
                :type="showConfirm ? 'text' : 'password'" 
                v-model="confirmPassword" 
                class="form-control" 
                required 
                placeholder="Ulangi password baru"
              />
              <i 
                :class="['fas', showConfirm ? 'fa-eye-slash' : 'fa-eye']"
                @click="showConfirm = !showConfirm"
                style="position: absolute; right: 15px; top: 12px; cursor: pointer; opacity: 0.5; color: var(--text-secondary);"
              ></i>
            </div>
          </div>

          <div v-if="successMsg" class="alert-message success">
            <i class="fas fa-check-circle"></i> {{ successMsg }}
          </div>
          <div v-if="errorMsg" class="alert-message danger">
            <i class="fas fa-exclamation-triangle"></i> {{ errorMsg }}
          </div>

          <button type="submit" class="btn-submit" :disabled="isUpdating">
            <span v-if="isUpdating"><i class="fas fa-spinner fa-spin"></i> MEMPROSES...</span>
            <span v-else><i class="fas fa-save"></i> Simpan Password Baru</span>
          </button>
        </form>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/admin/dashboard" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.85rem;">
          <i class="fas fa-arrow-left"></i> Kembali ke Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const isUpdating = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    if (!session) {
      navigateTo('/admin')
    }
  }
})

const changePassword = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Password baru dan konfirmasi tidak cocok!'
    return
  }

  isUpdating.value = true

  try {
    const { $supabase } = useNuxtApp()

    // 1. Fetch current password to verify
    const { data, error: fetchErr } = await $supabase
      .from('admin_config')
      .select('value')
      .eq('key', 'admin_password')
      .single()

    if (fetchErr) throw new Error("Gagal mengambil data dari database. Silakan pastikan tabel 'admin_config' telah dibuat.")

    if (data.value !== currentPassword.value.trim()) {
      throw new Error("Password saat ini salah!")
    }

    // 2. Update to new password
    const { error: updateErr } = await $supabase
      .from('admin_config')
      .update({ value: newPassword.value.trim() })
      .eq('key', 'admin_password')

    if (updateErr) throw updateErr

    successMsg.value = 'Password berhasil diubah!'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
/* Follow the same dashboard card styles */
.crud-form-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-title {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  opacity: 0.8;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: var(--font-main);
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--text-primary);
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-submit {
  padding: 12px 20px;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: 1px solid var(--text-primary);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  background-color: transparent;
  color: var(--text-primary);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert-message {
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-message.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.alert-message.danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
