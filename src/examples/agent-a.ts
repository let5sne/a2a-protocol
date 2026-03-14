import { Agent } from '../agent';

async function main() {
  const agentA = new Agent('ResearchAgent', ['research', 'analysis']);
  
  await agentA.register();
  
  // Handle incoming messages
  agentA.onMessage((msg) => {
    console.log(`💬 Message from ${msg.from}:`, msg.payload);
  });
  
  // Wait a bit for other agents to register
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Search for agents with 'coding' capability
  console.log('\n🔍 Searching for coding agents...');
  const codingAgents = await agentA.searchAgents('coding');
  
  if (codingAgents.length > 0) {
    const targetAgent = codingAgents[0];
    console.log(`✅ Found: ${targetAgent.name} (${targetAgent.agent_id})\n`);
    
    // Send a message
    await agentA.sendMessage(targetAgent.agent_id, {
      text: 'Hello! Can you help me analyze some code?'
    });
    
    // Request a task
    console.log('\n📋 Requesting task...');
    const result = await agentA.requestTask(targetAgent.agent_id, {
      task: 'code_review',
      context: { code: 'function hello() { return "world"; }' }
    });
    
    console.log('✅ Task result:', result);
  } else {
    console.log('❌ No coding agents found. Start agent-b first!');
  }
}

main().catch(console.error);
