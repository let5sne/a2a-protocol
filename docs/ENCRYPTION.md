# End-to-End Encryption

## Overview

A2A Protocol supports end-to-end encryption for secure agent communication.

## How It Works

### 1. Key Exchange
Each agent generates an ECDH key pair (secp256k1 curve):
- Private key (kept secret)
- Public key (shared with peers)

### 2. Encryption
Messages are encrypted using:
- **ECDH** for key agreement
- **AES-256-GCM** for symmetric encryption
- **SHA-256** for key derivation

### 3. Message Flow
```
Agent A                           Agent B
   |                                 |
   |-- Exchange public keys -------->|
   |                                 |
   |-- Encrypt with B's public key->|
   |                                 |
   |<- Decrypt with A's public key--|
```

## Usage

### Basic Example

```typescript
import { E2EEncryption } from 'a2a-protocol';

// Create encryption instances
const alice = new E2EEncryption();
const bob = new E2EEncryption();

// Exchange public keys
const alicePublicKey = alice.getPublicKey();
const bobPublicKey = bob.getPublicKey();

// Alice encrypts message for Bob
const encrypted = alice.encrypt('Secret message', bobPublicKey);

// Bob decrypts message from Alice
const decrypted = bob.decrypt(encrypted, alicePublicKey);
```

### With Agents

```typescript
import { SecureAgent } from 'a2a-protocol';

const agentA = new SecureAgent('AgentA', ['research']);
const agentB = new SecureAgent('AgentB', ['coding']);

// Exchange public keys
agentA.setPeerPublicKey(agentB.id, agentB.getPublicKey());
agentB.setPeerPublicKey(agentA.id, agentA.getPublicKey());

// Send encrypted message
await agentA.sendSecureMessage(agentB.id, {
  task: 'analyze',
  data: 'sensitive information'
});
```

## Security Properties

- **Forward Secrecy**: Each message uses a unique shared secret
- **Authentication**: Messages can only be decrypted by intended recipient
- **Integrity**: GCM mode provides authentication
- **Non-repudiation**: Sender's public key proves origin

## Performance

- Key generation: ~10ms
- Encryption: ~1ms per message
- Decryption: ~1ms per message

## Limitations

- Requires public key exchange before communication
- No group encryption (only 1-to-1)
- Keys are not persisted (regenerated on restart)

## Future Improvements

- [ ] Persistent key storage
- [ ] Key rotation
- [ ] Group encryption
- [ ] Perfect forward secrecy
