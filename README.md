# 🎯 YÖK Atlas Helper

YÖK Atlas'ta bölüm sayfalarını incelerken hedef net toplamlarını ve o bölüme **en son yerleşen kişinin** ders bazlı net ortalamalarını ekranın kenarında küçük, şık bir kutu içinde gösteren Chrome eklentisi.

---

## 🚀 Kurulum

1. Eklentiyi Chrome'a eklemek sadece 1 dakikanızı alır:

2. Dosyaları İndirin: Bu sayfadaki yeşil "Code" butonuna basıp "Download ZIP" deyin (veya klasörü bilgisayarınıza klonlayın). ZIP dosyasını bir klasöre çıkartın.

3. Uzantıları Açın: Chrome adres çubuğuna chrome://extensions/ yazın ve gidin.

4. Geliştirici Modu: Sağ üst köşedeki "Geliştirici modu" anahtarını AÇIK konuma getirin.

5. Ekle: Sol üstteki "Paketlenmemiş öğe yükle" butonuna tıklayın.

6. Klasörü Seçin: ZIP'ten çıkardığınız klasörü seçin.

Bitti! Artık YÖK Atlas'ta bir bölüme girdiğinizde sihirbaz sağ tarafta belirecek.

---

## 🗂️ Dosya Yapısı

```
├── manifest.json     # Eklenti yapılandırması
├── content.js        # Ana mantık
├── style.css         # Kutu tasarımı
└── icon.png          # Eklenti ikonu
```

---

---

## ✨ Özellikler

### 📊 Hedef Net Toplamları
Bölüm sayfasına girdiğinizde, o programa yerleşmek için gereken **TYT ve AYT net ortalamalarını** otomatik olarak hesaplayıp gösterir.

### 👤 Son Yerleşen Kişinin Netleri
O programa **2025 yılında en son yerleşen kişinin** ders ders net ortalamalarını getirir.

- **TYT:** Türkçe, Sosyal, Matematik, Fen
- **AYT:** Matematik, Fizik, Kimya, Biyoloji
- **YDT (Dil bölümleri):** Tüm Diller

### 🏫 Lisans & Önlisans Desteği
Hem **4 yıllık lisans** hem de **2 yıllık önlisans** programlarında çalışır.

### 📂 Tıklanabilir Detay Açılır Paneli
Son yerleşen kişinin TYT ve AYT/YDT toplam netlerine tıklayınca ders bazlı breakdown açılır. Tekrar tıklayınca kapanır.

---

## 🔒 Gizlilik

Eklenti herhangi bir veriyi dışarı göndermez. Tüm işlemler yalnızca tarayıcınızda, `yokatlas.yok.gov.tr` sayfaları üzerinde gerçekleşir.
