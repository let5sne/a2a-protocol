import { E2EEncryption } from '../encryption';

describe('E2E Encryption', () => {
  let alice: E2EEncryption;
  let bob: E2EEncryption;

  beforeEach(() => {
    alice = new E2EEncryption();
    bob = new E2EEncryption();
  });

  it('should encrypt and decrypt messages', () => {
    const message = 'Hello, this is a secret!';
    
    const encrypted = alice.encrypt(message, bob.getPublicKey());
    const decrypted = bob.decrypt(encrypted, alice.getPublicKey());
    
    expect(decrypted).toBe(message);
  });

  it('should handle JSON data', () => {
    const data = { task: 'analyze', secret: 'confidential' };
    const message = JSON.stringify(data);
    
    const encrypted = alice.encrypt(message, bob.getPublicKey());
    const decrypted = bob.decrypt(encrypted, alice.getPublicKey());
    
    expect(JSON.parse(decrypted)).toEqual(data);
  });

  it('should fail with wrong key', () => {
    const charlie = new E2EEncryption();
    const message = 'Secret message';
    
    const encrypted = alice.encrypt(message, bob.getPublicKey());
    
    expect(() => {
      charlie.decrypt(encrypted, alice.getPublicKey());
    }).toThrow();
  });
});
