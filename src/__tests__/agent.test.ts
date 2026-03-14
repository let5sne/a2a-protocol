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
  
  describe('register', () => {
    it('should register agent successfully', async () => {
      const mockProfile: AgentProfile = {
        agent_id: 'agent_test123',
        name: 'TestAgent',
        capabilities: ['test_capability'],
        endpoint: 'ws://localhost:3000/agent/test123',
        created_at: new Date().toISOString()
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockProfile
      });
      
      // Mock WebSocket
      const mockWs = {
        on: jest.fn(),
        send: jest.fn()
      };
      
      jest.spyOn(require('ws'), 'default').mockImplementation(() => mockWs);
      
      await agent.register();
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/agents/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
      
      expect(agent.getProfile()).toEqual(mockProfile);
    });
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
});
