<template>
  <div class="beranda">
    <div class="animated-bg">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="text-section">
            <div class="badge">🚀 Platform Belajar Terdepan</div>
            <h1 class="main-title">
              Belajar Jadi Lebih
              <span class="gradient-text">Seru & Efektif</span>
            </h1>
            <p class="subtitle">Belajar Mudah, Pintar Cepat</p>
            <p class="description">
              Revolusi cara belajarmu dengan platform interaktif yang menggabungkan 
              teknologi terdepan dan metode pembelajaran yang terbukti efektif. 
              Raih prestasi terbaikmu bersama kami!
            </p>
            <div class="cta-section">
              <router-link to="/jurusan" class="btn-primary">
                <span>Mulai Belajar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
              <button class="btn-secondary">
                <span>Lihat Demo</span>
                ▶
              </button>
            </div>
          </div>
          
          <div class="visual-section">
            <div class="floating-card main-card">
              <div class="card-header">
                <div class="dots">
                  <span></span><span></span><span></span>
                </div>
                <h3>Dashboard Belajar</h3>
              </div>
              <div class="progress-bars">
                <div class="progress-item">
                  <span>Matematika</span>
                  <div class="progress"><div class="fill" style="width: 85%"></div></div>
                </div>
                <div class="progress-item">
                  <span>Fisika</span>
                  <div class="progress"><div class="fill" style="width: 72%"></div></div>
                </div>
                <div class="progress-item">
                  <span>Kimia</span>
                  <div class="progress"><div class="fill" style="width: 90%"></div></div>
                </div>
              </div>
            </div>
            
            <div class="floating-card stats-card">
              <h4>📊 Statistik Hari Ini</h4>
              <div class="stats">
                <div class="stat">
                  <span class="number">12</span>
                  <span class="label">Materi Selesai</span>
                </div>
                <div class="stat">
                  <span class="number">8</span>
                  <span class="label">Quiz Lulus</span>
                </div>
              </div>
            </div>
            
            <div class="floating-card achievement-card">
              <div class="achievement">🏆</div>
              <p>Prestasi Baru!</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="section-header">
        <h2>Mengapa Memilih <span>Fun Study</span>?</h2>
        <p>Fitur-fitur canggih yang membuat belajar jadi lebih menyenangkan</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <span v-html="feature.icon"></span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-highlight"></div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="cta-content">
        <h2>Siap Memulai Perjalanan Belajarmu?</h2>
        <p>Bergabung dengan ribuan pelajar yang sudah merasakan manfaatnya</p>
        <router-link to="/jurusan" class="btn-cta">
          Pilih Jurusan Sekarang
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Beranda',
  data() {
    return {
      features: [
        {
          icon: '🎯',
          title: 'Rencana Belajar Personal',
          description: 'AI yang cerdas akan menyusun jadwal belajar khusus untukmu berdasarkan gaya belajar dan target yang ingin dicapai.'
        },
        {
          icon: '📚',
          title: 'Materi Interaktif',
          description: 'Belajar dengan video HD, animasi 3D, dan simulasi interaktif yang membuat konsep sulit jadi mudah dipahami.'
        },
        {
          icon: '🎮',
          title: 'Gamifikasi Belajar',
          description: 'Sistem poin, badge, dan leaderboard yang membuat belajar terasa seperti bermain game seru.'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.beranda {
  position: relative;
  min-height: 100vh;
  // --- UBAH DARI #0a0a0a MENJADI NUANSA BIRU INI ---
  background: #1a2a4b; // Biru gelap yang lembut
  color: #ffffff;
  overflow-x: hidden;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

// Animated Background
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // --- UBAH DARI rgba(10, 10, 10, 0.7) MENJADI NUANSA BIRU LEBIH GELAP ---
    background: rgba(26, 42, 75, 0.7); // Menggunakan warna dasar biru gelap dengan transparansi
    backdrop-filter: blur(1px);
  }
}

.bg-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  
  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 20s ease-in-out infinite;
    
    &.shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &.shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 10%;
      animation-delay: 7s;
    }
    
    &.shape-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 30%;
      animation-delay: 14s;
    }
  }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  33% { transform: translateY(-30px) scale(1.1); }
  66% { transform: translateY(15px) scale(0.9); }
}

// Hero Section
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  align-items: center;
}

.text-section {
  .badge {
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.3);
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
  }
  
  .main-title {
    font-size: clamp(48px, 8vw, 72px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: 24px;
    color: #a0a0a0;
    font-weight: 600;
    margin-bottom: 24px;
  }
  
  .description {
    font-size: 18px;
    line-height: 1.6;
    color: #cccccc;
    margin-bottom: 40px;
    max-width: 500px;
  }
}

.cta-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

// Visual Section
.visual-section {
  position: relative;
  height: 500px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  animation: cardFloat 6s ease-in-out infinite;
  
  &.main-card {
    width: 320px;
    top: 50px;
    right: 0;
    animation-delay: 0s;
  }
  
  &.stats-card {
    width: 200px;
    top: 200px;
    left: 0;
    animation-delay: 2s;
  }
  
  &.achievement-card {
    width: 150px;
    bottom: 50px;
    right: 100px;
    text-align: center;
    animation-delay: 4s;
    
    .achievement {
      font-size: 48px;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      font-weight: 600;
    }
  }
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0px) rotateY(0deg); }
  50% { transform: translateY(-15px) rotateY(5deg); }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .dots {
    display: flex;
    gap: 6px;
    margin-right: 12px;
    
    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
      
      &:nth-child(2) { background: #764ba2; }
      &:nth-child(3) { background: #f093fb; }
    }
  }
  
  h3 {
    font-size: 16px;
    font-weight: 600;
  }
}

.progress-bars {
  .progress-item {
    margin-bottom: 16px;
    
    span {
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
      color: #cccccc;
    }
    
    .progress {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 4px;
        transition: width 2s ease;
      }
    }
  }
}

.stats {
  display: flex;
  justify-content: space-between;
  
  .stat {
    text-align: center;
    
    .number {
      display: block;
      font-size: 24px;
      font-weight: 800;
      color: #667eea;
    }
    
    .label {
      font-size: 12px;
      color: #a0a0a0;
    }
  }
}

// Features Section
.features {
  padding: 120px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 800;
    margin-bottom: 16px;
    
    span {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  p {
    font-size: 18px;
    color: #a0a0a0;
    max-width: 500px;
    margin: 0 auto;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
    
    .feature-highlight {
      opacity: 1;
    }
  }
  
  .feature-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #ffffff;
  }
  
  p {
    font-size: 16px;
    line-height: 1.6;
    color: #cccccc;
  }
  
  .feature-highlight {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
}

// Final CTA
.final-cta {
  padding: 100px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin: 0 20px;
  border-radius: 32px;
  margin-bottom: 40px;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 800;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 18px;
    color: #a0a0a0;
    margin-bottom: 32px;
  }
}

.btn-cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 40px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
  }
}

// Responsive Design
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  
  .visual-section {
    height: 400px;
    
    .floating-card {
      &.main-card {
        position: relative;
        width: 100%;
        max-width: 320px;
        top: 0;
        right: auto;
        margin: 0 auto 20px;
      }
      
      &.stats-card,
      &.achievement-card {
        display: none;
      }
    }
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .feature-card {
    padding: 32px 24px;
  }
}

@media (max-width: 640px) {
  .cta-section {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .features {
    padding: 80px 20px;
  }
  
  .final-cta {
    margin: 0 10px 20px;
    padding: 60px 20px;
  }
}
</style>