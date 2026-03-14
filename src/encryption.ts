import crypto from 'crypto';

/**
 * End-to-End Encryption for Agent Communication
 * Uses ECDH for key exchange and AES-256-GCM for encryption
 */

export class E2EEncryption {
  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1'
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getPublicKey(): string {
    return this.publicKey.export({ type: 'spki', format: 'pem' }) as string;
  }

  /**
   * Encrypt message for recipient
   */
  encrypt(message: string, recipientPublicKey: string): string {
    // Derive shared secret using ECDH
    const recipientKey = crypto.createPublicKey(recipientPublicKey);
    const sharedSecret = crypto.diffieHellman({
      privateKey: this.privateKey,
      publicKey: recipientKey
    });

    // Derive encryption key from shared secret
    const key = crypto.createHash('sha256').update(sharedSecret).digest();
    
    // Generate IV
    const iv = crypto.randomBytes(12);
    
    // Encrypt with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return: iv + authTag + encrypted
    return iv.toString('hex') + authTag.toString('hex') + encrypted;
  }

  /**
   * Decrypt message from sender
   */
  decrypt(encryptedMessage: string, senderPublicKey: string): string {
    // Parse encrypted message
    const iv = Buffer.from(encryptedMessage.slice(0, 24), 'hex');
    const authTag = Buffer.from(encryptedMessage.slice(24, 56), 'hex');
    const encrypted = encryptedMessage.slice(56);
    
    // Derive shared secret
    const senderKey = crypto.createPublicKey(senderPublicKey);
    const sharedSecret = crypto.diffieHellman({
      privateKey: this.privateKey,
      publicKey: senderKey
    });
    
    // Derive decryption key
    const key = crypto.createHash('sha256').update(sharedSecret).digest();
    
    // Decrypt
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
