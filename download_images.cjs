const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const destDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = {
  // Services & Slides
  '1Ow8UureIlvkddCZAj5utU2nHciwnjFmp': 'feed.jpg',
  '1783iKvBdrRerXZCN4wuhtx46_TTjZTNl': 'photography.jpg',
  '10UlUJMX5hT5EZHfMghOMWeR-JTlEgR3U': 'logo.jpg',
  '1D5nuJ3sy3vBXkWoLpePK83XC3GM-qYub': 'logo_design_bg.jpg',
  '1lmO1PJEsUbuIDghD4yJj8GrgQAbXQZSO': 'kaos.jpg',
  '1PsLaOTdDt0F4lalWrEcT7Id2BQUIsI8f': 'stiker.jpg',
  '1DlXuWc0m5xKo05JmXqxrrX3Gx78j8PnD': 'mug.jpg',
  '1eDE3kO4pLLULDZkq59dEA2I5L8WQghV0': 'lanyard.jpg',
  '1X3cBfPw_HK-MQeeXxhOxg7rsPvGU1bQ_': 'id_card.jpg',
  '11E6_f8sTHV3ImH0IjHtrlDLpMb5IqaTo': 'website.jpg',
  '1QixAoJ58I4rpLRixVSyw_0vQDCRKZUp3': 'cover_buku.jpg',
  
  // Testimonials / Avatars
  '1KFBd8nRIoo12jcXgfrWFyV7q-s6eFUv2': 'client1.jpg',
  '1beIbT6eVGa-vlCkGVyF6XTGQuKiILE_0': 'client2.jpg',

  // Reels
  '10UHJ3IWAj11Y52gM9XuoKsXGdUPnBbld': 'reel3.jpg',
  '107zMZfaD5uVEW6Xn7nwNmmt9jdZDH3Xu': 'reel4.jpg',
  '1Z2QMtwo5YD4zEruWPbbUjkNlrvgfPQf0': 'reel5.jpg',
  '1O6ZLa_2D3EUkWGSNoryVcuuWflvxYlCT': 'reel6.jpg',

  // Logos
  '1kERgO05KpliBTo56XHbZDxdOML61Gu-X': 'logo3.jpg',
  '1e5JbaTtDWl9qmY1SubXC2oLRLlpWRWXl': 'logo6.jpg',

  // Photos
  '1eOocRLC-0cUns9WZ_VGQjd4tUF1wflBn': 'photo2.jpg',
  '1M1kZIB_CaWd9NMgCMMvooaiVZnrZkCUw': 'photo3.jpg',
  '1cjb4wHFqT4U0aT0DE8nAOn5klsjJLPRH': 'photo4.jpg',
  '1HNxvAjDBk8aRLu2TvTLYCFTNYXDaYgpl': 'photo5.jpg',
  '1m2VcKRUQ08ieqTCFp6TujWMxvzgGq-ri': 'photo6.jpg',
  '1RdooRldxPpu6nxKdjzk5DLFPec4uoIHv': 'photo7.jpg',
  '1O8EsKWTmrXw5SPGl8MbsUtNSU0ZqMdzc': 'photo8.jpg'
};

for (const [id, filename] of Object.entries(images)) {
  const filePath = path.join(destDir, filename);
  console.log(`Downloading ${filename} (ID: ${id})...`);
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    execSync(`curl.exe -L -s -o "${filePath}" "${url}"`);
    console.log(`Successfully downloaded ${filename}`);
  } catch (err) {
    console.error(`Failed to download ${filename}:`, err.message);
  }
}
console.log('All downloads finished.');
