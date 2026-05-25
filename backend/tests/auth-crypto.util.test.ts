const crypto = require('crypto');

describe('auth-crypto util', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.AUTH_LOGIN_PUBLIC_KEY;
    delete process.env.AUTH_LOGIN_PRIVATE_KEY;
  });

  it('returns env-sourced public key when env keys exist', () => {
    process.env.AUTH_LOGIN_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\\nabc\\n-----END PUBLIC KEY-----';
    process.env.AUTH_LOGIN_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nxyz\\n-----END PRIVATE KEY-----';

    const { getLoginPublicKey } = require('../utils/auth-crypto');
    const result = getLoginPublicKey();

    expect(result.source).toBe('env');
    expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
  });

  it('generates key pair when env keys are absent', () => {
    const { getLoginPublicKey } = require('../utils/auth-crypto');
    const result = getLoginPublicKey();

    expect(result.source).toBe('generated');
    expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
  });

  it('decrypts encrypted password using env private key', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    process.env.AUTH_LOGIN_PUBLIC_KEY = publicKey;
    process.env.AUTH_LOGIN_PRIVATE_KEY = privateKey;

    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from('admin1234', 'utf8')
    );

    const { decryptLoginPassword } = require('../utils/auth-crypto');
    const decrypted = decryptLoginPassword(encrypted.toString('base64'));

    expect(decrypted).toBe('admin1234');
  });

  it('returns null for empty encrypted password input', () => {
    const { decryptLoginPassword } = require('../utils/auth-crypto');
    expect(decryptLoginPassword('')).toBeNull();
  });
});
