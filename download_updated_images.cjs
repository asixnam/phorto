const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const destDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const updatedImages = {
  '1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4': 'feed.jpg',
  '1pkCZDxiUV-_ylQEw0A_Ce6GwyF2S_P22': 'stiker.jpg',
  '1hI8tTrLVQALecjtQeFcT5fxxo3I1eu-9': 'lanyard.jpg',
  '1l8B6QSJLEAy7zt-Ve87moX_94ORm3IuX': 'id_card.jpg',
  '1f07kczRvgEMIxRP-VRnkAx4cjG_8-dnX': 'website.jpg',
  '1CEgGGx3TLvtYUWR4a0QCRHX7_YeRFHYc': 'cover_buku.jpg'
};

for (const [id, filename] of Object.entries(updatedImages)) {
  const filePath = path.join(destDir, filename);
  console.log(`Downloading updated ${filename} (ID: ${id})...`);
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    execSync(`curl.exe -L -s -o "${filePath}" "${url}"`);
    console.log(`Successfully downloaded updated ${filename}`);
  } catch (err) {
    console.error(`Failed to download ${filename}:`, err.message);
  }
}
console.log('All updated downloads finished.');
