
// Supabase Configuration
const SUPABASE_URL = 'https://nmlxivljaduwpttsxgoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhpdmxqYWR1d3B0dHN4Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODAxNjQsImV4cCI6MjA5Mjg1NjE2NH0.ApzztRY7eKPV0Ivo5aOv_0vjgxAG2gDM3HhuFSle4SI';

// Initialize Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Modal DOM Elements
const orderModal = document.getElementById('orderModal');
const loginModal = document.getElementById('loginModal');
const orderForm = document.getElementById('orderForm');
const loginForm = document.getElementById('loginForm');
const closeOrderModal = document.getElementById('closeOrderModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const serviceNameInput = document.getElementById('serviceNameInput');

// Open Modal when "Pesan Sekarang" is clicked
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.service-cta, .btn-signal');
    if (btn && btn.textContent.includes('Pesan Sekarang')) {
        e.preventDefault();
        
        // Find the service name from the card
        const card = btn.closest('.service-card');
        const serviceName = card ? card.querySelector('.service-title').textContent : '';
        
        if (serviceName) {
            serviceNameInput.value = serviceName;
        }
        
        orderModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }
});

// Close Modals
[closeOrderModal, closeLoginModal].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            orderModal.style.display = 'none';
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// Handle Form Submission (CREATE)
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const formData = {
            client_name: document.getElementById('clientName').value,
            client_whatsapp: document.getElementById('clientWA').value,
            client_email: document.getElementById('clientEmail').value,
            order_type: serviceNameInput.value,
            order_notes: document.getElementById('orderNotes').value,
            status: 'pending',
            payment_status: 'unpaid'
        };

        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([formData]);

            if (error) throw error;

            alert('Order Berhasil Dikirim! Silakan konfirmasi pembayaran melalui WhatsApp.');
            
            // Redirect to WhatsApp for confirmation
            const waMessage = `Halo Anam, saya sudah melakukan pemesanan ${formData.order_type} atas nama ${formData.client_name}.`;
            window.open(`https://wa.me/6281323596022?text=${encodeURIComponent(waMessage)}`, '_blank');

            orderForm.reset();
            orderModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            if (document.getElementById('dashboardSection').style.display !== 'none') {
                fetchOrders();
            }

        } catch (error) {
            console.error('Error:', error.message);
            alert('Gagal mengirim pesanan: ' + error.message);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Admin Login Handling
const adminBtn = document.getElementById('adminBtn');
const dashboardSection = document.getElementById('dashboardSection');
const ordersTableBody = document.getElementById('ordersTableBody');

if (adminBtn) {
    adminBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === 'anam123') { // Ganti dengan password yang lebih kuat jika perlu
            loginModal.style.display = 'none';
            dashboardSection.style.display = 'block';
            fetchOrders();
            dashboardSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Access Denied: Invalid Key');
        }
    });
}

async function fetchOrders() {
    ordersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading orders...</td></tr>';
    
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data.length === 0) {
            ordersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada pesanan.</td></tr>';
            return;
        }

        ordersTableBody.innerHTML = '';
        data.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td><strong>${order.order_type}</strong></td>
                <td>${order.client_name}<br><small>${order.client_email}</small></td>
                <td><a href="https://wa.me/${order.client_whatsapp}" target="_blank">${order.client_whatsapp}</a></td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select ${order.status}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td>
                   <span class="status-badge ${order.payment_status}">${order.payment_status}</span>
                </td>
                <td>
                    <button onclick="deleteOrder('${order.id}')" class="btn-delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error:', error.message);
        ordersTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Error: ${error.message}</td></tr>`;
    }
}

// UPDATE Status
window.updateOrderStatus = async (id, newStatus) => {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;
        fetchOrders();
    } catch (error) {
        alert('Update failed: ' + error.message);
    }
};

// DELETE Order
window.deleteOrder = async (id) => {
    if (!confirm('Hapus pesanan ini secara permanen?')) return;
    
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
        fetchOrders();
    } catch (error) {
        alert('Delete failed: ' + error.message);
    }
};
