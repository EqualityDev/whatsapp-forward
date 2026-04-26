require('dotenv').config();
const { Client: WAClient, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Client: DCClient, GatewayIntentBits } = require('discord.js');
const { handleWelcome } = require('./features/welcome');
const { handleCommands } = require('./features/commands');
const { loadConfig } = require('./config');
const { splitText, formatForwardHeader } = require('./utils');

const config = loadConfig();

// ─── WhatsApp Client ───────────────────────────────────────────
const wa = new WAClient({
    authStrategy: new LocalAuth(),
    puppeteer: {
        ...(config.puppeteerExecutablePath ? { executablePath: config.puppeteerExecutablePath } : {}),
        args: config.puppeteerArgs
    }
});

wa.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code dengan WhatsApp!');
});

wa.on('ready', () => {
    console.log('WhatsApp Bot siap!');
});

wa.on('auth_failure', (msg) => {
    console.error('WhatsApp auth failure:', msg);
});

wa.on('disconnected', (reason) => {
    console.error('WhatsApp disconnected:', reason);
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

let forwardQueue = Promise.resolve();
function enqueueForward(task) {
    forwardQueue = forwardQueue.then(task).catch((e) => {
        console.error('Forward task error:', e);
    });
    return forwardQueue;
}

async function forwardTextToGroups(text) {
    const chunks = splitText(text, config.maxTextChunkLen);
    for (const groupId of config.waGroupIds) {
        for (const chunk of chunks) {
            await wa.sendMessage(groupId, chunk);
        }
    }
}

async function forwardTextToGroup(groupId, text) {
    const chunks = splitText(text, config.maxTextChunkLen);
    for (const chunk of chunks) {
        await wa.sendMessage(groupId, chunk);
    }
}

async function forwardAttachmentToGroups(attachment, captionBase) {
    let media;
    try {
        media = await MessageMedia.fromUrl(attachment.url);
    } catch (e) {
        for (const groupId of config.waGroupIds) {
            await forwardTextToGroup(groupId, `${captionBase}\n\n📎 ${attachment.url}`);
        }
        console.error('Gagal ambil attachment dari URL, fallback ke URL:', e);
        return;
    }

    for (const groupId of config.waGroupIds) {
        try {
            const caption = attachment.name ? `${captionBase}\n\n📎 ${attachment.name}` : captionBase;
            await wa.sendMessage(groupId, media, { caption });
        } catch (e) {
            await forwardTextToGroup(groupId, `${captionBase}\n\n📎 ${attachment.url}`);
            console.error('Gagal kirim attachment ke WA, fallback ke URL:', e);
        }
    }
}

dc.on('messageCreate', async (message) => {
    if (!config.forwardChannelIds.includes(message.channel.id)) return;
    if (message.author.bot) return;

    enqueueForward(async () => {
        const header = formatForwardHeader(message.author.username);
        const body = (message.cleanContent || message.content || '').trim();
        const hasBody = body.length > 0;
        const baseText = hasBody ? `${header}\n${body}` : header;
        const withLink = config.forwardDiscordMessageLink ? `${baseText}\n\n${message.url}` : baseText;

        try {
            if (message.attachments.size === 0) {
                await forwardTextToGroups(withLink);
                console.log('Pesan di-forward ke WA!');
                return;
            }

            // Jika ada attachment: kirim teks + media (jika bisa), fallback ke URL.
            await forwardTextToGroups(withLink);
            for (const attachment of message.attachments.values()) {
                await forwardAttachmentToGroups(attachment, header);
            }
            console.log('Pesan + attachment di-forward ke WA!');
        } catch (e) {
            console.error('Gagal forward ke WA:', e);
        }
    });
});

wa.on('group_join', (notification) => handleWelcome(wa, notification, config));
wa.on('message', (message) => handleCommands(wa, message, config));

dc.login(config.discordToken);
