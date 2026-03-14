import { Agent } from '../agent';
import { TaskRequest, TaskResponse } from '../types';

/**
 * Market Analysis Agent
 * Capabilities: market research, competitor analysis, trend analysis
 */
async function main() {
  const marketAgent = new Agent('MarketAnalysisAgent', [
    'market_research',
    'competitor_analysis',
    'trend_analysis'
  ]);
  
  await marketAgent.register();
  console.log('📊 Market Analysis Agent ready\n');
  
  // Handle incoming messages
  marketAgent.onMessage((msg) => {
    console.log(`💬 Message from ${msg.from}:`, msg.payload);
  });
  
  // Handle task requests
  marketAgent.onTask(async (req: TaskRequest): Promise<TaskResponse> => {
    console.log(`📋 Task received: ${req.task}`);
    
    switch (req.task) {
      case 'market_research':
        return {
          status: 'completed',
          result: {
            market_size: '$10B',
            growth_rate: '15% YoY',
            key_players: ['Company A', 'Company B', 'Company C'],
            trends: ['AI adoption', 'Cloud migration', 'Remote work']
          }
        };
      
      case 'competitor_analysis':
        return {
          status: 'completed',
          result: {
            competitors: [
              { name: 'Competitor A', strength: 'Brand', weakness: 'Price' },
              { name: 'Competitor B', strength: 'Tech', weakness: 'Support' }
            ],
            opportunities: ['Underserved segment', 'New geography']
          }
        };
      
      default:
        return {
          status: 'failed',
          error: `Unknown task: ${req.task}`
        };
    }
  });
}

main().catch(console.error);
