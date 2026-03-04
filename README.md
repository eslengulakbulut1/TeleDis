# 🦷 TeleDiş – Yapay Zeka Destekli Dental Değerlendirme Sistemi

**TeleDiş**, diş hekimlerinin hastaları uzaktan değerlendirebilmesi için geliştirilen modern bir **tele-dentistry mobil uygulamasıdır**.  
Uygulama, intraoral dental fotoğraflar üzerinden **diş bazlı değerlendirme**, **anamnez kaydı** ve **genel periodontal analiz** yapılmasını sağlar.

Bu proje **React Native (Expo)** kullanılarak geliştirilmiştir ve modern sağlık uygulamalarına uygun **premium UI/UX tasarımına sahiptir.**

---

# 🚀 Özellikler

### 🦷 Akıllı Diş Haritası
- FDI diş numaralandırma sistemi
- Diş bazlı tanı kaydı
- İnteraktif diş seçimi
- Tanı girilen dişlerde görsel geri bildirim

### 📸 Dental Fotoğraf Yönetimi
- Kamera ile fotoğraf çekme
- Galeriden fotoğraf yükleme
- Dental görüntü görüntüleme

### 📝 Anamnez Kaydı
- Sistemik hastalık bilgileri
- Alerji bilgileri
- Sürekli kullanılan ilaçlar
- Hasta şikayetleri

### 🩺 Genel Dental Değerlendirme
- Diş eti muayenesi
- Periodontal değerlendirme
- Ağız hijyen skoru

### 💾 Offline Veri Saklama
- AsyncStorage ile lokal veri saklama
- Offline-first mimari
- Hasta verileri cihazda saklanır

---

# 🎨 UI / UX Özellikleri

Uygulama modern sağlık uygulamalarına uygun şekilde tasarlanmıştır.

### Premium Klinik Tasarım
- Minimal ve temiz arayüz
- Medikal tasarım dili
- Kart tabanlı yapı

### WOW Animasyonlar
- Reanimated tabanlı animasyonlar
- Buton etkileşim animasyonları
- Diş seçimi animasyonları
- Akıcı ekran geçişleri

### Dark Mode
- Tam karanlık mod desteği
- Göz yormayan gece modu

---

# 🧱 Kullanılan Teknolojiler

- React Native
- Expo SDK
- React Navigation
- React Native Reanimated
- Expo Image Picker
- AsyncStorage

---

# 📂 Proje Yapısı
src
├── components
│ ├── ToothItem
│ ├── PrimaryButton
│ ├── CustomInput
│ └── AnimatedBottomSheet
│
├── screens
│ ├── LoginScreen
│ ├── PatientListScreen
│ ├── PatientDetailScreen
│ ├── DentalEvaluationScreen
│ ├── AnamnezScreen
│ └── GeneralEvaluationScreen
│
├── navigation
│ ├── DrawerNavigator
│ └── StackNavigator
│
├── context
│ └── PatientContext
│
├── theme
│ └── theme.js
│
└── utils


---

# ⚙️ Kurulum

### 1️⃣ Projeyi klonla


git clone https://github.com/eslengulakbulut1/TeleDis.git

cd TeleDis


### 2️⃣ Bağımlılıkları yükle


npm install


### 3️⃣ Expo ile çalıştır


npx expo start


---

# 📱 Uygulamayı Test Etme

1. Telefona **Expo Go** uygulamasını indir  
2. Terminalde çıkan **QR kodu tara**

Alternatif olarak manuel bağlantı:


exp://<bilgisayar-ip-adresi>:8081


Bağlantı sorunu yaşarsan:


npx expo start --tunnel


---

# 🎯 Proje Amacı

Bu proje, diş hekimlerinin:

- hastaları uzaktan değerlendirebilmesini  
- dental fotoğraflar üzerinden teşhis yapabilmesini  
- hasta verilerini hızlı şekilde kaydedebilmesini  

amaçlayan bir **tele-dentistry çözümü** sunmaktadır.

---

# 👨‍💻 Geliştirici

**Eslen Gül Akbulut**

Yazılım Mühendisliği  
Mobile Application Development

---

# 📜 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
