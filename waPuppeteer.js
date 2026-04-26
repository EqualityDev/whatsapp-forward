const fs = require('fs');

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function findDefaultChromiumPath() {
  const termuxChromiumBrowser = '/data/data/com.termux/files/usr/bin/chromium-browser';
  const termuxChromium = '/data/data/com.termux/files/usr/bin/chromium';
  try {
    if (fs.existsSync(termuxChromiumBrowser)) return termuxChromiumBrowser;
    if (fs.existsSync(termuxChromium)) return termuxChromium;
  } catch (_) {
    // ignore
  }
  return undefined;
}

function getWaPuppeteerOptions(env = process.env) {
  const executablePath = env.PUPPETEER_EXECUTABLE_PATH
    ? String(env.PUPPETEER_EXECUTABLE_PATH).trim()
    : findDefaultChromiumPath();

  const args = parseList(env.PUPPETEER_ARGS);
  return {
    ...(executablePath ? { executablePath } : {}),
    args: args.length ? args : ['--no-sandbox', '--disable-setuid-sandbox'],
  };
}

module.exports = { getWaPuppeteerOptions, parseList };
