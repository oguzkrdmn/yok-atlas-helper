// Sayfa yüklendiğinde "Hayalet" veri çekme işlemini başlat
window.addEventListener('load', () => {
    // Hem 4 yıllık (Lisans) hem 2 yıllık (Önlisans) bölümlerin butonlarını hedefler
    const netButon = document.querySelector('a[href="#c1210a"], a[href="#c3210a"]');
    const icerikDiv = document.querySelector('#c1210a, #c3210a');

    if (!netButon || !icerikDiv) return;

    // Eğer tablo zaten açıksa direkt hesapla
    const hazirTablo = document.querySelector('#icerik_1210a table, #icerik_3210a table');
    if (hazirTablo) {
        netleriToplaVeGoster();
        return;
    }

    // Kullanıcıya hiçbir şey çaktırmamak için paneli "görünmez ve yer kaplamaz" yapıyoruz
    const orijinalStiller = {
        opacity: icerikDiv.style.opacity,
        position: icerikDiv.style.position,
        pointerEvents: icerikDiv.style.pointerEvents
    };
    
    icerikDiv.style.opacity = '0';
    icerikDiv.style.position = 'absolute';
    icerikDiv.style.pointerEvents = 'none';

    // Arka planda butona tıkla (Veri çekme isteğini başlatır)
    netButon.click();

    // Verinin yüklenip yüklenmediğini sürekli kontrol et
    let beklemeSuresi = 0;
    const veriBekleyici = setInterval(() => {
        const tablo = document.querySelector('#icerik_1210a table, #icerik_3210a table');
        
        if (tablo) {
            clearInterval(veriBekleyici); // Tablo bulundu, aramayı durdur
            
            // 1. Veriyi çek ve kutuyu oluştur
            netleriToplaVeGoster();
            
            // 2. Paneli geri kapatmak için tekrar butona tıkla
            netButon.click();
            
            // 3. Panelin gizliliğini kaldır (Kullanıcı kendisi tıklamak isterse normal çalışsın diye)
            setTimeout(() => {
                icerikDiv.style.opacity = orijinalStiller.opacity;
                icerikDiv.style.position = orijinalStiller.position;
                icerikDiv.style.pointerEvents = orijinalStiller.pointerEvents;
            }, 400); // Kapanma animasyonunun bitmesini ufak bir pay bırakarak bekle
            
        } else if (beklemeSuresi > 20) { // 20 * 200ms = 4 saniye geçtiyse pes et
            clearInterval(veriBekleyici);
            icerikDiv.style.opacity = orijinalStiller.opacity;
            icerikDiv.style.position = orijinalStiller.position;
        }
        beklemeSuresi++;
    }, 200); // Her 200 milisaniyede bir kontrol et
});

function netleriToplaVeGoster() {
    const tablo = document.querySelector('#icerik_1210a table, #icerik_3210a table');
    if (!tablo) return;

    const satirlar = tablo.querySelectorAll('tbody tr');
    let tytNet = 0;
    let aytNet = 0;
    let aytVarMi = false;

    satirlar.forEach(satir => {
        const dersSutunu = satir.querySelector('td.text-left');
        const netSutunu = satir.querySelectorAll('td.text-center')[0];

        if (dersSutunu && netSutunu) {
            const dersAdi = dersSutunu.innerText.trim();
            const netMetni = netSutunu.innerText.trim();
            const netDegeri = parseFloat(netMetni.replace(',', '.'));

            if (!isNaN(netDegeri)) {
                if (dersAdi.includes("TYT")) {
                    tytNet += netDegeri;
                } else if (dersAdi.includes("AYT")) {
                    aytNet += netDegeri;
                    aytVarMi = true; // Eğer AYT neti okursa bunu işaretler
                }
            }
        }
    });

    // TYT her zaman gönderilir. AYT yoksa "null" olarak gönderilir.
    kutuOlustur(tytNet.toFixed(1), aytVarMi ? aytNet.toFixed(1) : null);
}

function kutuOlustur(tyt, ayt) {
    const eskiKutu = document.getElementById('hareketli-net-kutusu');
    if (eskiKutu) eskiKutu.remove();

    const kutu = document.createElement('div');
    kutu.id = 'hareketli-net-kutusu';
    
    // TYT satırı her zaman eklenecek
    let htmlIcerik = `
        <div class="net-baslik">🎯 Hedef Netler</div>
        <div class="net-satir"><span>TYT:</span> <strong class="tyt-renk">${tyt}</strong></div>
    `;

    // Eğer AYT datası varsa, onu da kutunun içine dahil et
    if (ayt !== null) {
        htmlIcerik += `<div class="net-satir"><span>AYT:</span> <strong class="ayt-renk">${ayt}</strong></div>`;
    }

    kutu.innerHTML = htmlIcerik;
    document.body.appendChild(kutu);

    let guncelY = window.innerHeight / 2 - 50;
    kutu.style.top = `${guncelY}px`;

    kutu.addEventListener('mouseenter', () => {
        const kutuBoyutu = kutu.offsetHeight;
        const ekranBoyutu = window.innerHeight;
        const sicramaMesafesi = 200; 
        
        if (guncelY < ekranBoyutu / 2) {
            guncelY += sicramaMesafesi;
            if (guncelY + kutuBoyutu > ekranBoyutu - 20) {
                guncelY = ekranBoyutu - kutuBoyutu - 20;
            }
        } else {
            guncelY -= sicramaMesafesi;
            if (guncelY < 20) {
                guncelY = 20;
            }
        }
        kutu.style.top = `${guncelY}px`;
    });
}