import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nmlxivljaduwpttsxgoe.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhpdmxqYWR1d3B0dHN4Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODAxNjQsImV4cCI6MjA5Mjg1NjE2NH0.ApzztRY7eKPV0Ivo5aOv_0vjgxAG2gDM3HhuFSle4SI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const portfolioItems = [
  // Instagram Feed
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
]

async function run() {
  console.log('Seeding portfolio items into database...')
  try {
    // Empty existing portfolio items first to avoid duplication
    const { error: deleteError } = await supabase.from('portfolio').delete().neq('id', 0)
    if (deleteError) {
      console.log('Warn: Failed to clear old portfolio data:', deleteError.message)
    }

    const { data, error } = await supabase
      .from('portfolio')
      .insert(portfolioItems)

    if (error) {
      console.error('Error seeding database:', error.message)
      process.exit(1)
    } else {
      console.log('Portfolio items successfully seeded!')
      process.exit(0)
    }
  } catch (err) {
    console.error('Exception:', err.message)
    process.exit(1)
  }
}

run()
