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
    const chats = await client.getChats();
    const groups = chats.filter(c => c.isGroup);
    groups.forEach(g => console.log(`${g.name} — ${g.id._serialized}`));
});

client.initialize();
