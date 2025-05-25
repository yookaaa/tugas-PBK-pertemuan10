<template>
  <div class="rencana-container">
    <div class="bg-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <div class="page-header">
      <h1 class="page-title">
        <span class="icon">📚</span>
        Rencana Belajar Personal
      </h1>
      <p class="subtitle">Susun jadwal belajar yang optimal untuk mencapai tujuanmu</p>
    </div>

    <div class="profile-section">
      <div class="profile-card">
        <div class="card-header">
          <div class="header-icon">👨‍🎓</div>
          <h2>Profil Pembelajaran</h2>
        </div>
        <div class="profile-info">
          <div class="info-item">
            <span class="label">Jurusan:</span>
            <span class="value">Teknik Informatika</span>
          </div>
          <div class="info-item">
            <span class="label">Semester:</span>
            <span class="value">4 (Empat)</span>
          </div>
          <div class="info-item">
            <span class="label">Fokus:</span>
            <span class="value">Data Science</span>
          </div>
        </div>
      </div>
    </div>

    <div class="time-selection">
      <div class="section-header">
        <h2>⏰ Pilih Waktu Belajar Optimal</h2>
        <p class="time-note">Pilih slot waktu 2 jam yang paling produktif untukmu</p>
      </div>

      <div class="time-grid">
        <div
          v-for="timeSlot in timeSlots"
          :key="timeSlot.value"
          class="time-card"
          :class="{ active: selectedTime === timeSlot.value, recommended: timeSlot.recommended }"
          @click="selectTime(timeSlot.value)"
        >
          <div class="time-header">
            <span class="time-label">{{ timeSlot.label }}</span>
            <span v-if="timeSlot.recommended" class="recommended-badge">⭐ Optimal</span>
          </div>
          <div class="time-description">{{ timeSlot.description }}</div>
          <div class="productivity-indicator">
            <div class="indicator-bar">
              <div class="fill" :style="{ width: timeSlot.productivity + '%' }"></div>
            </div>
            <span class="productivity-text">{{ timeSlot.productivity }}% Produktivitas</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTime" class="study-plan">
      <div class="plan-header">
        <h2>📖 Agenda Belajar ({{ selectedTimeLabel }})</h2>
        <div class="plan-stats">
          <span class="total-subjects">{{ todaysPlan.length }} Mata Kuliah</span>
          <span class="total-duration">2 Jam Total</span>
        </div>
      </div>

      <div class="subjects-container">
        <div
          class="subject-card"
          v-for="(subject, index) in todaysPlan"
          :key="index"
          :class="{ completed: subject.progress === 100 }"
        >
          <div class="subject-header">
            <div class="subject-info">
              <div class="subject-icon">{{ subject.icon }}</div>
              <div class="subject-details">
                <h3>{{ subject.name }}</h3>
                <div class="subject-meta">
                  <span class="duration">⏱ {{ subject.duration }} jam</span>
                  <span class="difficulty" :class="subject.difficulty.toLowerCase()">
                    {{ subject.difficulty }}
                  </span>
                </div>
              </div>
            </div>

            <div class="subject-actions">
              <button
                class="notification-toggle"
                :class="{ active: subject.notification }"
                @click="toggleNotification(index)"
                :title="subject.notification ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi'"
              >
                <span v-if="subject.notification">🔔</span>
                <span v-else>🔕</span>
              </button>
            </div>
          </div>

          <p class="subject-description">{{ subject.description }}</p>

          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progress Belajar</span>
              <span class="progress-value">{{ subject.progress }}%</span>
            </div>
            <div class="progress-bar-container">
              <input
                type="range"
                v-model="subject.progress"
                min="0"
                max="100"
                class="progress-slider"
                @input="updateProgress(index)"
              >
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: subject.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="subject-tags">
            <span v-for="tag in subject.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <div class="main-actions">
        <button class="save-btn primary" @click="savePlan">
          <span class="btn-icon">💾</span>
          <span>Simpan Rencana</span>
        </button>
        <button class="export-btn secondary" @click="exportPlan">
          <span class="btn-icon">📤</span>
          <span>Export PDF</span>
        </button>
      </div>

      <div class="motivation-section">
        <div class="motivation-card">
          <div class="quote-icon">💪</div>
          <div class="quote-content">
            <p class="quote-text">{{ currentQuote.text }}</p>
            <span class="quote-author">- {{ currentQuote.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon">✅</div>
        <h3>Berhasil!</h3>
        <p>{{ successMessage }}</p>
        <button class="modal-btn" @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RencanaBelajar',
  data() {
    return {
      selectedTime: null,
      showSuccessModal: false, // Added for modal
      successMessage: '', // Added for modal
      currentQuote: { // Added for dynamic quotes
        text: "Konsistensi adalah kunci kesuksesan dalam belajar!",
        author: "Albert Einstein"
      },
      timeSlots: [
        {
          label: '08.00 - 10.00',
          value: '08-10',
          description: 'Pagi hari - Konsentrasi tinggi', // Added
          productivity: 95, // Added
          recommended: true // Added
        },
        {
          label: '10.00 - 12.00',
          value: '10-12',
          description: 'Mid-morning - Fokus optimal', // Added
          productivity: 90, // Added
          recommended: false
        },
        {
          label: '13.00 - 15.00',
          value: '13-15',
          description: 'Siang hari - Energi stabil', // Added
          productivity: 75, // Added
          recommended: false
        },
        {
          label: '15.00 - 17.00',
          value: '15-17',
          description: 'Sore hari - Mood relaxed', // Added
          productivity: 80, // Added
          recommended: false
        },
        {
          label: '19.00 - 21.00',
          value: '19-21',
          description: 'Malam hari - Suasana tenang', // Added
          productivity: 85, // Added
          recommended: false
        }
      ],
      subjects: {
        '08-10': [
          {
            name: 'Basis Data Lanjut',
            icon: '🗄️', // Added icon
            duration: 1,
            description: 'Optimasi query kompleks, indexing strategis, dan performa tuning database enterprise', // Enhanced description
            progress: 0,
            notification: false,
            difficulty: 'Hard', // Added
            tags: ['Database', 'SQL', 'Optimization'] // Added
          },
          {
            name: 'Algoritma & Struktur Data Lanjut', // Changed name
            icon: '🧠', // Added icon
            duration: 1,
            description: 'Implementasi advanced algorithms, graph theory, dan dynamic programming untuk problem solving', // Enhanced description
            progress: 0,
            notification: false,
            difficulty: 'Hard', // Added
            tags: ['Algorithm', 'Data Structure', 'Problem Solving'] // Added
          }
        ],
        '10-12': [
          {
            name: 'Pemrograman Web Lanjut',
            icon: '🌐',
            duration: 1,
            description: 'Membangun RESTful API dengan Node.js, authentication, dan microservices architecture',
            progress: 0,
            notification: false,
            difficulty: 'Medium',
            tags: ['Web Dev', 'API', 'Backend']
          },
          {
            name: 'Machine Learning Dasar',
            icon: '🤖',
            duration: 1,
            description: 'Supervised learning, regression analysis, dan implementasi model prediksi dengan Python',
            progress: 0,
            notification: false,
            difficulty: 'Medium',
            tags: ['ML', 'Python', 'Data Science']
          }
        ],
        '13-15': [
          {
            name: 'Sistem Operasi',
            icon: '💻',
            duration: 1,
            description: 'Process management, memory allocation, dan concurrency dalam sistem operasi modern',
            progress: 0,
            notification: false,
            difficulty: 'Hard',
            tags: ['OS', 'System', 'Process']
          },
          {
            name: 'Jaringan Komputer',
            icon: '🌍',
            duration: 1,
            description: 'Protokol TCP/IP, socket programming, dan network security fundamentals',
            progress: 0,
            notification: false,
            difficulty: 'Medium',
            tags: ['Network', 'TCP/IP', 'Security']
          }
        ],
        '15-17': [
          {
            name: 'Analisis Data',
            icon: '📊',
            duration: 1,
            description: 'Data visualization dengan Matplotlib, statistical analysis, dan business intelligence',
            progress: 0,
            notification: false,
            difficulty: 'Easy',
            tags: ['Analytics', 'Visualization', 'Statistics']
          },
          {
            name: 'Big Data',
            icon: '📈',
            duration: 1,
            description: 'Hadoop ecosystem, Apache Spark, dan distributed computing untuk large-scale data',
            progress: 0,
            notification: false,
            difficulty: 'Hard',
            tags: ['Big Data', 'Hadoop', 'Spark']
          }
        ],
        '19-21': [
          {
            name: 'Keamanan Sistem',
            icon: '🔒',
            duration: 1,
            description: 'Cryptography principles, encryption algorithms, dan cybersecurity best practices',
            progress: 0,
            notification: false,
            difficulty: 'Medium',
            tags: ['Security', 'Crypto', 'Cybersecurity']
          },
          {
            name: 'Proyek Mandiri',
            icon: '🚀',
            duration: 1,
            description: 'Pengembangan portfolio project, code review, dan deployment ke production',
            progress: 0,
            notification: false,
            difficulty: 'Easy',
            tags: ['Project', 'Portfolio', 'Development']
          }
        ]
      },
      quotes: [ // Added more quotes
        { text: "Konsistensi adalah kunci kesuksesan dalam belajar!", author: "Albert Einstein" },
        { text: "Belajar tanpa berpikir adalah sia-sia, berpikir tanpa belajar adalah berbahaya", author: "Confucius" },
        { text: "Investasi terbaik adalah investasi pada diri sendiri melalui pendidikan", author: "Benjamin Franklin" }
      ]
    }
  },
  computed: {
    selectedTimeLabel() {
      const slot = this.timeSlots.find(slot => slot.value === this.selectedTime)
      return slot ? slot.label : ''
    },
    todaysPlan() {
      return this.selectedTime ? this.subjects[this.selectedTime] : []
    }
  },
  methods: {
    selectTime(time) {
      this.selectedTime = time
    },
    toggleNotification(index) {
      this.todaysPlan[index].notification = !this.todaysPlan[index].notification
      const status = this.todaysPlan[index].notification ? 'diaktifkan' : 'dimatikan'
      this.showSuccess(`Notifikasi untuk "${this.todaysPlan[index].name}" ${status}!`)
    },
    updateProgress(index) { // Added for progress success message
      const subject = this.todaysPlan[index]
      if (subject.progress == 100) {
        this.showSuccess(`Selamat! Kamu telah menyelesaikan "${subject.name}"! 🎉`)
      }
    },
    savePlan() {
      this.showSuccess('Rencana belajar berhasil disimpan ke akun kamu!')
      console.log('Rencana tersimpan:', {
        waktu: this.selectedTimeLabel,
        mataPelajaran: this.todaysPlan
      })
    },
    exportPlan() { // Added new method
      this.showSuccess('Rencana belajar berhasil di-export ke PDF!')
    },
    showSuccess(message) { // Added for modal
      this.successMessage = message
      this.showSuccessModal = true
    },
    closeModal() { // Added for modal
      this.showSuccessModal = false
    }
  },
  mounted() { // Added for dynamic quotes
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.quotes.length)
      this.currentQuote = this.quotes[randomIndex]
    }, 10000)
  }
}
</script>

<style lang="scss" scoped>
.rencana-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

// Background Elements
.bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s ease-in-out infinite;

  &.shape-1 {
    width: 200px;
    height: 200px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 15%;
    animation-delay: 7s;
  }

  &.shape-3 {
    width: 100px;
    height: 100px;
    bottom: 30%;
    left: 20%;
    animation-delay: 14s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  33% { transform: translateY(-20px) scale(1.05); }
  66% { transform: translateY(10px) scale(0.95); }
}

// Main Content
.rencana-container > * {
  position: relative;
  z-index: 1;
}

// Page Header
.page-header {
  text-align: center;
  padding: 60px 20px 40px;
  color: white;

  .page-title {
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 800;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    .icon {
      font-size: 1.2em;
    }
  }

  .subtitle {
    font-size: 18px;
    opacity: 0.9;
    max-width: 500px;
    margin: 0 auto;
  }
}

// Profile Section
.profile-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.profile-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 32px;
  color: white;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .header-icon {
    font-size: 32px;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
}

.profile-info { // Changed from .profile-stats
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item { // Changed from .stat-card
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column; // Changed to column
  align-items: flex-start; // Aligned to start
  gap: 8px; // Reduced gap
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .label { // Changed from .stat-label
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 0px; // Removed margin
  }

  .value { // Changed from .stat-value
    font-size: 16px;
    font-weight: 600;
  }
}

// Time Selection
.time-selection {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;

  .section-header {
    text-align: center;
    margin-bottom: 32px;
    color: white;

    h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .time-note { // Changed from .note
      opacity: 0.9;
      font-size: 16px;
    }
  }
}

.time-grid { // Changed from .time-options
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.time-card { // Changed from .time-options button
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.active {
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
  }

  &.recommended::before { // New for recommended glow
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #f093fb, #f5576c, #4facfe, #00f2fe);
    border-radius: 22px;
    z-index: -1;
    animation: glow 2s ease-in-out infinite alternate;
  }

  .time-header { // New structure
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .time-label {
      font-size: 18px;
      font-weight: 700;
    }

    .recommended-badge {
      background: linear-gradient(45deg, #f093fb, #f5576c);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .time-description { // New for description
    margin-bottom: 16px;
    opacity: 0.9;
    font-size: 14px;
  }

  .productivity-indicator { // New for productivity bar
    .indicator-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;

      .fill {
        height: 100%;
        background: linear-gradient(90deg, #4facfe, #00f2fe);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }

    .productivity-text {
      font-size: 12px;
      opacity: 0.8;
    }
  }
}

@keyframes glow {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

// Study Plan
.study-plan {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;

  .plan-header { // New for plan header
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    color: white;
    flex-wrap: wrap;
    gap: 16px;

    h2 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }

    .plan-stats {
      display: flex;
      gap: 16px;

      span {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.subjects-container { // Changed from .plan-items
  display: grid;
  gap: 24px;
}

.subject-card { // Changed from .plan-item
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &.completed { // New for completed state
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .subject-header,
    .subject-description,
    .progress-label,
    .tag {
      color: white;
    }

    .tag {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Align to start
  margin-bottom: 16px; // Increased margin
}

.subject-info { // New wrapper
  display: flex;
  gap: 16px;
  flex: 1;

  .subject-icon { // New icon
    font-size: 32px;
    flex-shrink: 0;
  }

  .subject-details { // New wrapper for details
    h3 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 8px 0; // Adjusted margin
      color: #2c3e50;
    }

    .subject-meta { // New for duration and difficulty
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      .duration {
        font-size: 14px;
        color: #7f8c8d;
        font-weight: 500;
      }

      .difficulty {
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;

        &.easy {
          background: #d4edda;
          color: #155724;
        }

        &.medium {
          background: #fff3cd;
          color: #856404;
        }

        &.hard {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }
  }
}

.subject-actions {
  .notification-toggle { // Changed from .notification-btn
    background: none;
    border: none;
    font-size: 20px; // Adjusted size
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.active {
      background: rgba(102, 126, 234, 0.1); // Soft active background
    }
  }
}

.subject-description { // Changed from .description
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 20px; // Increased margin
  font-size: 15px; // Adjusted size
}

.progress-section { // New wrapper
  margin-bottom: 20px;

  .progress-header { // New for progress label and value
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .progress-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 14px;
    }

    .progress-value {
      font-weight: 700;
      color: #667eea;
      font-size: 16px;
    }
  }

  .progress-bar-container { // New for better slider and bar
    position: relative;

    .progress-slider {
      width: 100%;
      height: 8px; // Thicker slider
      border-radius: 4px;
      background: transparent; // Make input background transparent
      outline: none;
      position: relative;
      z-index: 2;
      cursor: pointer;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #667eea; // Theme color thumb
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #667eea;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
    }

    .progress-bar {
      position: absolute;
      top: 6px; // Adjust to align with slider
      left: 0;
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      z-index: 1;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2); // Gradient fill
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }
  }
}

.subject-tags { // New tag section
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .tag {
    background: #f8f9fa;
    color: #495057;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
}

// Action Section
.action-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-actions { // New wrapper for buttons
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.save-btn, .export-btn { // Combined button styles
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 30px; // Pill shape
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); // Soft shadow

  .btn-icon { // Icon within button
    font-size: 1.2em;
  }

  &.primary {
    background: linear-gradient(45deg, #667eea, #764ba2); // Theme gradient
    color: white;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &.secondary {
    background: white;
    color: #667eea;
    border: 1px solid #667eea;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      background: #f0f2ff; // Light hover background
    }
  }
}

.motivation-section { // New wrapper
  text-align: center;
}

.motivation-card { // Changed from .motivation-quote
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  color: white;
  display: inline-flex; // Use inline-flex for content alignment
  align-items: flex-start;
  gap: 20px;
  max-width: 600px;
  text-align: left; // Align text within card
}

.quote-icon { // New icon
  font-size: 36px;
  flex-shrink: 0;
  line-height: 1;
}

.quote-content { // New wrapper for quote text
  .quote-text {
    font-size: 18px;
    font-style: italic;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .quote-author {
    font-size: 14px;
    font-weight: 600;
    opacity: 0.8;
  }
}

// Modal Styles (New)
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.success-modal {
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  animation: scaleIn 0.3s ease-out;

  .success-icon {
    font-size: 60px;
    color: #28a745; // Green checkmark
    margin-bottom: 20px;
  }

  h3 {
    font-size: 28px;
    color: #333;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 30px;
  }

  .modal-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 12px 28px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .page-header {
    padding: 40px 15px 30px;
  }

  .page-title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 16px;
  }

  .profile-card, .time-card, .subject-card, .motivation-card {
    padding: 24px;
  }

  .card-header h2, .section-header h2, .study-plan .plan-header h2 {
    font-size: 24px;
  }

  .profile-info {
    grid-template-columns: 1fr;
  }

  .time-grid {
    grid-template-columns: 1fr;
  }

  .subject-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .subject-details {
    margin-top: 8px;
  }

  .subject-actions {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .main-actions {
    flex-direction: column;
    align-items: center;
  }

  .save-btn, .export-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 30px 15px 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  .profile-card, .time-card, .subject-card, .motivation-card {
    padding: 20px;
  }

  .card-header .header-icon {
    font-size: 28px;
  }

  .card-header h2, .section-header h2, .study-plan .plan-header h2 {
    font-size: 20px;
  }

  .info-item .label, .info-item .value {
    font-size: 14px;
  }

  .time-card .time-label {
    font-size: 16px;
  }

  .time-card .time-description {
    font-size: 13px;
  }

  .subject-info .subject-icon {
    font-size: 28px;
  }

  .subject-details h3 {
    font-size: 18px;
  }

  .subject-meta .duration, .subject-meta .difficulty {
    font-size: 11px;
  }

  .subject-description {
    font-size: 14px;
  }

  .progress-header .progress-label {
    font-size: 13px;
  }

  .progress-header .progress-value {
    font-size: 15px;
  }

  .tag {
    font-size: 11px;
    padding: 3px 10px;
  }

  .motivation-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .quote-icon {
    font-size: 30px;
  }

  .quote-text {
    font-size: 16px;
  }

  .quote-author {
    font-size: 13px;
  }

  .success-modal {
    padding: 30px;
  }

  .success-modal .success-icon {
    font-size: 50px;
  }

  .success-modal h3 {
    font-size: 24px;
  }

  .success-modal p {
    font-size: 14px;
  }

  .modal-btn {
    padding: 10px 20px;
    font-size: 15px;
  }
}
</style>