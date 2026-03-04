require('dotenv').config();
const { Client: WAClient, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Client: DCClient, GatewayIntentBits } = require('discord.js');

const WA_GROUP_ID = process.env.WA_GROUP_ID;
const FORWARD_CHANNEL_ID = process.env.FORWARD_CHANNEL_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// ─── WhatsApp Client ───────────────────────────────────────────
const wa = new WAClient({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

wa.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code dengan WhatsApp!');
});

wa.on('ready', () => {
    console.log('WhatsApp Bot siap!');
});

wa.initialize();

// ─── Discord Client ────────────────────────────────────────────
const dc = new DCClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

dc.on('ready', () => {
    console.log(`Discord Bot siap: ${dc.user.tag}`);
});

dc.on('messageCreate', async (message) => {
    if (message.channel.id !== FORWARD_CHANNEL_ID) return;
    if (message.author.bot) return;

    let text = `📢 *${message.author.username}*\n${message.content}`;

    // Jika ada attachment/gambar
    if (message.attachments.size > 0) {
        text += '\n\n_(Pesan ini mengandung lampiran, lihat di Discord)_';
    }

    try {
        await wa.sendMessage(WA_GROUP_ID, text);
        console.log('Pesan di-forward ke WA!');
    } catch (e) {
        console.error('Gagal forward ke WA:', e);
    }
});

dc.login(DISCORD_TOKEN);
