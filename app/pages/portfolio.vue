<template>
  <div>
    <!-- Portfolio Page -->
    <section id="portfolio" class="portfolio" style="padding-top: 120px;">
      <div class="container">
        <div class="section-tag">// DATA_ACCESS_LAYER</div>
        <h2 class="section-title">Project_<span>Archive</span></h2>
        <p class="section-subtitle">Deep search successfully... <span class="typing-effect">decrypted_data_established</span></p>

        <!-- Portfolio Content -->
        <div class="portfolio-content">

          <!-- Feed Instagram Section -->
          <div class="portfolio-section" v-if="instagramItems.length > 0">
            <div class="section-tag">// VISUAL_LOG_FEED</div>
            <h3 class="category-title">Feed Instagram</h3>
            <div class="portfolio-grid grid-instagram">
              <div v-for="item in instagramItems" :key="item.id || item.link_url" class="portfolio-item instagram-feed">
                <blockquote class="instagram-media" :data-instgrm-permalink="item.link_url" data-instgrm-version="14"></blockquote>
              </div>
            </div>
          </div>

          <!-- Reels Section -->
          <div class="portfolio-section" v-if="reelItems.length > 0">
            <div class="section-tag">// KINETIC_CAPTURE</div>
            <h3 class="category-title">Reels Instagram</h3>
            <div class="portfolio-grid grid-rels">
              <div v-for="item in reelItems" :key="item.id || item.link_url" class="portfolio-item custom-reel">
                <img :src="formatImageOrMediaUrl(item.image_url)" :alt="item.title" loading="lazy" />
                <div class="insta-handle">
                  <i class="fab fa-instagram"></i>
                  <span>{{ item.title }}</span>
                </div>
                <a :href="item.link_url" target="_blank" class="reel-overlay">
                  <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span class="view-text">Tonton Reels</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Merchandise Section -->
          <div class="portfolio-section" v-if="merchandiseItems.length > 0">
            <div class="section-tag">// MEDIA_PRODUCTION</div>
            <h3 class="category-title">Merchandise</h3>
            <div class="portfolio-grid grid-outdoor">
              <div v-for="item in merchandiseItems" :key="item.id || item.image_url" class="portfolio-item ratio-25-15">
                <img :src="formatImageOrMediaUrl(item.image_url)" :alt="item.title" loading="lazy" />
                <div class="overlay"></div>
              </div>
            </div>
          </div>

          <!-- Logo Section -->
          <div class="portfolio-section" v-if="logoItems.length > 0">
            <div class="section-tag">// BRAND_IDENTITY_CORE</div>
            <h3 class="category-title">Logo</h3>
            <div class="portfolio-grid grid-logo">
              <div v-for="item in logoItems" :key="item.id || item.image_url" class="portfolio-item ratio-4-5">
                <img :src="formatImageOrMediaUrl(item.image_url)" :alt="item.title" loading="lazy" />
                <div class="overlay"></div>
              </div>
            </div>
          </div>

          <!-- PhotoGraphy Section -->
          <div class="portfolio-section" v-if="photographyItems.length > 0">
            <div class="section-tag">// SENSORY_CAPTURE_DATA</div>
            <h3 class="category-title">PhotoGraphy</h3>
            <div class="portfolio-grid grid-photo">
              <div v-for="item in photographyItems" :key="item.id || item.image_url" class="portfolio-item ratio-4-5">
                <img :src="formatImageOrMediaUrl(item.image_url)" :alt="item.title" loading="lazy" />
                <div class="overlay"></div>
              </div>
            </div>
          </div>

          <!-- Website Project Section -->
          <div class="portfolio-section" v-if="websiteItems.length > 0">
            <div class="section-tag">// Sofware_Architecture</div>
            <h3 class="category-title">Website Project</h3>
            <div class="portfolio-grid grid-website">
              <div v-for="item in websiteItems" :key="item.id || item.title" class="project-card">
                <div class="project-image-wrapper">
                  <iframe :src="item.link_url" frameborder="0" allowfullscreen="true" loading="lazy" class="desktop-view" style="background:#000;"></iframe>
                </div>
                <div class="project-content">
                  <div class="project-category">Web Development</div>
                  <h3 class="project-title">{{ item.title }}</h3>
                  <p class="project-description">{{ item.description }}</p>
                  <div class="project-tech-stack">
                    <span v-for="tag in item.tags" :key="tag" class="tech-tag">{{ tag }}</span>
                  </div>
                  <div class="project-links">
                    <a :href="item.link_url" class="btn-project btn-demo" target="_blank" rel="noopener noreferrer">
                      <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const formatImageOrMediaUrl = (url) => {
  if (!url) return ''
  if (url.includes('lh3.googleusercontent.com')) return url
  if (url.includes('drive.google.com')) {
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (matchD && matchD[1]) {
      return `https://lh3.googleusercontent.com/d/${matchD[1]}=w1000`
    }
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (matchId && matchId[1]) {
      return `https://lh3.googleusercontent.com/d/${matchId[1]}=w1000`
    }
  }
  if (url.includes('instagram.com')) {
    if (url.includes('/media/')) return url
    const matchInsta = url.match(/\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
    if (matchInsta && matchInsta[1]) {
      return `https://www.instagram.com/p/${matchInsta[1]}/media/?size=l`
    }
  }
  return url
}

const portfolioItems = ref([
  // Instagram Feed items
  { category: 'Instagram', title: 'Instagram 28', link_url: 'https://www.instagram.com/p/DY6YiPfmVUi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 27', link_url: 'https://www.instagram.com/p/DaelRdTR8ZK/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 26', link_url: 'https://www.instagram.com/p/DXv9vohgXSw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 25', link_url: 'https://www.instagram.com/p/DW5b1l1CRSD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 24', link_url: 'https://www.instagram.com/p/DXJjfX2keDn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 23', link_url: 'https://www.instagram.com/p/DWm7-0RkTpl/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 20', link_url: 'https://www.instagram.com/p/DWQuV5CGLRi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 19', link_url: 'https://www.instagram.com/p/DWYhU77AsOF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 18', link_url: 'https://www.instagram.com/p/DWKuDa-kZ-W/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 17', link_url: 'https://www.instagram.com/p/DVgAJjFkUlE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 15', link_url: 'https://www.instagram.com/p/DVYQutID-Ue/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 12', link_url: 'https://www.instagram.com/p/DUsP0EFEVJD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 11', link_url: 'https://www.instagram.com/p/DUuahM0D7OS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 10', link_url: 'https://www.instagram.com/p/DTk8JLUEpc4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 9', link_url: 'https://www.instagram.com/p/DSU1GevCRvn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 8', link_url: 'https://www.instagram.com/p/DPG_ZzviSPd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 7', link_url: 'https://www.instagram.com/p/DSLTQVgEzQ5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 6', link_url: 'https://www.instagram.com/p/DQ_ygAgDzDn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 5', link_url: 'https://www.instagram.com/p/DRggmQhj1Jb/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 4', link_url: 'https://www.instagram.com/p/DSEgQsODxzt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { category: 'Instagram', title: 'Instagram 3', link_url: 'https://www.instagram.com/p/DQ3HFGnj9ps/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  
  // Reels
  { category: 'Reels', title: 'Reels 1', image_url: 'https://lh3.googleusercontent.com/d/1X3cBfPw_HK-MQeeXxhOxg7rsPvGU1bQ_=w1000', link_url: 'https://www.instagram.com/reel/DHLp9EPybiH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  
  // Merchandise
  { category: 'Merchandise', title: 'Merchandise 5', image_url: 'https://lh3.googleusercontent.com/d/18O44CJww_mAA7Qw4m-9c4yhP02CIAcFQ=w1000' },
  { category: 'Merchandise', title: 'Merchandise 4', image_url: 'https://lh3.googleusercontent.com/d/1lmO1PJEsUbuIDghD4yJj8GrgQAbXQZSO=w1000' },
  { category: 'Merchandise', title: 'Merchandise 3', image_url: 'https://lh3.googleusercontent.com/d/1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f=w1000' },
  { category: 'Merchandise', title: 'Merchandise 2', image_url: 'https://lh3.googleusercontent.com/d/1DlXuWc0m5xKo05JmXqxrrX3Gx78j8PnD=w1000' },
  { category: 'Merchandise', title: 'Merchandise 1', image_url: 'https://lh3.googleusercontent.com/d/1eDE3kO4pLLULDZkq59dEA2I5L8WQghV0=w1000' },
  
  // Logo
  { category: 'Logo', title: 'Logo 1', image_url: 'https://lh3.googleusercontent.com/d/10UlUJMX5hT5EZHfMghOMWeR-JTlEgR3U=w1000' },
  { category: 'Logo', title: 'Logo 2', image_url: 'https://lh3.googleusercontent.com/d/1QixAoJ58I4rpLRixVSyw_0vQDCRKZUp3=w1000' },
  { category: 'Logo', title: 'Logo 3', image_url: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000' },
  { category: 'Logo', title: 'Logo 4', image_url: 'https://lh3.googleusercontent.com/d/1D5nuJ3sy3vBXkWoLpePK83XC3GM-qYub=w1000' },
  { category: 'Logo', title: 'Logo 5', image_url: 'https://lh3.googleusercontent.com/d/1X3cBfPw_HK-MQeeXxhOxg7rsPvGU1bQ_=w1000' },
  { category: 'Logo', title: 'Logo 6', image_url: 'https://lh3.googleusercontent.com/d/1e5JbaTtDWl9qmY1SubXC2oLRLlpWRWXl=w1000' },

  // Photography
  { category: 'Photography', title: 'Photo 1', image_url: 'https://lh3.googleusercontent.com/d/1783iKvBdrRerXZCN4wuhtx46_TTjZTNl=w1000' },
  { category: 'Photography', title: 'Photo 2', image_url: 'https://lh3.googleusercontent.com/d/1eOocRLC-0cUns9WZ_VGQjd4tUF1wflBn=w1000' },
  { category: 'Photography', title: 'Photo 3', image_url: 'https://lh3.googleusercontent.com/d/1M1kZIB_CaWd9NMgCMMvooaiVZnrZkCUw=w1000' },
  { category: 'Photography', title: 'Photo 4', image_url: 'https://lh3.googleusercontent.com/d/1cjb4wHFqT4U0aT0DE8nAOn5klsjJLPRH=w1000' },
  { category: 'Photography', title: 'Photo 5', image_url: 'https://lh3.googleusercontent.com/d/1HNxvAjDBk8aRLu2TvTLYCFTNYXDaYgpl=w1000' },
  { category: 'Photography', title: 'Photo 6', image_url: 'https://lh3.googleusercontent.com/d/1m2VcKRUQ08ieqTCFp6TujWMxvzgGq-ri=w1000' },
  { category: 'Photography', title: 'Photo 7', image_url: 'https://lh3.googleusercontent.com/d/1RdooRldxPpu6nxKdjzk5DLFPec4uoIHv=w1000' },
  { category: 'Photography', title: 'Photo 8', image_url: 'https://lh3.googleusercontent.com/d/1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc=w1000' },
  { category: 'Photography', title: 'Photo 9', image_url: 'https://lh3.googleusercontent.com/d/1KFBd8nRIoo12jcXgfrWFyV7q-s6eFUv2=w1000' },
  { category: 'Photography', title: 'Photo 10', image_url: 'https://lh3.googleusercontent.com/d/1beIbT6eVGa-vlCkGVyF6XTGQuKiILE_0=w1000' },
  
  // Websites
  {
    category: 'Website',
    title: 'Web Pondok Pesantren Khozinatul Ulum An-Nawa',
    description: 'Platform manajemen pesantren masa depan dengan antarmuka modern yang responsif, integrasi basis data real-time untuk data santri',
    link_url: 'https://annawa.vercel.app',
    tags: ['Vue', 'Node.js', 'TailwindCSS', 'Nuxt.js', 'PostgreSQL']
  },
  {
    category: 'Website',
    title: 'Web Satuan Tugas Pencegahan & Penanganan Kekerasan di Perguruan Tinggi',
    description: 'Platform manajemen layanan Pengaduan Kekerasan di Tingkat Perguruan Tinggi responsif, integrasi basis data real-time untuk data kekerasan di perguruan tinggi',
    link_url: 'https://satgasppks.vercel.app',
    tags: ['Vue', 'Node.js', 'TailwindCSS', 'Nuxt.js', 'PostgreSQL']
  }
])

const instagramItems = computed(() => portfolioItems.value.filter(item => item.category === 'Instagram'))
const reelItems = computed(() => portfolioItems.value.filter(item => item.category === 'Reels'))
const merchandiseItems = computed(() => portfolioItems.value.filter(item => item.category === 'Merchandise'))
const logoItems = computed(() => portfolioItems.value.filter(item => item.category === 'Logo'))
const photographyItems = computed(() => portfolioItems.value.filter(item => item.category === 'Photography'))
const websiteItems = computed(() => portfolioItems.value.filter(item => item.category === 'Website'))

const loadInstagramScript = () => {
  if (!window.instgrm) {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  } else {
    try {
      window.instgrm.Embeds.process()
    } catch (err) {
      console.error('Error reprocessing Instagram embeds:', err)
    }
  }
}

onMounted(async () => {
  if (process.client) {
    loadInstagramScript()

    try {
      const { $supabase } = useNuxtApp()
      const { data, error } = await $supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data && data.length > 0) {
        portfolioItems.value = data
        
        // Reprocess embeds after DOM update
        nextTick(() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
          }
        })
      }
    } catch (err) {
      console.error('Failed to load portfolio items from database, using static fallback:', err)
    }
  }
})
</script>
