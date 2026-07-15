<script setup>
const services = [
  {
    title: 'Desain Logo',
    description: 'Pembuatan logo profesional yang mencerminkan identitas bisnis Anda dengan desain yang unik dan memorable.',
    image: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000',
    tags: ['Custom Design', 'Multiple Revisions', 'Vector Format', 'Start From 100k'],
    link: '/checkout?service=Desain Logo'
  },
  {
    title: 'Desain Kaos',
    description: 'Desain kaos kreatif untuk brand personal, acara, atau bisnis dengan pilihan style yang beragam.',
    image: 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000',
    tags: ['Desain Kustom', 'Mockup Preview', 'Start From 100k'],
    link: '/checkout?service=Desain Kaos'
  },
  {
    title: 'Feed Instagram',
    description: 'Desain feed Instagram yang aesthetic dan konsisten untuk meningkatkan visual branding akun Anda.',
    image: 'https://lh3.googleusercontent.com/d/1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4=w1000',
    tags: ['Grid Layout', 'Tema Konsisten', 'HD Resolution', 'Start From 50k'],
    link: '/checkout?service=Feed Instagram'
  },
  {
    title: 'Desain Stiker',
    description: 'Desain stiker unik dan eye-catching untuk produk, merchandise, atau keperluan promosi bisnis.',
    image: 'https://lh3.googleusercontent.com/d/1pkCZDxiUV-_ylQEw0A_Ce6GwyF2S_P22=w1000',
    tags: ['Custom Design', 'Berbagai Ukuran', 'Print Ready', 'Start From 40k'],
    link: '/checkout?service=Desain Stiker'
  },
  {
    title: 'Desain Mug',
    description: 'Desain mug berkualitas untuk merchandise, hadiah, atau koleksi pribadi dengan hasil print yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/10mS9Kp2baYjRZtwHcJB-VgRlGF4QE-31=w1000',
    tags: ['Custom Design', 'Mockup Preview', 'Start From 50k'],
    link: '/checkout?service=Desain Mug'
  },
  {
    title: 'Desain Lanyard',
    description: 'Desain lanyard profesional untuk acara, identitas karyawan, atau merchandise dengan detail yang sempurna.',
    image: 'https://lh3.googleusercontent.com/d/1hI8tTrLVQALecjtQeFcT5fxxo3I1eu-9=w1000',
    tags: ['Custom Design', 'Berbagai Material', 'Print Ready', 'Start From 50k'],
    link: '/checkout?service=Desain Lanyard'
  },
  {
    title: 'Desain ID Card',
    description: 'Desain kartu identitas profesional untuk perusahaan, sekolah, atau organisasi dengan standar kualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1l8B6QSJLEAy7zt-Ve87moX_94ORm3IuX=w1000',
    tags: ['Custom Design', 'PVC Material', 'Print Ready', 'Start From 20k'],
    link: '/checkout?service=Desain ID Card'
  },
  {
    title: 'Pembuatan Website',
    description: 'Pengembangan website profesional menggunakan teknologi terkini untuk memberikan pengalaman pengguna terbaik.',
    image: 'https://lh3.googleusercontent.com/d/1f07kczRvgEMIxRP-VRnkAx4cjG_8-dnX=w1000',
    tags: ['Responsive Design', 'SEO Optimized', 'Full Support', 'Start From 5jt'],
    link: '/checkout?service=Pembuatan Website'
  },
  {
    title: 'Fotografi',
    description: 'Jasa fotografi profesional untuk acara, produk, atau keperluan komersial dengan hasil berkualitas tinggi.',
    image: 'https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl=w1000',
    tags: ['Foto & Editing', 'Profesional', 'Berbagai Paket', 'Start From 300k'],
    link: '/checkout?service=Fotografi'
  },
  {
    title: 'Desain Cover Buku',
    description: 'Desain cover buku yang menarik dan profesional untuk merepresentasikan isi cerita atau materi buku Anda.',
    image: 'https://lh3.googleusercontent.com/d/1CEgGGx3TLvtYUWR4a0QCRHX7_YeRFHYc=w1000',
    tags: ['Custom Design', '3D Mockup', 'Print Ready', 'Start From 50k'],
    link: '/checkout?service=Desain Cover Buku'
  }
]
</script>

<template>
  <div>
    <section id="shop" class="shop" style="padding-top: 120px;">
      <div class="container" style="text-align: center;">
        <div class="section-tag">// SERVICE_CAPABILITIES_UPLINK</div>
        <h2 class="section-title">Layanan <span>Freelance</span></h2>
        <p class="section-subtitle">Deep search successfully... <span class="typing-effect">decrypted_services_established</span></p>

        <!-- Services Grid -->
        <div class="services-grid">
          <div v-for="service in services" :key="service.title" class="service-card">
            <div class="service-image-wrapper">
              <img :src="service.image" :alt="service.title" class="service-card-img" loading="lazy" />
            </div>
            <div class="service-details">
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-features">
                <span v-for="tag in service.tags" :key="tag" class="feature-tag">{{ tag }}</span>
              </div>
              <NuxtLink :to="service.link" class="service-cta">
                <i class="fas fa-shopping-cart"></i> Pesan Sekarang
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <section id="contact" class="signal-uplink" style="margin-top: 40px; padding: 60px 0; border-radius: 20px;">
          <div class="signal-header">
            <div class="section-tag">MISSION_DOSSIER</div>
            <span class="binary-code">COMMUNICATION UPLINK</span>
            <h2 class="connection-title">START PROJECT</h2>
          </div>

          <div class="signal-card" style="max-width: 800px; margin: 0 auto;">
            <p class="signal-text text-center">
              Hubungi saya untuk konsultasi gratis dan dapatkan penawaran<br>
              terbaik untuk kebutuhan digital Anda.
            </p>

            <div class="signal-actions" style="justify-content: center; gap: 20px; flex-wrap: wrap;">
              <a href="https://wa.me/6281323596022" class="btn-signal" target="_blank" style="background: var(--bg-social); border-color: var(--accent-blue); color: var(--accent-blue);">
                <i class="fab fa-whatsapp"></i>
                Chat WhatsApp
              </a>
              <NuxtLink to="/checkout" class="btn-signal">
                <i class="fas fa-shopping-cart"></i>
                Pesan Sekarang
              </NuxtLink>
            </div>

            <div class="terminal-status">
              <div class="status-bars">
                <div class="bar" style="background: rgba(37, 211, 102, 0.1);"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
              SYSTEM READY
            </div>
          </div>
        </section>

      </div>
    </section>
  </div>
</template>
