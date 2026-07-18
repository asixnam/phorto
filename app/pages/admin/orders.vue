<template>
  <div id="adminDashboard">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 20px; padding-bottom: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
        <h2 class="form-title" style="margin:0">// DAFTAR_PESANAN_MASUK</h2>
      </div>

      <!-- Table Section -->
      <div class="dashboard-section" style="display: block; background: transparent; padding: 0;">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Layanan</th>
              <th>Klien</th>
              <th>WhatsApp</th>
              <th>Catatan</th>
              <th>Status</th>
              <th>Pembayaran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" style="text-align:center; padding: 40px;">ACCESSING_DATABASE...</td>
            </tr>
            <tr v-else-if="errorMsg">
              <td colspan="8" style="text-align:center; color: red; padding: 40px;">ERROR: {{ errorMsg }}</td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="8" style="text-align:center; padding: 40px;">NO_DATA_FOUND</td>
            </tr>
            <tr v-else v-for="order in orders" :key="order.id">
              <td data-label="Tanggal">{{ new Date(order.created_at).toLocaleDateString() }}</td>
              <td data-label="Layanan" style="color: var(--text-primary)">{{ order.order_type }}</td>
              <td data-label="Klien">
                {{ order.client_name }}<br>
                <small style="opacity:0.5">{{ order.client_email }}</small>
              </td>
              <td data-label="WhatsApp">
                <a :href="'https://wa.me/' + order.client_whatsapp" target="_blank" style="color: #25D366; text-decoration:none">
                  <i class="fab fa-whatsapp"></i> {{ order.client_whatsapp }}
                </a>
              </td>
              <td data-label="Catatan" style="font-size: 0.8rem; max-width: 200px; white-space: normal;">
                {{ order.order_notes || '-' }}
              </td>
              <td data-label="Status">
                <select 
                  @change="updateOrderStatus(order.id, $event.target.value)" 
                  :class="['status-select', order.status]"
                >
                  <option value="pending" :selected="order.status === 'pending'">Pending</option>
                  <option value="in-progress" :selected="order.status === 'in-progress'">In Progress</option>
                  <option value="completed" :selected="order.status === 'completed'">Completed</option>
                </select>
              </td>
              <td data-label="Pembayaran">
                <select 
                  @change="updatePaymentStatus(order.id, $event.target.value)" 
                  :class="['status-badge', order.payment_status]" 
                  style="border:none; cursor:pointer;"
                >
                  <option value="unpaid" :selected="order.payment_status === 'unpaid'">Unpaid</option>
                  <option value="paid" :selected="order.payment_status === 'paid'">Paid</option>
                </select>
              </td>
              <td data-label="Aksi">
                <button @click="deleteOrder(order.id)" class="btn-delete" style="opacity:0.5; border:none; background:none; cursor:pointer;">
                  <i class="fas fa-trash" style="color: #ff0055;"></i>
                </button>
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

definePageMeta({
  layout: 'admin'
})

const orders = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const refreshTrigger = useState('admin-refresh-trigger', () => 0)

watch(refreshTrigger, () => {
  fetchOrders()
})

const fetchOrders = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    orders.value = data || []
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}

const updateOrderStatus = async (id, status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Update failed: ' + err.message)
  }
}

const updatePaymentStatus = async (id, payment_status) => {
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Update failed: ' + err.message)
  }
}

const deleteOrder = async (id) => {
  if (!confirm('DELETE_ORDER_PERMANENTLY?')) return
  
  try {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchOrders()
  } catch (err) {
    alert('Delete failed: ' + err.message)
  }
}

onMounted(async () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (!session) {
      navigateTo('/admin')
    } else {
      await fetchOrders()
    }
  }
})
</script>
