import crypto from 'crypto';

let cachedKeyPair = null;

const normalizePem = value => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  return value.replace(/\\n/g, '\n').trim();
};

const loadKeyPair = () => {
  const envPublicKey = normalizePem(process.env.AUTH_LOGIN_PUBLIC_KEY);
  const envPrivateKey = normalizePem(process.env.AUTH_LOGIN_PRIVATE_KEY);

  if (envPublicKey && envPrivateKey) {
    return {
      publicKey: envPublicKey,
      privateKey: envPrivateKey,
      source: 'env',
    };
  }

  if (!cachedKeyPair) {
    const generated = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    cachedKeyPair = {
      ...generated,
      source: 'generated',
    };
  }

  return cachedKeyPair;
};

const getLoginPublicKey = () => {
  const { publicKey, source } = loadKeyPair();
  return { publicKey, source };
};

const decryptLoginPassword = encryptedPassword => {
  if (!encryptedPassword || typeof encryptedPassword !== 'string') {
    return null;
  }

  const { privateKey } = loadKeyPair();

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedPassword, 'base64')
  );

  return decrypted.toString('utf8');
};

export { getLoginPublicKey, decryptLoginPassword };