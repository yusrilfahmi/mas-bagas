document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputJudul = document.getElementById('input-judul');
    const inputWaktu = document.getElementById('input-waktu');
    const inputGambar = document.getElementById('input-gambar');
    
    const previewJudul = document.getElementById('preview-judul');
    const previewWaktu = document.getElementById('preview-waktu');
    const previewImage = document.getElementById('preview-image');
    const uploadText = document.getElementById('upload-text');
    const btnDownload = document.getElementById('btn-download');

    // Update Preview secara Real-time saat mengetik
    inputJudul.addEventListener('input', function() {
        previewJudul.textContent = this.value || 'JUDUL DOKUMEN KOSONG';
    });

    inputWaktu.addEventListener('input', function() {
        previewWaktu.textContent = this.value || 'WAKTU KOSONG';
    });

    // Menangani Upload Gambar
    inputGambar.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Ubah teks upload
            uploadText.textContent = file.name;

            // Gunakan FileReader untuk membaca file
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Fungsi Generate PDF
    btnDownload.addEventListener('click', function() {
        // Targetkan elemen preview untuk diubah ke PDF (isinya akan sama persis)
        const element = document.getElementById('document-to-pdf');
        
        // Ambil nilai dari input judul untuk dijadikan nama file
        // Jika input kosong, gunakan nama default 'Dokumen_Tanpa_Judul'
        let namaFile = inputJudul.value.trim();
        if (namaFile === "") {
            namaFile = "Dokumen_Tanpa_Judul";
        }
        
        const opt = {
            margin:       [15, 15, 15, 15],
            filename:     namaFile + '.pdf', // Nama file sekarang dinamis sesuai judul
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Proses generate dan download
        html2pdf().set(opt).from(element).save();
    });
});