<template>
  <div class="learning-journey">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="main-title">Journey Pembelajaran</h1>
        <div class="program-badge">
          <span class="faculty">Fakultas Sains & Teknologi</span>
          <span class="separator">•</span>
          <span class="major">Sistem Informasi - Semester 5</span>
          <span class="separator">•</span>
          <span class="level">Advanced Level</span>
        </div>
        <p class="hero-description">
          Ikuti perjalanan pembelajaran yang dirancang khusus untuk mengembangkan kemampuan Anda 
          dalam bidang sistem informasi modern dengan pendekatan praktis dan inovatif.
        </p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">12</div>
          <div class="stat-label">Modul Utama</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">160+</div>
          <div class="stat-label">Jam Belajar</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">25</div>
          <div class="stat-label">Proyek Praktek</div>
        </div>
      </div>
    </div>

    <!-- Learning Path -->
    <div class="learning-path">
      <div class="path-header">
        <h2>Roadmap Pembelajaran</h2>
        <div class="progress-overview">
          <div class="overall-progress">
            <span>Progress Keseluruhan: {{ overallProgress }}%</span>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{width: overallProgress + '%'}"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="phases-container">
        <div v-for="(phase, phaseIndex) in learningPhases" :key="phaseIndex" class="phase-block">
          <div class="phase-header">
            <div class="phase-icon">
              <i :class="phase.icon"></i>
            </div>
            <div class="phase-info">
              <h3>{{ phase.title }}</h3>
              <p>{{ phase.description }}</p>
              <div class="phase-timeline">{{ phase.timeline }}</div>
            </div>
            <div class="phase-completion">
              <div class="completion-circle" :class="{'completed': phase.completed}">
                <i class="fas fa-check" v-if="phase.completed"></i>
              </div>
            </div>
          </div>

          <div class="modules-grid">
            <div v-for="(module, moduleIndex) in phase.modules" :key="module.id" 
                 class="module-tile" :class="{'locked': module.locked}">
              <div class="module-header">
                <div class="module-type">{{ module.type }}</div>
                <div class="module-difficulty" :class="'difficulty-' + module.difficulty">
                  {{ module.difficulty.toUpperCase() }}
                </div>
              </div>
              
              <div class="module-content">
                <h4>{{ module.title }}</h4>
                <p>{{ module.description }}</p>
                
                <div class="module-details">
                  <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>{{ module.duration }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-tasks"></i>
                    <span>{{ module.exercises }} Latihan</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-trophy"></i>
                    <span>{{ module.points }} XP</span>
                  </div>
                </div>

                <div class="module-progress">
                  <div class="progress-info">
                    <span>Progress: {{ module.progress }}%</span>
                    <div class="progress-slider">
                      <input type="range" v-model="module.progress" min="0" max="100" 
                             :disabled="module.locked" @input="updateOverallProgress">
                    </div>
                  </div>
                </div>

                <div class="module-actions">
                  <button @click="startModule(module)" 
                          :disabled="module.locked"
                          class="action-btn primary" 
                          v-if="module.progress === 0">
                    <i class="fas fa-play"></i>
                    Mulai Belajar
                  </button>
                  <button @click="continueModule(module)" 
                          :disabled="module.locked"
                          class="action-btn secondary" 
                          v-else-if="module.progress > 0 && module.progress < 100">
                    <i class="fas fa-arrow-right"></i>
                    Lanjutkan
                  </button>
                  <button @click="reviewModule(module)" 
                          class="action-btn success" 
                          v-else>
                    <i class="fas fa-check-circle"></i>
                    Review
                  </button>
                  
                  <div class="resource-buttons">
                    <button @click="downloadResource(module)" class="resource-btn">
                      <i class="fas fa-download"></i>
                    </button>
                    <button @click="openVideo(module)" class="resource-btn" v-if="module.hasVideo">
                      <i class="fas fa-video"></i>
                    </button>
                    <button @click="openQuiz(module)" class="resource-btn" v-if="module.hasQuiz">
                      <i class="fas fa-question-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="locked-overlay" v-if="module.locked">
                <i class="fas fa-lock"></i>
                <span>Selesaikan modul sebelumnya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModernLearningModule',
  data() {
    return {
      overallProgress: 0,
      learningPhases: [
        {
          title: 'Foundation Phase',
          description: 'Membangun fondasi yang kuat dalam sistem informasi',
          timeline: 'Minggu 1-6',
          icon: 'fas fa-seedling',
          completed: false,
          modules: [
            {
              id: 5001,
              title: 'Analisis & Desain Sistem',
              description: 'Metodologi pengembangan sistem informasi dengan pendekatan modern',
              type: 'Teori & Praktek',
              difficulty: 'medium',
              duration: '18 jam',
              exercises: 8,
              points: 150,
              progress: 0,
              locked: false,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5002,
              title: 'Database Management System',
              description: 'Perancangan dan implementasi database enterprise',
              type: 'Praktek',
              difficulty: 'hard',
              duration: '22 jam',
              exercises: 12,
              points: 200,
              progress: 0,
              locked: false,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5003,
              title: 'Pemrograman Web Full-Stack',
              description: 'Pengembangan aplikasi web modern dengan teknologi terkini',
              type: 'Praktek',
              difficulty: 'hard',
              duration: '25 jam',
              exercises: 15,
              points: 250,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: false
            }
          ]
        },
        {
          title: 'Development Phase',
          description: 'Implementasi dan pengembangan solusi sistem informasi',
          timeline: 'Minggu 7-12',
          icon: 'fas fa-code',
          completed: false,
          modules: [
            {
              id: 5004,
              title: 'Enterprise Architecture',
              description: 'Arsitektur sistem informasi untuk organisasi besar',
              type: 'Teori & Studi Kasus',
              difficulty: 'hard',
              duration: '20 jam',
              exercises: 6,
              points: 180,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5005,
              title: 'Cloud Computing & DevOps',
              description: 'Implementasi sistem di cloud dengan praktik DevOps',
              type: 'Praktek',
              difficulty: 'hard',
              duration: '24 jam',
              exercises: 10,
              points: 220,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: false
            },
            {
              id: 5006,
              title: 'API Development & Integration',
              description: 'Membangun dan mengintegrasikan API untuk sistem terdistribusi',
              type: 'Praktek',
              difficulty: 'medium',
              duration: '16 jam',
              exercises: 9,
              points: 160,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: true
            }
          ]
        },
        {
          title: 'Specialization Phase',
          description: 'Spesialisasi dalam bidang tertentu sistem informasi',
          timeline: 'Minggu 13-18',
          icon: 'fas fa-rocket',
          completed: false,
          modules: [
            {
              id: 5007,
              title: 'Business Intelligence & Analytics',
              description: 'Analisis data bisnis dan pengambilan keputusan berbasis data',
              type: 'Teori & Praktek',
              difficulty: 'hard',
              duration: '22 jam',
              exercises: 11,
              points: 210,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5008,
              title: 'Cybersecurity untuk SI',
              description: 'Keamanan sistem informasi dan perlindungan data',
              type: 'Teori & Praktek',
              difficulty: 'hard',
              duration: '19 jam',
              exercises: 8,
              points: 190,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5009,
              title: 'Machine Learning Integration',
              description: 'Integrasi AI/ML dalam sistem informasi bisnis',
              type: 'Praktek',
              difficulty: 'expert',
              duration: '26 jam',
              exercises: 13,
              points: 280,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: false
            }
          ]
        },
        {
          title: 'Capstone Phase',
          description: 'Proyek akhir dan implementasi solusi komprehensif',
          timeline: 'Minggu 19-24',
          icon: 'fas fa-graduation-cap',
          completed: false,
          modules: [
            {
              id: 5010,
              title: 'Manajemen Proyek SI',
              description: 'Metodologi dan praktik terbaik dalam mengelola proyek SI',
              type: 'Teori & Studi Kasus',
              difficulty: 'medium',
              duration: '15 jam',
              exercises: 7,
              points: 140,
              progress: 0,
              locked: true,
              hasVideo: true,
              hasQuiz: true
            },
            {
              id: 5011,
              title: 'Proyek Capstone - Bagian 1',
              description: 'Perancangan dan prototype sistem informasi kompleks',
              type: 'Proyek',
              difficulty: 'expert',
              duration: '30 jam',
              exercises: 5,
              points: 350,
              progress: 0,
              locked: true,
              hasVideo: false,
              hasQuiz: false
            },
            {
              id: 5012,
              title: 'Proyek Capstone - Bagian 2',
              description: 'Implementasi, testing, dan deployment sistem final',
              type: 'Proyek',
              difficulty: 'expert',
              duration: '35 jam',
              exercises: 3,
              points: 400,
              progress: 0,
              locked: true,
              hasVideo: false,
              hasQuiz: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    startModule(module) {
      console.log(`Memulai modul: ${module.title}`);
      // Simulasi mulai modul
      module.progress = 10;
      this.updateOverallProgress();
    },
    continueModule(module) {
      console.log(`Melanjutkan modul: ${module.title}`);
      // Simulasi lanjut modul
    },
    reviewModule(module) {
      console.log(`Review modul: ${module.title}`);
      // Simulasi review modul
    },
    downloadResource(module) {
      alert(`Mengunduh resource untuk: ${module.title}`);
    },
    openVideo(module) {
      alert(`Membuka video pembelajaran: ${module.title}`);
    },
    openQuiz(module) {
      alert(`Membuka quiz untuk: ${module.title}`);
    },
    updateOverallProgress() {
      let totalModules = 0;
      let totalProgress = 0;
      
      this.learningPhases.forEach(phase => {
        phase.modules.forEach(module => {
          totalModules++;
          totalProgress += module.progress;
        });
      });
      
      this.overallProgress = Math.round(totalProgress / totalModules);
      
      // Update phase completion
      this.learningPhases.forEach(phase => {
        const phaseProgress = phase.modules.reduce((sum, module) => sum + module.progress, 0);
        const avgProgress = phaseProgress / phase.modules.length;
        phase.completed = avgProgress >= 80;
        
        // Unlock next modules based on progress
        phase.modules.forEach((module, index) => {
          if (index > 0) {
            const prevModule = phase.modules[index - 1];
            module.locked = prevModule.progress < 70;
          }
        });
      });
    }
  },
  mounted() {
    this.updateOverallProgress();
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.learning-journey {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

.hero-section {
  padding: 60px 20px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto 40px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #fff, #a8e6cf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.program-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.program-badge span {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.separator {
  background: none !important;
  border: none !important;
  padding: 0 !important;
  font-size: 1.2rem;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 25px 20px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 5px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.learning-path {
  background: rgba(255, 255, 255, 0.95);
  margin: 0 20px;
  border-radius: 30px 30px 0 0;
  padding: 40px;
  min-height: 60vh;
}

.path-header {
  text-align: center;
  margin-bottom: 50px;
}

.path-header h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
}

.progress-overview {
  max-width: 400px;
  margin: 0 auto;
}

.overall-progress span {
  font-weight: 600;
  color: #34495e;
  margin-bottom: 10px;
  display: block;
}

.progress-bar-container {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.phases-container {
  max-width: 1200px;
  margin: 0 auto;
}

.phase-block {
  margin-bottom: 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}

.phase-header {
  display: flex;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 3px solid #dee2e6;
}

.phase-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 1.5rem;
}

.phase-info {
  flex: 1;
}

.phase-info h3 {
  font-size: 1.8rem;
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-weight: 700;
}

.phase-info p {
  margin: 0 0 8px 0;
  color: #7f8c8d;
  line-height: 1.5;
}

.phase-timeline {
  color: #3498db;
  font-weight: 600;
  font-size: 0.9rem;
}

.completion-circle {
  width: 40px;
  height: 40px;
  border: 3px solid #bdc3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.completion-circle.completed {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  padding: 30px;
}

.module-tile {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.module-tile:hover:not(.locked) {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border-color: #667eea;
}

.module-tile.locked {
  opacity: 0.6;
  pointer-events: none;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}

.module-type {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.module-difficulty {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.difficulty-easy { background: #d5f4e6; color: #27ae60; }
.difficulty-medium { background: #fff3cd; color: #f39c12; }
.difficulty-hard { background: #f8d7da; color: #e74c3c; }
.difficulty-expert { background: #d1ecf1; color: #17a2b8; }

.module-content {
  padding: 20px;
}

.module-content h4 {
  font-size: 1.3rem;
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-weight: 700;
}

.module-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.module-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #34495e;
  font-size: 0.9rem;
}

.detail-item i {
  color: #3498db;
}

.module-progress {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-info span {
  font-weight: 600;
  color: #2c3e50;
  min-width: 100px;
}

.progress-slider {
  flex: 1;
}

.progress-slider input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ecf0f1;
  outline: none;
  -webkit-appearance: none;
}

.progress-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}

.module-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.action-btn.secondary {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
}

.action-btn.success {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.resource-buttons {
  display: flex;
  gap: 8px;
}

.resource-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #bdc3c7;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7f8c8d;
}

.resource-btn:hover {
  border-color: #3498db;
  color: #3498db;
  transform: scale(1.1);
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  gap: 10px;
}

.locked-overlay i {
  font-size: 2rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .program-badge {
    flex-direction: column;
    gap: 10px;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .phase-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .module-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .module-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>