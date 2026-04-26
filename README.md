# WhatsApp Forward Bot — Cellyn Store

Bot WhatsApp untuk meneruskan pengumuman dari channel Discord ke grup WhatsApp Cellyn Store secara otomatis.

---

## Fitur

- Forward otomatis pesan dari channel Discord ke grup WhatsApp
- Pesan sambutan otomatis untuk member baru yang bergabung ke grup
- Command !order untuk info cara order di grup WhatsApp
- Auto-restart jika bot mati via start.sh
- Sesi WhatsApp tersimpan lokal, tidak perlu scan QR ulang setiap restart

---

## Konfigurasi .env

    DISCORD_TOKEN=token_bot_discord
    WA_GROUP_ID=id_grup_whatsapp@g.us
    FORWARD_CHANNEL_ID=id_channel_discord_yang_di_forward

    # (Opsional) bisa pakai list dipisah koma untuk multi target
    # WA_GROUP_ID=id1@g.us,id2@g.us
    # FORWARD_CHANNEL_ID=channel1,channel2

    # (Opsional) untuk Termux / custom chromium
    # PUPPETEER_EXECUTABLE_PATH=/data/data/com.termux/files/usr/bin/chromium-browser
    # PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox

    # (Opsional)
    # FORWARD_DISCORD_MESSAGE_LINK=1   # 0 untuk matikan link message Discord
    # MAX_TEXT_CHUNK_LEN=3500          # auto split jika pesan panjang
    # ORDER_COMMAND=!order             # ubah command order

---

## Cara Install

    git clone https://github.com/EqualityDev/whatsapp-forward.git
    cd whatsapp-forward
    npm install --ignore-scripts
    pkg install x11-repo -y && pkg install chromium -y
    cp .env.example .env
    nano .env
    npm start
    # Scan QR dengan WhatsApp di nomor bot
    bash start.sh

---

## List Command WA

    !order      Menampilkan cara order di Cellyn Store

---

## Catatan Penting

- Jangan hapus folder .wwebjs_auth/ karena berisi sesi login WhatsApp.
- Nomor WhatsApp yang digunakan sebagai bot tidak bisa digunakan di HP lain bersamaan.
- Jangan membagikan file .env ke siapapun.
- Bot menggunakan whatsapp-web.js yang bukan API resmi WhatsApp, gunakan secara wajar.
- Attachment Discord akan dicoba dikirim sebagai media ke WA; jika gagal akan fallback mengirim URL attachment.
