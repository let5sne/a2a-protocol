import { Agent } from '../agent';
import { E2EEncryption } from '../encryption';

/**
 * Secure Agent with End-to-End Encryption
 * All messages are encrypted before sending
 */

class SecureAgent extends Agent {
  private encryption: E2EEncryption;
  private peerPublicKeys: Map<string, string> = new Map();

  constructor(name: string, capabilities: string[]) {
    super(name, capabilities);
    this.encryption = new E2EEncryption();
  }

  getPublicKey(): string {
    return this.encryption.getPublicKey();
  }

  setPeerPublicKey(agentId: string, publicKey: string): void {
    this.peerPublicKeys.set(agentId, publicKey);
  }

  async sendSecureMessage(to: string, payload: any): Promise<void> {
    const peerPublicKey = this.peerPublicKeys.get(to);
    if (!peerPublicKey) {
      throw new Error(`No public key for agent ${to}`);
    }

    const plaintext = JSON.stringify(payload);
    const encrypted = this.encryption.encrypt(plaintext, peerPublicKey);

    await this.sendMessage(to, { encrypted: true, data: encrypted });
  }

  decryptMessage(from: string, encryptedData: string): any {
    const peerPublicKey = this.peerPublicKeys.get(from);
    if (!peerPublicKey) {
      throw new Error(`No public key for agent ${from}`);
    }

    const plaintext = this.encryption.decrypt(encryptedData, peerPublicKey);
    return JSON.parse(plaintext);
  }
}

// Example usage
async function main() {
  console.log('🔐 Secure Agent Example\n');

  const agentA = new SecureAgent('SecureAgentA', ['research']);
  const agentB = new SecureAgent('SecureAgentB', ['coding']);

  await agentA.register();
  await agentB.register();

  // Exchange public keys
  const pubKeyA = agentA.getPublicKey();
  const pubKeyB = agentB.getPublicKey();

  agentA.setPeerPublicKey(agentB.getProfile()!.agent_id, pubKeyB);
  agentB.setPeerPublicKey(agentA.getProfile()!.agent_id, pubKeyA);

  console.log('✅ Public keys exchanged\n');

  // Send encrypted message
  console.log('📤 Sending encrypted message...');
  await agentA.sendSecureMessage(agentB.getProfile()!.agent_id, {
    text: 'This is a secret message!',
    data: { sensitive: true }
  });

  console.log('✅ Message encrypted and sent');
}

main().catch(console.error);
