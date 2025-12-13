#!/usr/bin/env node
/**
 * Server-only refresher for SPLP token.
 * Run as a separate PM2/cron process; writes token to a private file, never to public assets.
 */

const fs = require('fs');
const path = require('path');

// Load environment (works with .env, .env.production, or injected env)
require('dotenv').config({ path: process.env.ENV_FILE || '.env' });

const TOKEN_URL = process.env.URL_TOKEN_SPLP;
const USERNAME = process.env.USERNAME_SPLP;
const PASSWORD = process.env.PASSWORD_SPLP;
const GRANT_TYPE = process.env.GRANT_TYPE_SPLP || 'password';
const AUTH = process.env.AUTH_SPLP;
const DATA_DIR = process.env.SPLP_TOKEN_DIR || path.join(process.cwd(), '.data');
const TOKEN_FILE =
  process.env.SPLP_TOKEN_FILE || path.join(DATA_DIR, 'splp-token.json');
const REFRESH_INTERVAL_MS = Number(process.env.SPLP_REFRESH_MS || 5 * 60 * 1000);
const EXPIRY_BUFFER_MS = Number(process.env.SPLP_EXPIRY_BUFFER_MS || 60 * 1000);

const ensureDir = () => fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });

const saveTokenToFile = (tokenData) => {
  ensureDir();
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
  console.log(`[splp-token] saved at ${new Date().toISOString()}`);
};

const readTokenFile = () => {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  } catch (err) {
    console.error('[splp-token] failed to parse token file:', err.message);
    return null;
  }
};

const postToken = async (body) => {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`token request failed: ${res.status} ${text}`);
  }
  return res.json();
};

const fetchNewToken = async () => {
  const data = await postToken({
    username: USERNAME,
    password: PASSWORD,
    grant_type: GRANT_TYPE,
  });

  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    created_at: new Date().toISOString(),
  };
  saveTokenToFile(tokenData);
};

const refreshAccessToken = async (refreshToken) => {
  const data = await postToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    created_at: new Date().toISOString(),
  };
  saveTokenToFile(tokenData);
};

const checkAndUpdateToken = async () => {
  const tokenData = readTokenFile();
  if (!tokenData) {
    await fetchNewToken();
    return;
  }

  const createdAt = new Date(tokenData.created_at).getTime();
  const expiresInMs = Number(tokenData.expires_in || 0) * 1000;
  const refreshAt = createdAt + expiresInMs - EXPIRY_BUFFER_MS;
  const now = Date.now();

  if (!createdAt || !expiresInMs || Number.isNaN(refreshAt) || now >= refreshAt) {
    try {
      if (tokenData.refresh_token) {
        await refreshAccessToken(tokenData.refresh_token);
        return;
      }
    } catch (err) {
      console.error('[splp-token] refresh failed, fallback to new token:', err.message);
    }
    await fetchNewToken();
  } else {
    console.log('[splp-token] token still valid');
  }
};

const validateEnv = () => {
  const missing = [];
  if (!TOKEN_URL) missing.push('URL_TOKEN_SPLP');
  if (!AUTH) missing.push('AUTH_SPLP');
  if (!USERNAME) missing.push('USERNAME_SPLP');
  if (!PASSWORD) missing.push('PASSWORD_SPLP');
  if (missing.length) {
    console.error(`[splp-token] missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const main = async () => {
  validateEnv();
  await checkAndUpdateToken();

  if (process.env.ONE_SHOT === '1') {
    return;
  }

  setInterval(() => {
    checkAndUpdateToken().catch((err) =>
      console.error('[splp-token] error:', err.message)
    );
  }, REFRESH_INTERVAL_MS);
};

main().catch((err) => {
  console.error('[splp-token] fatal:', err.message);
  process.exit(1);
});
