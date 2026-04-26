async function handleCommands(client, message, config) {
    if (!config || !Array.isArray(config.waGroupIds)) return;
    if (!config.waGroupIds.includes(message.from)) return;
    if (message.fromMe) return;

    const body = message.body.trim().toLowerCase();

    if (body === (config.orderCommand || '!order')) {
        await message.reply(
            'Cara order di *Cellyn Store*:\n\n' +
            '1. Tag atau hubungi admin di grup ini\n' +
            '2. Sebutkan produk/item yang ingin dibeli\n' +
            '3. Admin akan mengecek ketersediaan dan memberikan info lebih lanjut'
        );
    }
}

module.exports = { handleCommands };
