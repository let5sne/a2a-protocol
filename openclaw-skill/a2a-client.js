#!/usr/bin/env node

/**
 * A2A Network Client for OpenClaw
 * Connects OpenClaw agents to the A2A network
 */

const A2A_REGISTRY_URL = process.env.A2A_REGISTRY_URL || 'http://localhost:3000';

class A2AClient {
  constructor() {
    this.profile = null;
    this.ws = null;
  }

  async register(name, capabilities) {
    const response = await fetch(`${A2A_REGISTRY_URL}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, capabilities })
    });
    
    this.profile = await response.json();
    console.log(JSON.stringify({
      success: true,
      agent_id: this.profile.agent_id,
      name: this.profile.name,
      capabilities: this.profile.capabilities
    }));
  }

  async discover(capability) {
    const response = await fetch(`${A2A_REGISTRY_URL}/agents/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capability })
    });
    
    const agents = await response.json();
    console.log(JSON.stringify({ success: true, agents }));
  }

  async status() {
    if (!this.profile) {
      console.log(JSON.stringify({ 
        success: false, 
        error: 'Not registered to A2A network' 
      }));
      return;
    }
    
    console.log(JSON.stringify({
      success: true,
      status: 'connected',
      profile: this.profile
    }));
  }
}

// CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);

const client = new A2AClient();

(async () => {
  try {
    switch (command) {
      case 'register':
        await client.register(args[0], args.slice(1));
        break;
      case 'discover':
        await client.discover(args[0]);
        break;
      case 'status':
        await client.status();
        break;
      default:
        console.log(JSON.stringify({
          success: false,
          error: `Unknown command: ${command}`
        }));
    }
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
})();
