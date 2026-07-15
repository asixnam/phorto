<template>
  <div>
    <section class="hero hero-landing hero-cv">
      <!-- Dynamic Hero Background Overlay -->
      <div class="hero-bg-image" style="background-image: url('/dekstop.png');"></div>
      <div class="hero-overlay-gradient"></div>

      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-tag">Official Phortofolio</div>
          <h1 class="hero-title">MOHAMAD <span class="name-blue">KHOIRUL ANAM</span></h1>
          <p class="hero-tagline">// Visual_Log_Capture & Code_Uplink_Operator</p>
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
            <!-- Social Icons -->
            <div class="social-icons">
              <a href="https://www.linkedin.com/in/asixnam/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.facebook.com/share/19wJ3b3gQX/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com/asixnaam" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@asixnam" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-tiktok"></i>
              </a>
              <a href="https://linktree.com/asixnam" aria-label="Linktree" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon-img linktree-icon" viewBox="0 0 24 24" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
                    <line x1="12" y1="3" x2="12" y2="10" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </g>
                  <rect x="11" y="15" width="2" height="6" rx="0.6" fill="currentColor" />
                </svg>
              </a>
              <a href="https://github.com/asixnam" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-me">
      <div class="container">
        <div class="section-tag">// IDENTITY_RECON</div>
        <h2 class="section-title">ABOUT <span>ME</span></h2>

        <div class="about-grid">
          <div class="about-card">
            <h3 class="card-tag">BACKGROUND_LORE</h3>
            <p class="about-description">
              Lulusan S1 Informatika Universitas Nahdlatul Ulama Yogyakarta,
              berpengalaman dalam Desain Grafis, Pemrograman Website, dan Fotografi.
            </p>
          </div>

          <div class="about-card">
            <h3 class="card-tag">TECHNICAL_SKILLS</h3>
            <p class="about-description">
              Memiliki kemampuan dalam merancang tampilan visual, mengembangkan website
              berbasis Laravel, serta menghasilkan karya foto dan video profesional.
              Selain itu, saya aktif berorganisasi dan memiliki pengalaman kepemimpinan
              serta kolaborasi tim yang kuat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What I Do (Skills) -->
    <section id="services" class="services">
      <div class="container">
        <div class="section-tag">// OPERATIONAL_INTEL</div>
        <h2 class="section-title">TECHNICAL <span>CAPABILITIES</span></h2>

        <div class="skills-marquee">
          <!-- Row 1: Move Right -->
          <div class="skills-row row-right">
            <div class="row-inner">
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/figma.png" alt="Figma"></div>
                <p>Figma</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/cdr.png" alt="CorelDraw"></div>
                <p>CorelDraw</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/canva.png" alt="Canva"></div>
                <p>Canva</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/sony_logo.png" alt="Sony"></div>
                <p>Sony</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/canon.png" alt="Canon"></div>
                <p>Canon</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/photoshop.png" alt="Photoshop"></div>
                <p>Photoshop</p>
              </div>
              <!-- Duplicate for loop -->
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/figma.png" alt="Figma"></div>
                <p>Figma</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/cdr.png" alt="CorelDraw"></div>
                <p>CorelDraw</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/canva.png" alt="Canva"></div>
                <p>Canva</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/sony_logo.png" alt="Sony"></div>
                <p>Sony</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/canon.png" alt="Canon"></div>
                <p>Canon</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/photoshop.png" alt="Photoshop"></div>
                <p>Photoshop</p>
              </div>
            </div>
          </div>

          <!-- Row 2: Move Left -->
          <div class="skills-row row-left">
            <div class="row-inner">
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/laravel.png" alt="Laravel"></div>
                <p>Laravel</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/php.png" alt="PHP"></div>
                <p>PHP</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/mysql.png" alt="MySQL"></div>
                <p>MySQL</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/html.png" alt="HTML"></div>
                <p>HTML</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/css.png" alt="CSS"></div>
                <p>CSS</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/script.png" alt="JavaScript"></div>
                <p>JavaScript</p>
              </div>
              <!-- Duplicate for loop -->
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/laravel.png" alt="Laravel"></div>
                <p>Laravel</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/php.png" alt="PHP"></div>
                <p>PHP</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/mysql.png" alt="MySQL"></div>
                <p>MySQL</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/html.png" alt="HTML"></div>
                <p>HTML</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/css.png" alt="CSS"></div>
                <p>CSS</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/script.png" alt="JavaScript"></div>
                <p>JavaScript</p>
              </div>
              <div class="skill-item">
                <div class="skill-icon"><img src="/Icon/nuxt.png" alt="Nuxt"></div>
                <p>Nuxt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resume -->
    <section id="resume" class="resume">
      <div class="container">
        <div class="section-tag">// DATA_ACCESS_LAYER</div>
        <h2 class="section-title">My <span>Resume</span></h2>
        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'biography' }" @click="activeTab = 'biography'">Internship</button>
          <button class="tab-button" :class="{ active: activeTab === 'organization' }" @click="activeTab = 'organization'">Organization</button>
          <button class="tab-button" :class="{ active: activeTab === 'education' }" @click="activeTab = 'education'">Education</button>
          <button class="tab-button" :class="{ active: activeTab === 'job' }" @click="activeTab = 'job'">Job</button>
        </div>

        <!-- Internship Tab Content -->
        <div class="tab-content" :class="{ active: activeTab === 'biography' }">
          <div class="resume-item">
            <h4>Direktorat GEDSI Universitas Nahdlatul Ulama Yogyakarta</h4>
            <span>Periode 1: 2022–2023</span>
            <span>Periode 2: Desember 2024 – Sekarang</span>
            <p>Selama bekerja di Direktorat GEDSI Universitas Nahdlatul Ulama Yogyakarta, saya bertanggung jawab dalam
              merancang berbagai materi kampanye dan publikasi digital untuk mendukung kegiatan organisasi. Selain itu,
              saya juga mengelola akun media sosial resmi GEDSI dengan fokus pada peningkatan interaksi dan penyampaian
              pesan yang efektif. Saya turut berkontribusi dalam penyusunan strategi komunikasi visual agar setiap konten
              yang dipublikasikan memiliki identitas dan nilai estetika yang konsisten.</p>
          </div>
          <div class="resume-item">
            <h4>Rumah Batik Jinggar (UMKM Yogyakarta)</h4>
            <span>2023</span>
            <p>Sebagai Desain Grafis di Rumah Batik Jinggar, saya bertanggung jawab dalam membuat berbagai konten visual
              untuk kebutuhan promosi produk batik, baik untuk media sosial maupun materi pemasaran lainnya. Selain itu,
              saya juga berperan dalam membantu pengembangan branding dan identitas visual UMKM agar memiliki citra yang
              konsisten dan menarik di mata konsumen.</p>
          </div>
        </div>

        <!-- Organization Tab Content -->
        <div class="tab-content" :class="{ active: activeTab === 'organization' }">
          <div class="resume-item">
            <h4>KAMABA Yogyakarta (Keluarga Mahasiswa Blora Yogyakarta)</h4>
            <span>2022–2023 — Desain Grafis & Admin Media Sosial</span>
            <span>2023-2024 — Ketua Umum</span>
            <p>Sebagai Desain Grafis & Admin Media Sosial di KAMABA Yogyakarta, saya bertanggung jawab dalam merancang
              berbagai konten visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga
              mengelola akun media sosial resmi KAMABA dengan fokus pada peningkatan interaksi dan penyampaian informasi
              yang efektif kepada anggota dan masyarakat luas.</p>
          </div>
          <div class="resume-item">
            <h4>UKM JQH IAC UNU Yogyakarta</h4>
            <span>2023-2024 — Desain Grafis</span>
            <p>Sebagai Desain Grafis di UKM JQH IAC UNU Yogyakarta, saya bertanggung jawab dalam merancang berbagai konten
              visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga mengelola akun
              media sosial resmi UKM JQH IAC UNU dengan fokus pada peningkatan interaksi dan penyampaian informasi yang
              efektif kepada anggota dan masyarakat luas.</p>
          </div>
          <div class="resume-item">
            <h4>Mustika Amarta</h4>
            <span>2025-Sekarang — Admin Sosial Media</span>
            <p>Sebagai Desain Grafis dan Admin Sosial media di Mustika Amarta, saya bertanggung jawab dalam merancang
              berbagai konten visual untuk kebutuhan promosi kegiatan organisasi di media sosial. Selain itu, saya juga
              mengelola akun media sosial resmi Mustika Amarta dengan fokus pada peningkatan interaksi dan penyampaian
              informasi yang efektif kepada anggota dan masyarakat luas.</p>
          </div>
          <div class="resume-item">
            <h4>NataKarsa</h4>
            <span>Sekarang — Founder</span>
            <p>sebuah Komunitas yang berfokus pada dunia developer yang bertujuan agar para developer dapat saling
              berkolaborasi dan berbagi pengetahuan.</p>
          </div>
        </div>

        <!-- Education Tab Content -->
        <div class="tab-content" :class="{ active: activeTab === 'education' }">
          <div class="resume-item">
            <h4>Universitas Nahdlatul Ulama Yogyakarta</h4>
            <span>Informatika | Lulus 2025</span>
            <p>Judul Skripsi : Rancang Bangun Sistem Pengaduan Kekerasan Seksual Berbasis Web di Universitas Nahdlatul
              Ulama Yogyakarta Menggunakan Methode Prototype</p>
          </div>
          <div class="resume-item">
            <h4>MA Khozinatul Ulum</h4>
            <span>Ilmu Pengetahuan Alam | Lulus 2021</span>
            <p>Aktif dalam kegiatan ekstrakurikuler Organisai Siswa Intra Sekolah (OSIS)</p>
          </div>
        </div>

        <!-- Job Tab Content -->
        <div class="tab-content" :class="{ active: activeTab === 'job' }">
          <div class="resume-item">
            <h4>PT. Cetak Laba Bersih</h4>
            <span>Desain Grafis</span>
            <span>November 2025 - Januari 2026</span>
          </div>

          <div class="resume-item">
            <h4>PT. Peksi Gunaraharja</h4>
            <span>Desain Grafis</span>
            <span>Februari 2026 - Sekarang</span>
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
import { ref } from 'vue'

const activeTab = ref('biography')
</script>
