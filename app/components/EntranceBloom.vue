<template>
  <div 
    ref="stageRef"
    class="entrance-bloom-container"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerLeave"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Ambient Stage Lighting -->
    <div class="bloom-ambient-glow"></div>
    <div class="bloom-ring-guide"></div>

    <!-- 3D Perspective Viewport -->
    <div class="bloom-viewport">
      <!-- 3D Rotating Orbit Track -->
      <div 
        class="bloom-cylinder"
        :style="cylinderStyle"
      >
        <!-- Cards in Ring Formation -->
        <div 
          v-for="(card, index) in cardList" 
          :key="index"
          class="bloom-card-slot"
          :style="getCardSlotStyle(index)"
        >
          <div 
            class="bloom-card"
            :class="{ 'card-bloomed': isBloomed }"
            :style="{ transitionDelay: isBloomed ? `${index * stagger}ms` : '0ms' }"
            @click="handleCardClick(card, index)"
          >
            <!-- Card Image -->
            <div class="card-inner">
              <img 
                :src="card.image" 
                :alt="card.title || `Portfolio Card ${index + 1}`" 
                class="card-img" 
                loading="lazy"
                draggable="false"
                referrerpolicy="no-referrer"
                @error="handleImageError($event, index)"
              />
              <!-- Gloss Overlay & Vignette -->
              <div class="card-overlay"></div>
              <div class="card-glow-border"></div>

              <!-- Card Badge/Tag -->
              <div class="card-meta" v-if="card.tag">
                <span class="card-tag-badge">{{ card.tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Hint / Controls -->
    <div class="bloom-controls">
      <span class="bloom-hint">
        <i class="fas fa-arrows-alt-h"></i> Drag to spin orbit
      </span>
      <button 
        type="button" 
        class="bloom-btn-direction" 
        @click.stop="toggleDirection" 
        :title="direction > 0 ? 'Reverse Direction' : 'Normal Direction'"
        aria-label="Change Rotation Direction"
      >
        <i :class="direction > 0 ? 'fas fa-undo-alt' : 'fas fa-redo-alt'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [
      {
        image: 'https://lh3.googleusercontent.com/d/1dCQkAU6SWwl1AS41_y6pfkYSZO9NhxS4=w1000',
        tag: 'FEED DESIGN',
        title: 'Social Media Feed'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/1RdooRldxPpu6nxKdjzk5DLFPec4uoIHv=w1000',
        tag: 'PHOTOGRAPHY',
        title: 'Visual Photography'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/1kERgO05KpliBTo56XHbZDxdOML61Gu-X=w1000',
        tag: 'LOGO DESIGN',
        title: 'Vector Logo Art'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/10VTt3fdauC1O5tcYxZMHIgUWu6nIb9xP=w1000',
        tag: 'COVER BUKU',
        title: 'Book Cover Design'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/1iIdy7xrBptrsdOvGkHrYrVayTAjO5IpE=w1000',
        tag: 'MERCHANDISE',
        title: 'Apparel & T-Shirt'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/1OBoKrJXe79OjK4hX785REhfBLoSHAltf=w1000',
        tag: 'WEB PROJECT',
        title: 'Modern Web UI/UX'
      },
      {
        image: 'https://lh3.googleusercontent.com/d/1z8PUjwAvzdK7vT3jc8Wbvlty7_0S5xcr=w1000',
        tag: 'PORTRAIT',
        title: 'Creative Portrait'
      }
    ]
  },
  cardRadius: {
    type: Number,
    default: 12
  },
  spinDuration: {
    type: Number,
    default: 20000 // 20 seconds full orbit
  },
  stagger: {
    type: Number,
    default: 120 // ms stagger delay for bloom entrance
  },
  radius: {
    type: Number,
    default: 260 // 3D ring cylinder radius in px
  },
  tiltAngle: {
    type: Number,
    default: -10 // X-axis tilt in deg
  }
})

const emit = defineEmits(['select'])

const stageRef = ref(null)
const isBloomed = ref(false)
const isHovered = ref(false)
const isDragging = ref(false)
const rotationAngle = ref(0)
const direction = ref(1) // 1 for forward, -1 for reverse
const currentRadius = ref(props.radius)

// Interactive drag state
let startX = 0
let startAngle = 0
let lastX = 0
let dragVelocity = 0
let animationFrameId = null
let lastTime = 0

// Mouse parallax tilt
const mouseTiltX = ref(0)
const mouseTiltY = ref(0)

// Helper: Normalizes image path (handles Google Drive links, 'public/xxx' typos, relative paths, URLs)
const normalizeImagePath = (url) => {
  if (!url) return 'https://cdn.horizonx.so/tools/entrance-stack-v1/card-1.webp'
  let clean = String(url).trim()

  // Convert Google Drive share/view links to direct lh3 image URLs
  const gDriveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (gDriveFileMatch && gDriveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveFileMatch[1]}=w1000`
  }
  const gDriveOpenMatch = clean.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (gDriveOpenMatch && gDriveOpenMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveOpenMatch[1]}=w1000`
  }

  // Handle local public paths
  if (clean.startsWith('public/')) {
    clean = '/' + clean.replace(/^public\//, '')
  } else if (clean.startsWith('/public/')) {
    clean = clean.replace(/^\/public\//, '/')
  } else if (clean.startsWith('./public/')) {
    clean = '/' + clean.replace(/^\.\/public\//, '')
  }
  return clean
}

const cardList = computed(() => {
  const source = props.images || []
  return source.map((item, idx) => {
    if (typeof item === 'string') {
      return { 
        image: normalizeImagePath(item), 
        tag: `0${idx + 1}`,
        title: `Portfolio ${idx + 1}`
      }
    }
    return {
      ...item,
      image: normalizeImagePath(item.image)
    }
  })
})

const handleImageError = (e, index) => {
  const fallbackList = [
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-1.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-2.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-3.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-4.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-5.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-6.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-7.webp',
    'https://cdn.horizonx.so/tools/entrance-stack-v1/card-8.webp'
  ]
  if (e && e.target) {
    e.target.src = fallbackList[index % fallbackList.length]
  }
}

const totalCards = computed(() => cardList.value.length)
const stepAngle = computed(() => 360 / totalCards.value)

// Dynamic responsive radius calculation
const updateDimensions = () => {
  if (typeof window === 'undefined') return
  const w = window.innerWidth
  if (w < 480) {
    currentRadius.value = 175
  } else if (w < 768) {
    currentRadius.value = 210
  } else if (w < 1200) {
    currentRadius.value = 240
  } else {
    currentRadius.value = props.radius
  }
}

// 3D Cylinder Container Style
const cylinderStyle = computed(() => {
  const tiltX = props.tiltAngle + mouseTiltY.value
  const tiltZ = 2 + mouseTiltX.value * 0.5
  return {
    transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) rotateY(${rotationAngle.value}deg)`
  }
})

// Compute Card Position in 3D Orbit
const getCardSlotStyle = (index) => {
  const angle = index * stepAngle.value
  return {
    transform: `rotateY(${angle}deg) translateZ(${isBloomed.value ? currentRadius.value : 0}px)`
  }
}

// Main 60fps Loop
const animateOrbit = (time) => {
  if (!lastTime) lastTime = time
  const delta = Math.min(time - lastTime, 50) // clamp delta to prevent jumps
  lastTime = time

  if (!isDragging.value) {
    if (Math.abs(dragVelocity) > 0.02) {
      // Apply momentum friction
      rotationAngle.value += dragVelocity
      dragVelocity *= 0.95
    } else {
      // Normal auto-rotation speed
      dragVelocity = 0
      const baseSpeed = (360 / props.spinDuration) * delta * direction.value
      const speedMultiplier = isHovered.value ? 0.3 : 1 // Slow down on hover
      rotationAngle.value = (rotationAngle.value + baseSpeed * speedMultiplier) % 360
    }
  }

  animationFrameId = requestAnimationFrame(animateOrbit)
}

// Mouse Drag & Touch Handlers
const handlePointerDown = (e) => {
  isDragging.value = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  lastX = startX
  startAngle = rotationAngle.value
  dragVelocity = 0
}

const handlePointerMove = (e) => {
  const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  
  // Update mouse parallax
  if (stageRef.value && !e.touches) {
    const rect = stageRef.value.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mouseTiltX.value = px * 6 // max 3deg tilt
    mouseTiltY.value = -py * 6
  }

  if (!isDragging.value) return

  const deltaX = currentX - lastX
  dragVelocity = deltaX * 0.25
  lastX = currentX

  const totalDelta = currentX - startX
  rotationAngle.value = startAngle + totalDelta * 0.4
}

const handlePointerUp = () => {
  isDragging.value = false
}

const handlePointerLeave = () => {
  if (isDragging.value) {
    isDragging.value = false
  }
  mouseTiltX.value = 0
  mouseTiltY.value = 0
}

const toggleDirection = () => {
  direction.value = direction.value * -1
}

const handleCardClick = (card, index) => {
  emit('select', { card, index })
}

onMounted(() => {
  updateDimensions()
  window.addEventListener('resize', updateDimensions)

  // Trigger Entrance Bloom effect
  setTimeout(() => {
    isBloomed.value = true
  }, 100)

  // Start Animation Loop
  animationFrameId = requestAnimationFrame(animateOrbit)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateDimensions)
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.entrance-bloom-container {
  position: relative;
  width: 100%;
  height: 520px;
  max-width: 580px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: grab;
  touch-action: pan-y;
  overflow: visible;
}

.entrance-bloom-container:active {
  cursor: grabbing;
}

/* Ambient Radial Glow on the floor */
.bloom-ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%) scale(1.1);
  width: 380px;
  height: 380px;
  background: radial-gradient(
    circle, 
    rgba(197, 168, 128, 0.22) 0%, 
    rgba(138, 112, 81, 0.12) 40%, 
    rgba(0, 0, 0, 0) 70%
  );
  filter: blur(35px);
  pointer-events: none;
  z-index: 1;
  border-radius: 50%;
  opacity: 0.85;
}

/* Subtle Orbit Guide Ring */
.bloom-ring-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%) rotateX(75deg);
  width: 480px;
  height: 480px;
  border: 1px dashed rgba(197, 168, 128, 0.18);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
}

/* 3D Perspective Viewport */
.bloom-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1100px;
  perspective-origin: center 46%;
  z-index: 2;
}

/* 3D Cylinder Orbit */
.bloom-cylinder {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.1s ease-out;
}

/* Card Slot inside 3D space */
.bloom-card-slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 230px;
  margin-left: -80px;
  margin-top: -115px;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Bloom Card Item with Entrance Bloom transitions */
.bloom-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  opacity: 0;
  transform: scale(0.2) rotateY(180deg);
  transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.bloom-card.card-bloomed {
  opacity: 1;
  transform: scale(1) rotateY(0deg);
}

/* Card Inner Frame & Aesthetics */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 14px 34px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 25px rgba(138, 112, 81, 0.12);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
}

.bloom-card:hover .card-inner {
  transform: scale(1.06) translateY(-6px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.8),
    0 0 25px rgba(212, 175, 55, 0.35);
}

/* Card Image */
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  filter: brightness(0.95) contrast(1.05);
  transition: transform 0.5s ease, filter 0.5s ease;
}

.bloom-card:hover .card-img {
  transform: scale(1.05);
  filter: brightness(1.05) contrast(1.1);
}

/* Gloss Overlay & Vignette */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0) 50%, 
    rgba(0, 0, 0, 0.45) 100%
  );
  pointer-events: none;
}

.card-glow-border {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

/* Card Meta Badge */
.card-meta {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
}

.card-tag-badge {
  font-family: 'JetBrains Mono', monospace, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

/* Interactive Hint & Controls at Bottom */
.bloom-controls {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  pointer-events: auto;
}

.bloom-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--text-secondary);
  opacity: 0.65;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.bloom-btn-direction {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}

.bloom-btn-direction:hover {
  background: var(--bg-social);
  border-color: var(--text-primary);
  transform: scale(1.1);
}

/* Responsive Media Queries */
@media (max-width: 968px) {
  .entrance-bloom-container {
    height: 440px;
    max-width: 100%;
  }

  .bloom-card-slot {
    width: 135px;
    height: 195px;
    margin-left: -67.5px;
    margin-top: -97.5px;
  }

  .bloom-ambient-glow {
    width: 300px;
    height: 300px;
  }

  .bloom-ring-guide {
    width: 380px;
    height: 380px;
  }
}

@media (max-width: 480px) {
  .entrance-bloom-container {
    height: 310px;
  }

  .bloom-card-slot {
    width: 105px;
    height: 152px;
    margin-left: -52.5px;
    margin-top: -76px;
  }

  .bloom-ambient-glow {
    width: 230px;
    height: 230px;
  }

  .bloom-ring-guide {
    width: 280px;
    height: 280px;
  }

  .bloom-controls {
    bottom: -2px;
  }

  .bloom-hint {
    font-size: 9px;
    padding: 3px 8px;
  }
}
</style>
