export interface Task {
  task_id: string;
  publisher_id: string;
  title: string;
  description: string;
  requirements: string[];
  reward: number;
  deadline: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  assigned_to?: string;
  created_at: string;
}

export interface Bid {
  bid_id: string;
  task_id: string;
  agent_id: string;
  price: number;
  estimated_time_hours: number;
  message: string;
  created_at: string;
}

export class TaskMarketplace {
  private tasks: Map<string, Task> = new Map();
  private bids: Map<string, Bid[]> = new Map();
  private balances: Map<string, number> = new Map();

  publishTask(publisher_id: string, task: Omit<Task, 'task_id' | 'publisher_id' | 'status' | 'created_at'>): Task {
    const newTask: Task = {
      task_id: `task_${Date.now()}`,
      publisher_id,
      ...task,
      status: 'open',
      created_at: new Date().toISOString()
    };
    
    this.tasks.set(newTask.task_id, newTask);
    return newTask;
  }

  submitBid(task_id: string, agent_id: string, bid: Omit<Bid, 'bid_id' | 'task_id' | 'agent_id' | 'created_at'>): Bid {
    const task = this.tasks.get(task_id);
    if (!task || task.status !== 'open') {
      throw new Error('Task not available');
    }

    const newBid: Bid = {
      bid_id: `bid_${Date.now()}`,
      task_id,
      agent_id,
      ...bid,
      created_at: new Date().toISOString()
    };

    const taskBids = this.bids.get(task_id) || [];
    taskBids.push(newBid);
    this.bids.set(task_id, taskBids);

    return newBid;
  }

  acceptBid(task_id: string, bid_id: string): void {
    const task = this.tasks.get(task_id);
    const bids = this.bids.get(task_id) || [];
    const bid = bids.find(b => b.bid_id === bid_id);

    if (!task || !bid) {
      throw new Error('Task or bid not found');
    }

    task.status = 'assigned';
    task.assigned_to = bid.agent_id;
    this.tasks.set(task_id, task);
  }

  completeTask(task_id: string): void {
    const task = this.tasks.get(task_id);
    if (!task || task.status !== 'assigned') {
      throw new Error('Task not assigned');
    }

    task.status = 'completed';
    this.tasks.set(task_id, task);

    // Transfer payment
    if (task.assigned_to) {
      this.transfer(task.publisher_id, task.assigned_to, task.reward);
    }
  }

  private transfer(from: string, to: string, amount: number): void {
    const fromBalance = this.balances.get(from) || 0;
    const toBalance = this.balances.get(to) || 0;

    this.balances.set(from, fromBalance - amount);
    this.balances.set(to, toBalance + amount);
  }

  getBalance(agent_id: string): number {
    return this.balances.get(agent_id) || 0;
  }

  listTasks(status?: Task['status']): Task[] {
    const tasks = Array.from(this.tasks.values());
    return status ? tasks.filter(t => t.status === status) : tasks;
  }

  getBids(task_id: string): Bid[] {
    return this.bids.get(task_id) || [];
  }
}
