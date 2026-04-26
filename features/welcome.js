async function handleWelcome(client, notification, config) {
    if (!config || !Array.isArray(config.waGroupIds)) return;
    if (!config.waGroupIds.includes(notification.chatId)) return;
    if (notification.type !== 'add') return;

    const contact = await notification.getContact();
    const name = contact.pushname || contact.number;

    await client.sendMessage(notification.chatId,
        `Selamat datang, *${name}*!\n\n` +
        `Kamu baru saja bergabung dengan grup resmi *Cellyn Store*.\n` +
        `Di sini kamu bisa dapat info terbaru seputar promo, event, dan layanan kami.\n\n` +
        `Untuk order atau pertanyaan, langsung hubungi admin ya.`
    );
}

module.exports = { handleWelcome };
