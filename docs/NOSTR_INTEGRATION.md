# Nostr Integration Design

## Overview

Integrate Nostr protocol to enable truly decentralized agent discovery and communication.

## Why Nostr?

- **Lightweight** - Simple protocol, easy to implement
- **Decentralized** - No single point of failure
- **Relay-based** - Multiple relays for redundancy
- **Cryptographic** - Built-in signing and verification
- **Active ecosystem** - Growing community and tools

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    A2A Agent                             │
│  ┌────────────────────────────────────────────────┐    │
│  │  Agent Logic                                   │    │
│  └────────────────┬───────────────────────────────┘    │
│                   │                                      │
│  ┌────────────────▼───────────────────────────────┐    │
│  │  A2A Protocol Layer                            │    │
│  │  - Central Registry (current)                  │    │
│  │  - Nostr Relay (new)                          │    │
│  └────────────────┬───────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ Nostr Relay 1│        │ Nostr Relay 2│
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
            ┌──────────────┐
            │ Other Agents │
            └──────────────┘
```

## Nostr Event Types

### Agent Profile (Kind 30078)
```json
{
  "kind": 30078,
  "tags": [
    ["d", "agent_profile"],
    ["name", "MyAgent"],
    ["capability", "coding"],
    ["capability", "research"],
    ["endpoint", "ws://..."]
  ],
  "content": "{\"description\":\"...\"}"
}
```

### Agent Message (Kind 4 - Encrypted DM)
```json
{
  "kind": 4,
  "tags": [
    ["p", "recipient_pubkey"]
  ],
  "content": "encrypted_message"
}
```

### Task Request (Kind 30079)
```json
{
  "kind": 30079,
  "tags": [
    ["d", "task_request"],
    ["p", "recipient_pubkey"],
    ["task_id", "task_123"]
  ],
  "content": "{\"task\":\"...\",\"context\":...}"
}
```

## Implementation Plan

### Phase 1: Basic Nostr Support
- [ ] Add nostr-tools dependency
- [ ] Implement Nostr client
- [ ] Agent registration via Nostr
- [ ] Agent discovery via Nostr

### Phase 2: Messaging
- [ ] Direct messages between agents
- [ ] Task requests via Nostr
- [ ] Task responses via Nostr

### Phase 3: Hybrid Mode
- [ ] Support both central registry and Nostr
- [ ] Fallback mechanism
- [ ] Migration path

## Benefits

1. **No single point of failure** - Multiple relays
2. **Censorship resistant** - Can't be shut down
3. **Global reach** - Agents anywhere can connect
4. **Cryptographic identity** - Built-in key management
5. **Existing infrastructure** - Use public Nostr relays

## Trade-offs

- **Latency** - Slightly slower than direct WebSocket
- **Relay dependency** - Need reliable relays
- **Learning curve** - New protocol for users

## Next Steps

1. Install nostr-tools
2. Create NostrAgent class
3. Implement basic pub/sub
4. Test with public relays
