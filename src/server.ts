import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { AgentProfile, Message } from './types';

const app = express();
app.use(express.json());

const PORT = 3000;
const agents = new Map<string, AgentProfile>();
const connections = new Map<string, WebSocket>();

// Agent Registry API
app.post('/agents/register', (req, res) => {
  const { name, capabilities } = req.body;
  const agent_id = `agent_${uuidv4().slice(0, 8)}`;
  
  const profile: AgentProfile = {
    agent_id,
    name,
    capabilities: capabilities || [],
    endpoint: `ws://localhost:${PORT}/agent/${agent_id}`,
    created_at: new Date().toISOString()
  };
  
  agents.set(agent_id, profile);
  console.log(`✅ Agent registered: ${name} (${agent_id})`);
  
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

const server = app.listen(PORT, () => {
  console.log(`🚀 A2A Registry Server running on http://localhost:${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req) => {
  const agent_id = req.url?.split('/').pop();
  
  if (agent_id && agents.has(agent_id)) {
    connections.set(agent_id, ws);
    console.log(`🔌 Agent connected: ${agent_id}`);
    
    ws.on('message', (data) => {
      try {
        const message: Message = JSON.parse(data.toString());
        const targetWs = connections.get(message.to);
        
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
          targetWs.send(JSON.stringify(message));
          console.log(`📨 Message routed: ${message.from} → ${message.to}`);
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Target agent not connected'
          }));
        }
      } catch (err) {
        console.error('Message error:', err);
      }
    });
    
    ws.on('close', () => {
      connections.delete(agent_id);
      console.log(`🔌 Agent disconnected: ${agent_id}`);
    });
  } else {
    ws.close();
  }
});
