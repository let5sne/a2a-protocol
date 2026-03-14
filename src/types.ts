// Core types for A2A Protocol

export interface AgentProfile {
  agent_id: string;
  name: string;
  capabilities: string[];
  endpoint: string;
  created_at: string;
}

export interface Message {
  type: 'message' | 'task_request' | 'task_response';
  from: string;
  to: string;
  payload: any;
  timestamp: string;
  task_id?: string;
}

export interface TaskRequest {
  task: string;
  context?: any;
}

export interface TaskResponse {
  status: 'completed' | 'failed' | 'pending';
  result?: any;
  error?: string;
}
