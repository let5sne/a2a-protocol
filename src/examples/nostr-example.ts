import { NostrAgent } from '../nostr-agent';

/**
 * Nostr Integration Example
 * Demonstrates decentralized agent discovery via Nostr protocol
 */

async function main() {
  console.log('🌐 Starting Nostr Agent Example\n');

  // Create agent with Nostr
  const agent = new NostrAgent('NostrTestAgent', ['research', 'analysis']);
  
  console.log('📝 Registering to Nostr relays...');
  await agent.register();
  
  const profile = agent.getProfile();
  console.log('\n✅ Agent Profile:');
  console.log(`   Name: ${profile?.name}`);
  console.log(`   ID: ${profile?.agent_id.slice(0, 16)}...`);
  console.log(`   Capabilities: ${profile?.capabilities.join(', ')}`);
  
  // Wait a bit for event propagation
  console.log('\n⏳ Waiting for event propagation...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Search for agents
  console.log('\n🔍 Searching for research agents...');
  const agents = await agent.searchAgents('research');
  
  console.log(`\n✅ Found ${agents.length} agent(s):`);
  agents.forEach(a => {
    console.log(`   - ${a.name} (${a.agent_id.slice(0, 16)}...)`);
    console.log(`     Capabilities: ${a.capabilities.join(', ')}`);
  });
  
  // Cleanup
  agent.close();
  console.log('\n✅ Done!');
}

main().catch(console.error);
