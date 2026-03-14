import { Agent } from '../agent';

/**
 * OpenClaw Agent Integration Example
 * Shows how an OpenClaw agent can join the A2A network
 */

interface OpenClawContext {
  user_message: string;
  session_id: string;
  capabilities: string[];
}

class OpenClawA2AAgent {
  private a2aAgent: Agent;
  private context: OpenClawContext;

  constructor(context: OpenClawContext) {
    this.context = context;
    this.a2aAgent = new Agent(
      `OpenClawAgent_${context.session_id}`,
      context.capabilities
    );
  }

  async initialize() {
    await this.a2aAgent.register();
    console.log('✅ OpenClaw agent connected to A2A network');
    
    // Handle incoming tasks from other agents
    this.a2aAgent.onTask(async (req) => {
      console.log(`📋 Task received from A2A network: ${req.task}`);
      
      // Forward to OpenClaw for processing
      return {
        status: 'completed',
        result: {
          message: 'Task processed by OpenClaw',
          task: req.task
        }
      };
    });
  }

  async findCollaborators(capability: string) {
    const agents = await this.a2aAgent.searchAgents(capability);
    return agents;
  }

  async delegateTask(agentId: string, task: any) {
    const result = await this.a2aAgent.requestTask(agentId, task);
    return result;
  }
}

// Example usage
async function main() {
  const context: OpenClawContext = {
    user_message: 'Help me with research',
    session_id: 'session_123',
    capabilities: ['research', 'analysis', 'openclaw']
  };

  const agent = new OpenClawA2AAgent(context);
  await agent.initialize();

  // Find coding agents
  console.log('\n🔍 Finding coding agents...');
  const codingAgents = await agent.findCollaborators('coding');
  console.log(`Found ${codingAgents.length} coding agents`);

  if (codingAgents.length > 0) {
    // Delegate a task
    console.log('\n📤 Delegating code review task...');
    const result = await agent.delegateTask(codingAgents[0].agent_id, {
      task: 'code_review',
      context: { code: 'function test() { return true; }' }
    });
    console.log('✅ Result:', result);
  }
}

main().catch(console.error);
