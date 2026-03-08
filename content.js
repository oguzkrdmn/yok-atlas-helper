// Türkçe karakterleri doğru büyüt (i→İ, ı→I)
function trUpper(str) {
    return str.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
}

// Sayfa yüklendiğinde "Hayalet" veri çekme işlemini başlat
window.addEventListener('load', () => {
    const netButon = document.querySelector('a[href="#c1210a"], a[href="#c3210a"]');
    const icerikDiv = document.querySelector('#c1210a, #c3210a');

    if (!netButon || !icerikDiv) return;

    const hazirTablo = document.querySelector('#icerik_1210a table, #icerik_3210a table');
    if (hazirTablo) {
        netleriToplaVeGoster();
        return;
    }

    const orijinalStiller = {
        opacity: icerikDiv.style.opacity,
        position: icerikDiv.style.position,
        pointerEvents: icerikDiv.style.pointerEvents
    };

    icerikDiv.style.opacity = '0';
    icerikDiv.style.position = 'absolute';
    icerikDiv.style.pointerEvents = 'none';

    netButon.click();

    let beklemeSuresi = 0;
    const veriBekleyici = setInterval(() => {
        const tablo = document.querySelector('#icerik_1210a table, #icerik_3210a table');

        if (tablo) {
            clearInterval(veriBekleyici);
            netleriToplaVeGoster();
            netButon.click();
            setTimeout(() => {
                icerikDiv.style.opacity = orijinalStiller.opacity;
                icerikDiv.style.position = orijinalStiller.position;
                icerikDiv.style.pointerEvents = orijinalStiller.pointerEvents;
            }, 400);
        } else if (beklemeSuresi > 20) {
            clearInterval(veriBekleyici);
            icerikDiv.style.opacity = orijinalStiller.opacity;
            icerikDiv.style.position = orijinalStiller.position;
        }
        beklemeSuresi++;
    }, 200);
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
            const netDegeri = parseFloat(netSutunu.innerText.trim().replace(',', '.'));

            if (!isNaN(netDegeri)) {
                if (dersAdi.includes("TYT")) {
                    tytNet += netDegeri;
                } else if (dersAdi.includes("AYT")) {
                    aytNet += netDegeri;
                    aytVarMi = true;
                }
            }
        }
    });

    kutuOlustur(tytNet.toFixed(1), aytVarMi ? aytNet.toFixed(1) : null);
    sonKisininNetleriniCek();
}

// ─── Son kişinin netlerini kırmızı butondan çek ──────────────────────────────
function sonKisininNetleriniCek() {
    const kirmiziButon = document.querySelector('a.btn-danger[href*="netler-tablo.php"], a.btn-danger[href*="netler-onlisans-tablo.php"]');
    if (!kirmiziButon) {
        console.log('[YÖK Helper] HATA: Kırmızı buton bulunamadı!');
        return;
    }

    const tabloUrl = new URL(kirmiziButon.getAttribute('href'), window.location.href).href;
    console.log('[YÖK Helper] Fetch URL:', tabloUrl);

    const uniBaslikEl = document.querySelector('h3.panel-title.pull-left');
    if (!uniBaslikEl) {
        console.log('[YÖK Helper] HATA: h3 bulunamadı!');
        return;
    }

    const uniAdiTemiz = trUpper(uniBaslikEl.innerText.trim())
        .replace(/\s*\([^)]*\)\s*/g, '').trim();
    console.log('[YÖK Helper] Üni adı temiz:', uniAdiTemiz);

    const egitimSuresiRegex = /^\d\s*YILLIK$|^ÖNLİSANS$|^LİSANS$/i;

    const programBaslikEl = document.querySelector('h2.panel-title.pull-left');
    const programNitelikleri = [];

    if (programBaslikEl) {
        const programMetni = trUpper(programBaslikEl.innerText.trim());
        console.log('[YÖK Helper] Program ham (trUpper):', programMetni);
        const tireSonrasi = programMetni.split('-').slice(1).join('-').trim();
        const parantezRegex = /\(([^)]+)\)/g;
        let eslesme;
        while ((eslesme = parantezRegex.exec(tireSonrasi)) !== null) {
            const deger = eslesme[1].trim();
            if (!egitimSuresiRegex.test(deger)) {
                programNitelikleri.push(deger);
            }
        }
    }
    console.log('[YÖK Helper] Program nitelikleri:', programNitelikleri);

    fetch(tabloUrl)
        .then(res => {
            console.log('[YÖK Helper] Fetch status:', res.status);
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const satirlar = doc.querySelectorAll('tbody tr');
            console.log('[YÖK Helper] Toplam satır:', satirlar.length);

            // İlk 2 satırı RAW logla
            let logSayac = 0;
            for (const satir of satirlar) {
                if (logSayac >= 2) break;
                const tumTdler = Array.from(satir.querySelectorAll('td'));
                if (tumTdler.length === 0) continue;
                console.log(`[YÖK Helper] RAW Satır ${logSayac} (${tumTdler.length} td):`);
                tumTdler.forEach((td, i) => {
                    console.log(`  td[${i}] class="${td.className}" text="${td.innerText.trim().substring(0, 50)}"`);
                });
                logSayac++;
            }

            let bulunanTdler = null;
            let enIyiEslesme = null;

            for (const satir of satirlar) {
                const tumTdler = Array.from(satir.querySelectorAll('td'));

                let uniTdIndex = -1;
                for (let i = 0; i < tumTdler.length; i++) {
                    const metin = tumTdler[i].innerText.trim();
                    if (metin.length > 3 && !tumTdler[i].className.includes('text-center')) {
                        uniTdIndex = i;
                        break;
                    }
                }
                if (uniTdIndex === -1) continue;

                const tdler = tumTdler.slice(uniTdIndex);
                if (tdler.length < 7) continue;

                const satirUniAdi = trUpper(tdler[0].innerText.trim());
                const satirYil = parseInt(tdler[1].innerText.trim(), 10);

                if (satirYil !== 2025) continue;

                const satirUniTemiz = satirUniAdi.replace(/\s*\([^)]*\)/g, '').trim();
                const isimEslesti = satirUniTemiz.includes(uniAdiTemiz) || uniAdiTemiz.includes(satirUniTemiz);

                if (!isimEslesti) continue;

                console.log('[YÖK Helper] İsim eşleşti:', satirUniAdi);

                const satirParantezler = [];
                const pReg = /\(([^)]+)\)/g;
                let pm;
                while ((pm = pReg.exec(satirUniAdi)) !== null) {
                    const deger = pm[1].trim();
                    if (!egitimSuresiRegex.test(deger)) {
                        satirParantezler.push(deger);
                    }
                }
                console.log('[YÖK Helper] Satır nitelikleri:', satirParantezler);

                const eslesen = programNitelikleri.filter(nitelik =>
                    satirParantezler.some(p => p.includes(nitelik))
                );
                console.log('[YÖK Helper] Eşleşen nitelikler:', eslesen.length, '/', programNitelikleri.length);

                if (eslesen.length === programNitelikleri.length) {
                    bulunanTdler = tdler;
                    console.log('[YÖK Helper] TAM eşleşme bulundu!');
                    break;
                } else if (!enIyiEslesme) {
                    enIyiEslesme = tdler;
                    console.log('[YÖK Helper] Yedek aday kaydedildi.');
                }
            }

            if (!bulunanTdler && enIyiEslesme) {
                console.log('[YÖK Helper] Tam eşleşme yok, yedek kullanılıyor.');
                bulunanTdler = enIyiEslesme;
            }

            if (!bulunanTdler) {
                console.log('[YÖK Helper] HATA: Hiç eşleşme bulunamadı!');
                return;
            }

            console.log('[YÖK Helper] Kullanılan satır td değerleri:');
            bulunanTdler.forEach((td, i) => console.log(`  [${i}] = "${td.innerText.trim()}"`));

            const oku = (idx) => {
                if (!bulunanTdler[idx]) return null;
                const val = parseFloat(bulunanTdler[idx].innerText.trim().replace(',', '.'));
                return isNaN(val) ? null : val;
            };

            const tytDetay = {
                'Türkçe':   oku(7),
                'Sosyal':   oku(8),
                'Mat':      oku(9),
                'Fen':      oku(10),
            };
            const aytDetay = {
                'Mat':      oku(11),
                'Fizik':    oku(12),
                'Kimya':    oku(13),
                'Biyoloji': oku(14),
            };

            const tytToplam = Object.values(tytDetay).filter(v => v !== null).reduce((a, b) => a + b, 0);
            const aytNetler = Object.values(aytDetay).filter(v => v !== null);
            const aytToplam = aytNetler.length > 0 ? aytNetler.reduce((a, b) => a + b, 0) : null;

            // Puan türü DİL ise AYT → YDT, Mat → Dil olarak sadece isim değiştir
            const puanTuruEl = document.querySelector("body > div.row > div:nth-child(1) > div.panel.panel-primary > div > h3");
            console.log('[YÖK Helper] Puan türü elementi:', puanTuruEl ? `"${puanTuruEl.innerText.trim()}"` : 'BULUNAMADI');
            const dilMi = puanTuruEl && puanTuruEl.innerText.includes('DİL');
            console.log('[YÖK Helper] DİL mi?', dilMi);
            if (dilMi && 'Mat' in aytDetay) {
                aytDetay['Dil'] = aytDetay['Mat'];
                delete aytDetay['Mat'];
            }
            console.log('[YÖK Helper] aytDetay (son hali):', aytDetay);

            console.log('[YÖK Helper] TYT detay:', tytDetay, '→', tytToplam);
            console.log('[YÖK Helper] AYT detay:', aytDetay, '→', aytToplam);

            sonKisiniKutuya(tytToplam.toFixed(1), aytToplam !== null ? aytToplam.toFixed(1) : null, tytDetay, aytDetay, dilMi);
        })
        .catch(err => console.log('[YÖK Helper] Fetch HATA:', err));
}

function sonKisiniKutuya(tyt, ayt, tytDetay, aytDetay, dilMi) {
    const kutu = document.getElementById('hareketli-net-kutusu');
    if (!kutu) {
        console.log('[YÖK Helper] HATA: Kutu bulunamadı!');
        return;
    }

    const ayrac = document.createElement('div');
    ayrac.className = 'net-ayrac';
    kutu.appendChild(ayrac);

    const baslik = document.createElement('div');
    baslik.className = 'net-baslik son-kisi-baslik';
    baslik.textContent = '📋 Son Kişinin Netleri (2025)';
    kutu.appendChild(baslik);

    // TYT satırı (tıklanabilir)
    const tytWrapper = document.createElement('div');
    tytWrapper.className = 'net-detay-wrapper';

    const tytSatir = document.createElement('div');
    tytSatir.className = 'net-satir net-satir-tiklanabilir';
    tytSatir.innerHTML = `<span>TYT <span class="ok-ikon">▾</span></span> <strong class="tyt-renk-son">${tyt}</strong>`;
    tytWrapper.appendChild(tytSatir);

    const tytDetayDiv = document.createElement('div');
    tytDetayDiv.className = 'net-detay-icerik';
    Object.entries(tytDetay).forEach(([ders, net]) => {
        if (net === null) return;
        const satir = document.createElement('div');
        satir.className = 'net-detay-satir';
        satir.innerHTML = `<span>${ders}</span><span>${net.toFixed(2)}</span>`;
        tytDetayDiv.appendChild(satir);
    });
    tytWrapper.appendChild(tytDetayDiv);
    kutu.appendChild(tytWrapper);

    tytSatir.addEventListener('click', () => {
        const acik = tytDetayDiv.classList.toggle('acik');
        tytSatir.querySelector('.ok-ikon').textContent = acik ? '▴' : '▾';
    });

    // AYT satırı (tıklanabilir, varsa)
    if (ayt !== null) {
        const aytWrapper = document.createElement('div');
        aytWrapper.className = 'net-detay-wrapper';

        const aytSatir = document.createElement('div');
        aytSatir.className = 'net-satir net-satir-tiklanabilir';
        aytSatir.innerHTML = `<span>${dilMi ? 'YDT' : 'AYT'} <span class="ok-ikon">▾</span></span> <strong class="ayt-renk-son">${ayt}</strong>`;
        aytWrapper.appendChild(aytSatir);

        const aytDetayDiv = document.createElement('div');
        aytDetayDiv.className = 'net-detay-icerik';
        Object.entries(aytDetay).forEach(([ders, net]) => {
            if (net === null) return;
            const satir = document.createElement('div');
            satir.className = 'net-detay-satir';
            satir.innerHTML = `<span>${ders}</span><span>${net.toFixed(2)}</span>`;
            aytDetayDiv.appendChild(satir);
        });
        aytWrapper.appendChild(aytDetayDiv);
        kutu.appendChild(aytWrapper);

        aytSatir.addEventListener('click', () => {
            const acik = aytDetayDiv.classList.toggle('acik');
            aytSatir.querySelector('.ok-ikon').textContent = acik ? '▴' : '▾';
        });
    }
}
// ─────────────────────────────────────────────────────────────────────────────

function kutuOlustur(tyt, ayt) {
    const eskiKutu = document.getElementById('hareketli-net-kutusu');
    if (eskiKutu) eskiKutu.remove();

    const kutu = document.createElement('div');
    kutu.id = 'hareketli-net-kutusu';

    let htmlIcerik = `
        <div class="net-baslik">🎯 Ortalama Netler</div>
        <div class="net-satir"><span>TYT:</span> <strong class="tyt-renk">${tyt}</strong></div>
    `;
    if (ayt !== null) {
        htmlIcerik += `<div class="net-satir"><span>AYT:</span> <strong class="ayt-renk">${ayt}</strong></div>`;
    }
    kutu.innerHTML = htmlIcerik;
    document.body.appendChild(kutu);

    // Başlangıç konumu: ekranın ortası
    let guncelY = window.innerHeight / 2 - 50;
    kutu.style.top = guncelY + 'px';

    // ── Sadece dikey sürükleme ──────────────────────────────────────────────
    let surukleniyor = false;
    let baslangicMouseY = 0;
    let baslangicKutuY = 0;

    kutu.addEventListener('mousedown', (e) => {
        // Tıklanabilir satırlara basıldıysa sürükleme başlatma
        if (e.target.closest('.net-satir-tiklanabilir')) return;
        surukleniyor = true;
        baslangicMouseY = e.clientY;
        baslangicKutuY = parseInt(kutu.style.top, 10);
        kutu.style.transition = 'none'; // sürüklerken animasyon olmasın
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!surukleniyor) return;
        const delta = e.clientY - baslangicMouseY;
        let yeniY = baslangicKutuY + delta;

        // Ekran sınırları içinde tut
        const ekranH = window.innerHeight;
        const kutuH = kutu.offsetHeight;
        yeniY = Math.max(10, Math.min(yeniY, ekranH - kutuH - 10));

        guncelY = yeniY;
        kutu.style.top = yeniY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (surukleniyor) {
            surukleniyor = false;
            kutu.style.transition = 'top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }
    });
}