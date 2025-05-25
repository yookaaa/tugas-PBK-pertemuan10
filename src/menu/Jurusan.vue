<template>
  <div class="jurusan-container">
    <h1>Pilih Jurusan & Semester</h1>
    
    <div class="selection-card">
      <div class="form-group">
        <label for="fakultas">Fakultas:</label>
        <select id="fakultas" v-model="selectedFakultas" @change="resetJurusan">
          <option value="">-- Pilih Fakultas --</option>
          <option v-for="fakultas in fakultasList" :key="fakultas.id" :value="fakultas">
            {{ fakultas.nama }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="jurusan">Jurusan:</label>
        <select id="jurusan" v-model="selectedJurusan" :disabled="!selectedFakultas">
          <option value="">-- Pilih Jurusan --</option>
          <option v-for="jurusan in jurusanList" :key="jurusan.id" :value="jurusan">
            {{ jurusan.nama }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="semester">Semester:</label>
        <select id="semester" v-model="selectedSemester" :disabled="!selectedJurusan">
          <option value="">-- Pilih Semester --</option>
          <option v-for="n in 8" :key="n" :value="n">Semester {{ n }}</option>
        </select>
      </div>

      <button 
        class="submit-btn" 
        :disabled="!isFormComplete"
        @click="submitSelection"
      >
        Simpan Pilihan
      </button>
    </div>

    <div v-if="selectedJurusan" class="jurusan-info">
      <h2>Informasi Jurusan</h2>
      <div class="info-card">
        <h3>{{ selectedJurusan.nama }}</h3>
        <p><strong>Akreditasi:</strong> {{ selectedJurusan.akreditasi }}</p>
        <p><strong>Deskripsi:</strong> {{ selectedJurusan.deskripsi }}</p>
        <p><strong>Mata Kuliah Unggulan:</strong> {{ selectedJurusan.mataKuliah }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JurusanPage',
  data() {
    return {
      selectedFakultas: null,
      selectedJurusan: null,
      selectedSemester: null,
      fakultasList: [
        {
          id: 1,
          nama: 'Teknik',
          jurusan: [
            { id: 101, nama: 'Teknik Informatika', akreditasi: 'A', 
              deskripsi: 'Mempelajari pengembangan perangkat lunak dan sistem komputer',
              mataKuliah: 'Algoritma, Struktur Data, Kecerdasan Buatan' },
            { id: 102, nama: 'Teknik Elektro', akreditasi: 'A', 
              deskripsi: 'Mempelajari sistem elektrik dan elektronika',
              mataKuliah: 'Rangkaian Listrik, Sistem Digital, Elektronika Daya' }
          ]
        },
        {
          id: 2,
          nama: 'Ekonomi',
          jurusan: [
            { id: 201, nama: 'Manajemen', akreditasi: 'A', 
              deskripsi: 'Mempelajari pengelolaan bisnis dan organisasi',
              mataKuliah: 'Manajemen Keuangan, Pemasaran, SDM' },
            { id: 202, nama: 'Akuntansi', akreditasi: 'A', 
              deskripsi: 'Mempelajari pencatatan dan analisis keuangan',
              mataKuliah: 'Akuntansi Keuangan, Auditing, Perpajakan' }
          ]
        }
      ]
    }
  },
  computed: {
    jurusanList() {
      return this.selectedFakultas ? this.selectedFakultas.jurusan : []
    },
    isFormComplete() {
      return this.selectedFakultas && this.selectedJurusan && this.selectedSemester
    }
  },
  methods: {
    resetJurusan() {
      this.selectedJurusan = null
      this.selectedSemester = null
    },
    submitSelection() {
      const data = {
        fakultas: this.selectedFakultas.nama,
        jurusan: this.selectedJurusan.nama,
        semester: this.selectedSemester
      }
      alert(`Data tersimpan:\nFakultas: ${data.fakultas}\nJurusan: ${data.jurusan}\nSemester: ${data.semester}`)
      // Simpan ke Vuex/localStorage atau kirim ke API
    }
  }
}
</script>

<style scoped>
/* Variabel Warna */
:root {
  --primary-blue: #3498db;
  --secondary-blue: #2980b9;
  --accent-green: #2ecc71;
  --text-dark: #333;
  --text-light: #555;
  --border-light: #e0e0e0;
  --background-light: #f4f7f6;
  --card-background: #ffffff;
  --shadow-light: rgba(0, 0, 0, 0.08);
  --shadow-hover: rgba(0, 0, 0, 0.15);
  --border-radius-lg: 12px;
  --border-radius-md: 8px;
  --transition-speed: 0.3s;
}

.jurusan-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-light); /* Latar belakang keseluruhan */
  border-radius: var(--border-radius-lg);
}

h1 {
  color: var(--primary-blue);
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5em;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.selection-card {
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: 0 8px 25px var(--shadow-light); /* Shadow yang lebih halus */
  margin-bottom: 40px;
  transition: transform var(--transition-speed) ease-in-out, box-shadow var(--transition-speed) ease-in-out;
}

.selection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px var(--shadow-hover);
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1.1em;
}

select {
  width: 100%;
  padding: 14px 15px; /* Padding lebih besar */
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-md);
  font-size: 1.05em;
  background-color: var(--background-light);
  color: var(--text-dark);
  appearance: none; /* Menghilangkan style default select */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-5.4H18.6c-5%200-9.3%201.8-13.2%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2013.2l128%20128c3.9%203.9%208.7%205.8%2013.2%205.8s9.3-1.9%2013.2-5.8l128-128c3.6-3.6%205.4-7.8%205.4-13.2%200-4.9-1.8-9.3-5.4-13.2z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 12px;
  cursor: pointer;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
  transition: border-color var(--transition-speed) ease;
}

select:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

select:disabled {
  background-color: #eceff1;
  color: #a0a0a0;
  cursor: not-allowed;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0a0a0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-5.4H18.6c-5%200-9.3%201.8-13.2%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2013.2l128%20128c3.9%203.9%208.7%205.8%2013.2%205.8s9.3-1.9%2013.2-5.8l128-128c3.6-3.6%205.4-7.8%205.4-13.2%200-4.9-1.8-9.3-5.4-13.2z%22%2F%3E%3C%2Fsvg%3E'); /* Icon abu-abu */
}

.submit-btn {
  width: 100%;
  padding: 15px 20px;
  background: linear-gradient(45deg, var(--primary-blue), var(--secondary-blue)); /* Gradien pada tombol */
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.6);
  background: linear-gradient(45deg, var(--secondary-blue), var(--primary-blue)); /* Ubah gradien sedikit saat hover */
}

.submit-btn:disabled {
  background: #cccccc;
  color: #888888;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.jurusan-info {
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: 0 8px 25px var(--shadow-light);
  border: 1px solid var(--border-light); /* Tambahkan border */
}

.jurusan-info h2 {
  color: var(--primary-blue);
  margin-bottom: 25px;
  font-size: 2em;
  font-weight: 700;
  text-align: center;
}

.info-card {
  margin-top: 15px;
  padding: 20px;
  border-left: 5px solid var(--accent-green); /* Warna aksen yang lebih cerah */
  background-color: #f7fcfb; /* Latar belakang info card yang lebih terang */
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  color: var(--secondary-blue);
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5em;
  font-weight: 600;
}

.info-card p {
  margin-bottom: 10px;
  line-height: 1.6;
  color: var(--text-light);
  font-size: 0.95em;
}

.info-card p strong {
  color: var(--text-dark);
}

/* Responsive Design */
@media (max-width: 768px) {
  .jurusan-container {
    padding: 15px;
    margin: 20px auto;
  }
  
  h1 {
    font-size: 2em;
    margin-bottom: 30px;
  }

  .selection-card, .jurusan-info {
    padding: 20px;
  }

  label {
    font-size: 1em;
    margin-bottom: 8px;
  }

  select, .submit-btn {
    padding: 12px 15px;
    font-size: 1em;
  }

  .jurusan-info h2 {
    font-size: 1.6em;
    margin-bottom: 20px;
  }

  .info-card {
    padding: 15px;
  }

  .info-card h3 {
    font-size: 1.3em;
    margin-bottom: 10px;
  }
}
</style>