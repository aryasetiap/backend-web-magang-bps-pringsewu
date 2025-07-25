**Halo, berikut instruksi untuk deploy backend aplikasi:**

1. **File yang saya kirim:**
   - Folder dist (hasil build backend)
   - File .env (berisi konfigurasi environment, termasuk koneksi database)

2. **Langkah-langkah deploy:**
   - Pastikan sudah install Node.js dan npm di server.
   - Install dependency:
     ```sh
     npm ci
     ```
   - Pastikan file .env sudah diletakkan di lokasi yang sama dengan file entry point di dalam folder dist.
   - Jalankan migrasi dan seed database:
     ```sh
     npx prisma migrate deploy
     npx prisma db seed
     ```
   - Jalankan backend:
     ```sh
     cd dist
     node index.js
     ```
     _(atau sesuaikan dengan nama file utama di folder dist)_

3. **Catatan:**
   - Pastikan koneksi database di file .env sudah benar dan database sudah tersedia.
   - Jika ada kendala, silakan hubungi saya.

Terima kasih!
