<template>
  <div>
    <!-- Hero Section -->
    <section class="hero hero-landing hero-index">
      <!-- Background Portfolio Slides (Seamless Loop) -->
      <div class="hero-bg-slides">
        <div class="slides-track">
          <!-- Slide Set 1 -->
          <img src="https://lh3.googleusercontent.com/d/1Ow8UureIlvkddCZAj5utU2nHciwnjFmp=w1000" alt="Instagram Feed Design" class="slide-img" />
          <img src="https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl=w1000" alt="Photo Graph" class="slide-img" />
          <img src="https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000" alt="Logo Design" class="slide-img" />
          <!-- Slide Set 2 (Duplicate for Seamless Loop) -->
          <img src="https://lh3.googleusercontent.com/d/1Ow8UureIlvkddCZAj5utU2nHciwnjFmp=w1000" alt="Instagram Feed Design" class="slide-img" />
          <img src="https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl=w1000" alt="Photo Graph" class="slide-img" />
          <img src="https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000" alt="Logo Design" class="slide-img" />
        </div>
      </div>

      <!-- Dynamic Hero Background Overlay -->
      <div class="hero-bg-image" style="background-image: url('/dekstop.png');"></div>
      <div class="hero-overlay-gradient"></div>

      <div class="container hero-container">
        <div class="hero-content">
          <!-- <div class="hero-tag">Selamat Datang</div> -->
          <h1 class="hero-title">Ciptakan Kenanganmu <span class="name-blue">& Kembangkan Kreasimu</span></h1>
          <!-- <p class="hero-tagline">// VISUAL_LOG_CAPTURE & CODE_UPLINK_OPERATOR</p> -->
          <div class="hero-btns">
            <NuxtLink to="/shop" class="btn-hud btn-cyan"><i class="fas fa-shopping-bag"></i> SHOP</NuxtLink>
            <NuxtLink to="/portfolio" class="btn-hud btn-outline"><i class="fas fa-folder-open"></i> PORTFOLIO</NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom Section - Transparent Box -->
      <div class="hero-bottom">
        <div class="container">
          <div class="bottom-content">
            <!-- Stats -->
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="section-tag">Feed Design</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">20+</div>
                <div class="section-tag">Logo Design</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10+</div>
                <div class="section-tag">PhotoGraph</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">02</div>
                <div class="section-tag">Website</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Freelance Services Section -->
    <section id="services" class="shop" style="padding-top: 100px; padding-bottom: 80px;">
      <div class="container" style="text-align: center;">
        <div class="section-tag">// SERVICE_CAPABILITIES_UPLINK</div>
        <h2 class="section-title">Layanan <span>Freelance</span></h2>
        <p class="section-subtitle">Deep search successfully... <span class="typing-effect">decrypted_services_established</span></p>

        <!-- Services Carousel (Manual Horizontal Scroll) -->
        <div class="services-carousel">
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
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
      <div class="container">
        <div class="section-tag">// CLIENT_TRANSMISSIONS</div>
        <h2 class="section-title">TESTIMONIALS <span>PROJECT</span></h2>

        <div class="testimonials-marquee">
          <div class="testimonials-row row-right">
            <div class="testimonials-inner">
              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Agna Nia Zahra</h4>
                    <span class="client-role">Wakil Ketua KAMABA Yogyakarta</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>"Setiap produk punya pasarnya sendiri, namun desain ini kurang cocok bagi saya. Kata "Born in Blora"
                    kurang menarik; bagian depan lebih bagus jika tulisan "Blora" saja. Bagian belakang sebaiknya dipecah
                    menjadi tiga tema berbeda agar identitasnya lebih kuat dan fokus"</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <img src="https://lh3.googleusercontent.com/d/1KFBd8nRIoo12jcXgfrWFyV7q-s6eFUv2" alt="Client Avatar">
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Luthfi Nishfi</h4>
                    <span class="client-role">Alumni Mahasiswi UNU Yogyakarta</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>"bagus banget hasil fotonya"</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <img src="https://lh3.googleusercontent.com/d/1beIbT6eVGa-vlCkGVyF6XTGQuKiILE_0" alt="Client Avatar">
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Franciska Nur Widya Ningrum</h4>
                    <span class="client-role">Guru Bahasa Inggris</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>"Coming Soon"</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <img src="https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl" alt="Client Avatar">
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Anik Ida Wijayanti</h4>
                    <span class="client-role">Mahasiswa UNY</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>Oke jujur ya… ini fotografer vibes-nya mantepp poll😭
                    Hasil fotonya? GILA SIH 🔥
                    Candid dapet, pose juga tetep natural. Yang biasanya aku awkward depan kamera aja bisa keliatan santai 😆
                    Editannya juga nggak lebay— clean, aesthetic , dan tetep “aku bgt”. Jadi nggak yang tiba-tiba muka berubah jadi orang lain wkwk.
                    Yang paling aku suka: dia ngerti vibe .
                    Mau foto yang chill , fun , atau agak cinematic dikit, semuanya kena </p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Erma</h4>
                    <span class="client-role">Founder Ermora</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>"Kemarin request logo buat fashion Designnya cepet, rapi, minimalis, harga sesuai budget mau
                    mahaallllll banget bisa, mau yang murahhh pun bisa 🔥 Ultra HD hasilnya, ga pecah2 juga aman di cetak
                    dikain"</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Agus Prasetya</h4>
                    <span class="client-role">Founder Mahara</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>Designya bagus, pengerjaan cepat, hasil memuaskan</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>

              <div class="testimonial-card">
                <div class="testimonial-header">
                  <div class="client-avatar">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <div class="client-info">
                    <h4 class="client-name">Erin Gayatri</h4>
                    <span class="client-role">Diretur Center For GEDSI</span>
                  </div>
                </div>
                <div class="testimonial-body">
                  <p>Selama di Media Center GEDSI UNU Yogyakarta, Anam berkontribusi besar dalam desain konten kreatif dan
                    video pendek, termasuk proyek kolaborasi skala besar. Ia bekerja cepat, komunikatif dalam revisi,
                    serta piawai dalam dokumentasi kegiatan. Sosok yang santun dan mudah berbaur ini memiliki potensi
                    besar untuk karier yang cemerlang.</p>
                </div>
                <div class="testimonial-footer">
                  <div class="rating">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Signal Uplink Section -->
    <section id="contact" class="signal-uplink">
      <div class="container">
        <div class="signal-header">
          <div class="section-tag">MISSION_DOSSIER</div>
          <span class="binary-code">PROJECT ARCHIVE</span>
          <h2 class="connection-title">CONNECTION</h2>
        </div>

        <div class="signal-card">
          <p class="signal-text">
            Retrieving encrypted repositories...<br>
            Selected projects successfully decrypted.
          </p>

          <div class="signal-actions">
            <NuxtLink to="/portfolio" class="btn-signal">
              <i class="fas fa-broadcast-tower"></i>
              Lihat Semua Karya
            </NuxtLink>
            <a href="https://github.com/asixnam" target="_blank" rel="noopener noreferrer" class="social-btn-mini">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/asixnam" target="_blank" rel="noopener noreferrer" class="social-btn-mini">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>

          <div class="terminal-status">
            <div class="status-bars">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
            TERMINAL ONLINE
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

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
