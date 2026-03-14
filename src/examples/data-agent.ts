import { Agent } from '../agent';
import { TaskRequest, TaskResponse } from '../types';

/**
 * Data Analysis Agent
 * Capabilities: data processing, statistical analysis, visualization
 */
async function main() {
  const dataAgent = new Agent('DataAnalysisAgent', [
    'data_processing',
    'statistical_analysis',
    'data_visualization'
  ]);
  
  await dataAgent.register();
  console.log('📈 Data Analysis Agent ready\n');
  
  dataAgent.onMessage((msg) => {
    console.log(`💬 Message from ${msg.from}:`, msg.payload);
  });
  
  dataAgent.onTask(async (req: TaskRequest): Promise<TaskResponse> => {
    console.log(`📋 Task received: ${req.task}`);
    
    switch (req.task) {
      case 'data_processing':
        return {
          status: 'completed',
          result: {
            rows_processed: 10000,
            clean_data_percentage: 95,
            outliers_removed: 50
          }
        };
      
      case 'statistical_analysis':
        return {
          status: 'completed',
          result: {
            mean: 42.5,
            median: 40,
            std_dev: 12.3,
            correlation: 0.85
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
