const util = require('util');

const LOG_OUTPUT = process.env.LOG_OUTPUT || (process.env.NODE_ENV === 'production' ? 'none' : 'text');

function formatMessage(level, msg, meta) {
  if (LOG_OUTPUT === 'none') return null;

  const timestamp = new Date().toISOString();

  if (LOG_OUTPUT === 'json') {
    const out = {
      timestamp,
      level,
      message: typeof msg === 'string' ? msg : util.inspect(msg),
      meta: meta || undefined
    };
    return JSON.stringify(out);
  }

  // text
  const metaStr = meta ? ` ${util.inspect(meta, { depth: 3 })}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${typeof msg === 'string' ? msg : util.inspect(msg)}${metaStr}`;
}

module.exports = {
  info: (msg, meta) => {
    const out = formatMessage('info', msg, meta);
    if (out) console.log(out);
  },
  warn: (msg, meta) => {
    const out = formatMessage('warn', msg, meta);
    if (out) console.warn(out);
  },
  error: (msg, meta) => {
    const out = formatMessage('error', msg, meta);
    if (out) console.error(out);
  }
};
