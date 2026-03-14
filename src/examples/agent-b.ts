import { Agent } from '../agent';
import { TaskRequest, TaskResponse } from '../types';

async function main() {
  const agentB = new Agent('CodingAgent', ['coding', 'debugging']);
  
  await agentB.register();
  
  // Handle incoming messages
  agentB.onMessage((msg) => {
    console.log(`💬 Message from ${msg.from}:`, msg.payload);
    
    // Auto-reply
    agentB.sendMessage(msg.from, {
      text: 'Sure! I can help with that.'
    });
  });
  
  // Handle task requests
  agentB.onTask(async (req: TaskRequest): Promise<TaskResponse> => {
    console.log(`📋 Received task: ${req.task}`);
    
    if (req.task === 'code_review') {
      return {
        status: 'completed',
        result: {
          analysis: 'Code looks good! Simple and clean.',
          suggestions: ['Add type annotations', 'Consider error handling']
        }
      };
    }
    
    return {
      status: 'failed',
      error: 'Unknown task type'
    };
  });
  
  console.log('✅ Agent B ready and waiting for tasks...\n');
}

main().catch(console.error);
