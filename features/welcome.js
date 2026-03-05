const WA_GROUP_ID = process.env.WA_GROUP_ID;

async function handleWelcome(client, notification) {
    if (notification.chatId !== WA_GROUP_ID) return;
    if (notification.type !== 'add') return;

    const contact = await notification.getContact();
    const name = contact.pushname || contact.number;

    await client.sendMessage(WA_GROUP_ID,
        `Selamat datang, *${name}*!\n\n` +
        `Kamu baru saja bergabung dengan grup resmi *Cellyn Store*.\n` +
        `Di sini kamu bisa dapat info terbaru seputar promo, event, dan layanan kami.\n\n` +
        `Untuk order atau pertanyaan, langsung hubungi admin ya.`
    );
}

module.exports = { handleWelcome };
