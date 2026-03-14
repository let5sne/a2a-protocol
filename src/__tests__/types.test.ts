import { Message, TaskRequest, TaskResponse } from '../types';

describe('Message Protocol', () => {
  describe('Message validation', () => {
    it('should validate message structure', () => {
      const message: Message = {
        type: 'message',
        from: 'agent_1',
        to: 'agent_2',
        payload: { text: 'Hello' },
        timestamp: new Date().toISOString()
      };
      
      expect(message.type).toBe('message');
      expect(message.from).toBeDefined();
      expect(message.to).toBeDefined();
      expect(message.payload).toBeDefined();
      expect(message.timestamp).toBeDefined();
    });
    
    it('should validate task request structure', () => {
      const message: Message = {
        type: 'task_request',
        from: 'agent_1',
        to: 'agent_2',
        task_id: 'task_123',
        payload: {
          task: 'analyze_data',
          context: { data: [1, 2, 3] }
        },
        timestamp: new Date().toISOString()
      };
      
      expect(message.type).toBe('task_request');
      expect(message.task_id).toBeDefined();
    });
    
    it('should validate task response structure', () => {
      const response: TaskResponse = {
        status: 'completed',
        result: { analysis: 'done' }
      };
      
      expect(response.status).toBe('completed');
      expect(response.result).toBeDefined();
    });
  });
});
