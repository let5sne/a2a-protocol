import { Agent } from '../agent';
import { AgentProfile } from '../types';

// Mock fetch
global.fetch = jest.fn();

describe('Agent', () => {
  let agent: Agent;
  
  beforeEach(() => {
    agent = new Agent('TestAgent', ['test_capability']);
    jest.clearAllMocks();
  });
  
  describe('searchAgents', () => {
    it('should search agents by capability', async () => {
      const mockAgents: AgentProfile[] = [
        {
          agent_id: 'agent_1',
          name: 'Agent1',
          capabilities: ['coding'],
          endpoint: 'ws://localhost:3000/agent/1',
          created_at: new Date().toISOString()
        }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockAgents
      });
      
      const result = await agent.searchAgents('coding');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/agents/search',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ capability: 'coding' })
        })
      );
      
      expect(result).toEqual(mockAgents);
    });
  });
  
  describe('getProfile', () => {
    it('should return null when not registered', () => {
      expect(agent.getProfile()).toBeNull();
    });
  });
});
