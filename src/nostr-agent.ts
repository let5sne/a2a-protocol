import { SimplePool, Event, getPublicKey, getEventHash, finalizeEvent, generateSecretKey } from 'nostr-tools';
import { AgentProfile, Message, TaskRequest, TaskResponse } from './types';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band'
];

export class NostrAgent {
  private pool: SimplePool;
  private privateKey: Uint8Array;
  private publicKey: string;
  private profile: AgentProfile | null = null;
  private relays: string[];

  constructor(
    private name: string,
    private capabilities: string[],
    privateKey?: Uint8Array,
    relays?: string[]
  ) {
    this.pool = new SimplePool();
    this.privateKey = privateKey || generateSecretKey();
    this.publicKey = getPublicKey(this.privateKey);
    this.relays = relays || DEFAULT_RELAYS;
  }

  async register(): Promise<void> {
    const eventTemplate = {
      kind: 30078,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['d', 'agent_profile'],
        ['name', this.name],
        ...this.capabilities.map(c => ['capability', c])
      ],
      content: JSON.stringify({
        description: `A2A Agent: ${this.name}`
      })
    };

    const signedEvent = finalizeEvent(eventTemplate, this.privateKey);
    await this.pool.publish(this.relays, signedEvent);

    this.profile = {
      agent_id: this.publicKey,
      name: this.name,
      capabilities: this.capabilities,
      endpoint: `nostr:${this.publicKey}`,
      created_at: new Date().toISOString()
    };

    console.log(`✅ Registered to Nostr: ${this.name} (${this.publicKey.slice(0, 8)}...)`);
  }

  async searchAgents(capability: string): Promise<AgentProfile[]> {
    const events = await this.pool.querySync(this.relays, {
      kinds: [30078],
      '#capability': [capability],
      limit: 10
    });

    return events.map(event => {
      const name = event.tags.find(t => t[0] === 'name')?.[1] || 'Unknown';
      const capabilities = event.tags.filter(t => t[0] === 'capability').map(t => t[1]);
      
      return {
        agent_id: event.pubkey,
        name,
        capabilities,
        endpoint: `nostr:${event.pubkey}`,
        created_at: new Date(event.created_at * 1000).toISOString()
      };
    });
  }

  getProfile(): AgentProfile | null {
    return this.profile;
  }

  close(): void {
    this.pool.close(this.relays);
  }
}
