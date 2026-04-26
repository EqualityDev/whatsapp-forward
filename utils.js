function splitText(text, maxLen) {
  const normalized = String(text || '');
  if (!normalized) return [];
  if (normalized.length <= maxLen) return [normalized];

  const chunks = [];
  let remaining = normalized;

  while (remaining.length > maxLen) {
    const window = remaining.slice(0, maxLen + 1);
    let cut = window.lastIndexOf('\n');
    if (cut < Math.floor(maxLen * 0.6)) cut = window.lastIndexOf(' ');
    if (cut < Math.floor(maxLen * 0.6)) cut = maxLen;

    chunks.push(remaining.slice(0, cut).trimEnd());
    remaining = remaining.slice(cut).trimStart();
  }

  if (remaining.length) chunks.push(remaining);
  return chunks;
}

function formatForwardHeader(authorUsername) {
  const name = authorUsername ? String(authorUsername) : 'Discord';
  return `📢 *${name}*`;
}

module.exports = { splitText, formatForwardHeader };

