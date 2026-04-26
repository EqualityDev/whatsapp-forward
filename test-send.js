const { Client, LocalAuth } = require('whatsapp-web.js');
const { getWaPuppeteerOptions } = require('./waPuppeteer');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        ...getWaPuppeteerOptions()
    }
});

client.on('ready', async () => {
    console.log('Ready!');
    await client.sendMessage('120363424873992484@g.us', 'Halo! Ini test pesan dari bot WA Cellyn Store.');
    console.log('Pesan terkirim!');
});

client.initialize();
