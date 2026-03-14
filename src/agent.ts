import WebSocket from 'ws';
import { AgentProfile, Message, TaskRequest, TaskResponse } from './types';

export class Agent {
  private profile: AgentProfile | null = null;
  private ws: WebSocket | null = null;
  private registryUrl: string;
  private messageHandlers: Map<string, (msg: Message) => void> = new Map();
  private taskHandlers: Map<string, (req: TaskRequest) => Promise<TaskResponse>> = new Map();

  constructor(
    private name: string,
    private capabilities: string[],
    registryUrl = 'http://localhost:3000'
  ) {
    this.registryUrl = registryUrl;
  }

  async register(): Promise<void> {
    const res = await fetch(`${this.registryUrl}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.name,
        capabilities: this.capabilities
      })
    });
    
    this.profile = await res.json() as AgentProfile;
    console.log(`✅ Registered as ${this.profile!.name} (${this.profile!.agent_id})`);
    
    await this.connect();
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.profile!.endpoint);
      
      this.ws.on('open', () => {
        console.log(`🔌 Connected to registry`);
        resolve();
      });
      
      this.ws.on('message', (data) => {
        const message: Message = JSON.parse(data.toString());
        this.handleMessage(message);
      });
      
      this.ws.on('error', reject);
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    console.log(`📨 Received ${message.type} from ${message.from}`);
    
    if (message.type === 'task_request') {
      const handler = this.taskHandlers.get('*');
      if (handler) {
        const response = await handler(message.payload);
        this.sendTaskResponse(message.from, message.task_id!, response);
      }
    } else if (message.type === 'message') {
      const handler = this.messageHandlers.get('*');
      if (handler) {
        handler(message);
      }
    }
  }

  async sendMessage(to: string, payload: any): Promise<void> {
    const message: Message = {
      type: 'message',
      from: this.profile!.agent_id,
      to,
      payload,
      timestamp: new Date().toISOString()
    };
    
    this.ws!.send(JSON.stringify(message));
    console.log(`📤 Sent message to ${to}`);
  }

  async requestTask(to: string, task: TaskRequest): Promise<TaskResponse> {
    return new Promise((resolve) => {
      const task_id = `task_${Date.now()}`;
      
      const message: Message = {
        type: 'task_request',
        from: this.profile!.agent_id,
        to,
        task_id,
        payload: task,
        timestamp: new Date().toISOString()
      };
      
      const handler = (msg: Message) => {
        if (msg.type === 'task_response' && msg.task_id === task_id) {
          this.messageHandlers.delete(task_id);
          resolve(msg.payload);
        }
      };
      
      this.messageHandlers.set(task_id, handler);
      this.ws!.send(JSON.stringify(message));
      console.log(`📤 Sent task request to ${to}`);
    });
  }

  private sendTaskResponse(to: string, task_id: string, response: TaskResponse): void {
    const message: Message = {
      type: 'task_response',
      from: this.profile!.agent_id,
      to,
      task_id,
      payload: response,
      timestamp: new Date().toISOString()
    };
    
    this.ws!.send(JSON.stringify(message));
  }

  onMessage(handler: (msg: Message) => void): void {
    this.messageHandlers.set('*', handler);
  }

  onTask(handler: (req: TaskRequest) => Promise<TaskResponse>): void {
    this.taskHandlers.set('*', handler);
  }

  async searchAgents(capability: string): Promise<AgentProfile[]> {
    const res = await fetch(`${this.registryUrl}/agents/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capability })
    });
    return res.json() as Promise<AgentProfile[]>;
  }

  getProfile(): AgentProfile | null {
    return this.profile;
  }
}
