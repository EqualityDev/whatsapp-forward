const WA_GROUP_ID = process.env.WA_GROUP_ID;

async function handleCommands(client, message) {
    if (message.from !== WA_GROUP_ID) return;
    if (message.fromMe) return;

    const body = message.body.trim().toLowerCase();

    if (body === '!order') {
        await message.reply(
            'Cara order di *Cellyn Store*:\n\n' +
            '1. Tag atau hubungi admin di grup ini\n' +
            '2. Sebutkan produk/item yang ingin dibeli\n' +
            '3. Admin akan mengecek ketersediaan dan memberikan info lebih lanjut'
        );
    }
}

module.exports = { handleCommands };
