<template>
  <aside class="sidebar modern-light">
    <div class="logo">FUN STUDY</div>
    
    <div class="section">
      <p class="section-title">Menu Utama</p>
      <router-link to="/" class="link" exact-active-class="active">Beranda</router-link>
      <router-link to="/jurusan" class="link" exact-active-class="active">Pilih Jurusan</router-link>
      <router-link to="/RencanaBelajar" class="link" exact-active-class="active">Rencana Belajar</router-link>
    </div>

    <div class="section">
      <p class="section-title">Materi & Modul</p>
      <router-link to="/dasar" class="link" exact-active-class="active">Dasar</router-link>
      <router-link to="/menengah" class="link" exact-active-class="active">Menengah</router-link>
      <router-link to="/lanjut" class="link" exact-active-class="active">Lanjut</router-link>
    </div>

    <div class="section">
      <p class="section-title">Evaluasi & Lainnya</p>
      <router-link to="/quiz" class="link" exact-active-class="active">Quiz</router-link>
      <router-link to="/forum" class="link" exact-active-class="active">Forum</router-link>
      <router-link to="/artikel" class="link" exact-active-class="active">Artikel</router-link>
      <router-link to="/notifikasi" class="link" exact-active-class="active">Notifikasi</router-link>
      <router-link to="/profil" class="link" exact-active-class="active">Profil</router-link>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      defaultJurusan: 'informatika'
    }
  }
}
</script>

<style lang="scss" scoped>
$background-light: #f8f9fa;
$text-dark: #343a40;
$text-muted: #6c757d;
$accent-color: #007bff; // Biru yang cerah
$accent-hover: #0056b3;
$active-bg: #e9ecef;
$border-radius-sm: 4px;
$transition-speed: 0.2s;

.sidebar {
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: $background-light;
  color: $text-dark;
  padding: 30px 25px;
  overflow-y: auto;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 100;
  border-right: 1px solid #dee2e6; // Border tipis

  .logo {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 40px;
    color: $accent-color;
    letter-spacing: 0.5px;
    user-select: none;
    padding: 0 0 15px 0; // Padding disesuaikan
    border-bottom: 1px solid rgba(0, 0, 0, 0.08); // Garis pemisah yang lebih halus
  }

  .section {
    margin-bottom: 30px;

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: $text-muted;
      margin-bottom: 10px; // Spasi lebih kecil
      letter-spacing: 0.08em;
      user-select: none;
      padding: 0 0; // Padding dihapus
    }

    .link {
      display: flex;
      align-items: center;
      padding: 10px 15px; // Padding lebih kecil
      color: $text-dark;
      text-decoration: none;
      border-radius: $border-radius-sm; // Radius border lebih kecil
      font-weight: 500;
      font-size: 15px;
      transition: all $transition-speed ease;
      margin-bottom: 4px; // Spasi antar link lebih kecil

      &:hover {
        background-color: lighten($accent-color, 45%); // Warna hover yang lebih terang
        color: $accent-hover;
        transform: none; // Menghilangkan efek translateX
      }

      &.active {
        background-color: $accent-color;
        color: white;
        font-weight: 600;
        box-shadow: none; // Menghilangkan shadow
        transform: none; // Menghilangkan efek translateX
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      position: relative;
      width: 100%;
      height: auto;
      box-shadow: none; // Hapus shadow di mobile
      border-right: none;
      border-bottom: 1px solid #dee2e6; // Tambah border bawah
    }
  }
}
</style>