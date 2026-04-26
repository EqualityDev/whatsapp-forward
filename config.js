const { getWaPuppeteerOptions, parseList } = require('./waPuppeteer');

function required(env, name) {
  const value = env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return String(value).trim();
}

function optional(env, name, fallback = undefined) {
  const value = env[name];
  if (value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
}

function loadConfig(env = process.env) {
  const waGroupIds = parseList(env.WA_GROUP_ID);
  const forwardChannelIds = parseList(env.FORWARD_CHANNEL_ID);
  const waPuppeteer = getWaPuppeteerOptions(env);
  const pairingPhoneNumber = optional(env, 'WA_PAIRING_PHONE', '').replace(/[^\d]/g, '');
  const pairingEnabled = Boolean(pairingPhoneNumber);

  const config = {
    discordToken: required(env, 'DISCORD_TOKEN'),
    waGroupIds,
    forwardChannelIds,
    puppeteerExecutablePath: waPuppeteer.executablePath,
    puppeteerArgs: waPuppeteer.args,
    pairingPhoneNumber: pairingEnabled ? pairingPhoneNumber : undefined,
    pairingShowNotification: optional(env, 'WA_PAIRING_SHOW_NOTIFICATION', '1') !== '0',
    pairingIntervalMs: Number(optional(env, 'WA_PAIRING_INTERVAL_MS', '180000')),
    forwardDiscordMessageLink: optional(env, 'FORWARD_DISCORD_MESSAGE_LINK', '1') !== '0',
    maxTextChunkLen: Number(optional(env, 'MAX_TEXT_CHUNK_LEN', '3500')),
    orderCommand: optional(env, 'ORDER_COMMAND', '!order').toLowerCase(),
  };

  if (config.waGroupIds.length === 0) {
    throw new Error('Missing required env var: WA_GROUP_ID (comma-separated group ids allowed)');
  }
  if (config.forwardChannelIds.length === 0) {
    throw new Error('Missing required env var: FORWARD_CHANNEL_ID (comma-separated channel ids allowed)');
  }
  if (!Number.isFinite(config.maxTextChunkLen) || config.maxTextChunkLen < 500) {
    throw new Error('Invalid MAX_TEXT_CHUNK_LEN (must be a number >= 500)');
  }
  if (config.pairingPhoneNumber && config.pairingPhoneNumber.length < 8) {
    throw new Error('Invalid WA_PAIRING_PHONE (use international digits only, e.g. 62812xxxx)');
  }
  if (!Number.isFinite(config.pairingIntervalMs) || config.pairingIntervalMs < 60000) {
    throw new Error('Invalid WA_PAIRING_INTERVAL_MS (must be a number >= 60000)');
  }

  return config;
}

module.exports = { loadConfig };
