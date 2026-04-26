require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getWaPuppeteerOptions } = require('./waPuppeteer');

const pairingPhone = (process.env.WA_PAIRING_PHONE || '').replace(/[^\d]/g, '');
const pairingEnabled = Boolean(pairingPhone);

const client = new Client({
    authStrategy: new LocalAuth(),
    ...(pairingEnabled
        ? {
            pairWithPhoneNumber: {
                phoneNumber: pairingPhone,
                showNotification: (process.env.WA_PAIRING_SHOW_NOTIFICATION || '1') !== '0',
                intervalMs: Number(process.env.WA_PAIRING_INTERVAL_MS || '180000')
            }
        }
        : {}),
    puppeteer: {
        ...getWaPuppeteerOptions()
    }
});

client.on('qr', (qr) => {
    if (pairingEnabled) {
        console.log('Pairing code mode aktif, QR di-skip.');
        return;
    }
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code dengan WhatsApp!');
});

client.on('code', (code) => {
    console.log('');
    console.log('=== WhatsApp Pairing Code ===');
    console.log(code);
    console.log('Buka WhatsApp di HP → Perangkat tertaut (Linked devices) → Tautkan perangkat → "Tautkan dengan nomor telepon", lalu masukkan kode di atas.');
    console.log('');
});

client.on('ready', async () => {
    console.log('Ready!');
    const chats = await client.getChats();
    const groups = chats.filter(c => c.isGroup);
    groups.forEach(g => console.log(`${g.name} — ${g.id._serialized}`));
});

client.initialize();
