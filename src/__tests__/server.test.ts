import request from 'supertest';
import express from 'express';

// Mock server setup (simplified version for testing)
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  const agents = new Map();
  
  app.post('/agents/register', (req, res) => {
    const { name, capabilities } = req.body;
    const agent_id = `agent_test_${Date.now()}`;
    
    const profile = {
      agent_id,
      name,
      capabilities: capabilities || [],
      endpoint: `ws://localhost:3000/agent/${agent_id}`,
      created_at: new Date().toISOString()
    };
    
    agents.set(agent_id, profile);
    res.json(profile);
  });
  
  app.get('/agents', (req, res) => {
    res.json(Array.from(agents.values()));
  });
  
  app.get('/agents/:id', (req, res) => {
    const agent = agents.get(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  });
  
  app.post('/agents/search', (req, res) => {
    const { capability } = req.body;
    const results = Array.from(agents.values()).filter(agent =>
      agent.capabilities.includes(capability)
    );
    res.json(results);
  });
  
  return app;
};

describe('Registry Server API', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('POST /agents/register', () => {
    it('should register a new agent', async () => {
      const response = await request(app)
        .post('/agents/register')
        .send({
          name: 'TestAgent',
          capabilities: ['test']
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'TestAgent',
        capabilities: ['test']
      });
      expect(response.body.agent_id).toBeDefined();
    });
  });
  
  describe('GET /agents', () => {
    it('should return all registered agents', async () => {
      await request(app)
        .post('/agents/register')
        .send({ name: 'Agent1', capabilities: ['cap1'] });
      
      await request(app)
        .post('/agents/register')
        .send({ name: 'Agent2', capabilities: ['cap2'] });
      
      const response = await request(app).get('/agents');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
  
  describe('GET /agents/:id', () => {
    it('should return agent by id', async () => {
      const registerRes = await request(app)
        .post('/agents/register')
        .send({ name: 'TestAgent', capabilities: [] });
      
      const agentId = registerRes.body.agent_id;
      
      const response = await request(app).get(`/agents/${agentId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.agent_id).toBe(agentId);
    });
    
    it('should return 404 for non-existent agent', async () => {
      const response = await request(app).get('/agents/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Agent not found');
    });
  });
  
  describe('POST /agents/search', () => {
    it('should search agents by capability', async () => {
      await request(app)
        .post('/agents/register')
        .send({ name: 'CodingAgent', capabilities: ['coding'] });
      
      await request(app)
        .post('/agents/register')
        .send({ name: 'ResearchAgent', capabilities: ['research'] });
      
      const response = await request(app)
        .post('/agents/search')
        .send({ capability: 'coding' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('CodingAgent');
    });
  });
});
