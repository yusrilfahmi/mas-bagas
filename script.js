document.addEventListener('DOMContentLoaded', () => {
    const inputJudul = document.getElementById('input-judul');
    const inputWaktu = document.getElementById('input-waktu');
    const inputFontSize = document.getElementById('input-font-size');
    const inputGambar = document.getElementById('input-gambar');
    
    const previewJudul = document.getElementById('preview-judul');
    const previewWaktu = document.getElementById('preview-waktu');
    const previewImage = document.getElementById('preview-image');
    const uploadText = document.getElementById('upload-text');
    const btnDownload = document.getElementById('btn-download');

    let base64Image = null;

    // Fungsi update UI
    function updatePreviewUI() {
        previewJudul.textContent = inputJudul.value || 'JUDUL DOKUMEN KOSONG';
        previewWaktu.textContent = inputWaktu.value || 'WAKTU KOSONG';
        
        let fontSize = parseInt(inputFontSize.value) || 18;
        // Update font size di layar web, proporsional
        previewJudul.style.fontSize = fontSize + 'pt';
        previewWaktu.style.fontSize = Math.max(10, fontSize - 4) + 'pt';
    }

    // Pasang Event Listener
    inputJudul.addEventListener('input', updatePreviewUI);
    inputWaktu.addEventListener('input', updatePreviewUI);
    inputFontSize.addEventListener('input', updatePreviewUI);

    // Inisialisasi awal font size di UI
    updatePreviewUI();

    inputGambar.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            uploadText.textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result;
                previewImage.src = base64Image;
                previewImage.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    btnDownload.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: 'a4'
        });

        const margin = 2.54;
        const pageWidth = 21.0; 
        const pageHeight = 29.7;
        const contentWidth = pageWidth - (margin * 2);

        let judul = inputJudul.value.trim().toUpperCase();
        let waktu = inputWaktu.value.trim().toUpperCase();
        let namaFile = judul ? judul : 'Dokumen_Laporan';
        let fontSizeJudul = parseInt(inputFontSize.value) || 18;

        // --- 1. SETTING JUDUL ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSizeJudul);
        
        // Memecah teks jika terlalu panjang agar tidak nabrak margin
        let splitTitle = doc.splitTextToSize(judul, contentWidth);
        let startY = margin + 1; // Posisi Y awal
        
        // Cetak judul
        doc.text(splitTitle, pageWidth / 2, startY, { align: 'center' });

        // --- 2. KALKULASI JARAK UNTUK SUB-JUDUL ---
        // Menghitung berapa cm ruang yang dihabiskan oleh judul
        // 1 pt = ~0.03527 cm. Kita kalikan dengan line height agar dinamis
        let titleHeightCm = (fontSizeJudul * 0.03527 * 1.15) * splitTitle.length;
        
        // Posisi Y baru untuk Waktu (ditambah sedikit jarak)
        let subtitleY = startY + titleHeightCm + 0.3;

        // --- 3. SETTING SUB-JUDUL (WAKTU) ---
        let fontSizeWaktu = Math.max(10, fontSizeJudul - 4); // Ukuran lebih kecil dari judul
        doc.setFontSize(fontSizeWaktu);
        doc.text(waktu, pageWidth / 2, subtitleY, { align: 'center' });

        // --- 4. SETTING GAMBAR ---
        if (base64Image) {
            const img = new Image();
            img.src = base64Image;
            
            img.onload = function() {
                const imgRatio = img.width / img.height;
                
                // Mulai letakkan gambar 1.5 cm di bawah sub-judul
                const imageStartY = subtitleY + 1.5; 
                
                const maxImgWidth = contentWidth;
                const maxImgHeight = pageHeight - imageStartY - margin; 

                let finalWidth = maxImgWidth;
                let finalHeight = finalWidth / imgRatio;

                if (finalHeight > maxImgHeight) {
                    finalHeight = maxImgHeight;
                    finalWidth = finalHeight * imgRatio;
                }

                const xPos = (pageWidth - finalWidth) / 2;
                doc.addImage(base64Image, xPos, imageStartY, finalWidth, finalHeight);
                doc.save(namaFile + '.pdf');
            };
        } else {
            doc.save(namaFile + '.pdf');
        }
    });
});
