import { TaskMarketplace } from '../marketplace';

describe('Task Marketplace', () => {
  let marketplace: TaskMarketplace;

  beforeEach(() => {
    marketplace = new TaskMarketplace();
  });

  it('should publish task', () => {
    const task = marketplace.publishTask('agent_a', {
      title: 'Test Task',
      description: 'Test',
      requirements: ['test'],
      reward: 100,
      deadline: '2026-12-31'
    });

    expect(task.status).toBe('open');
    expect(task.publisher_id).toBe('agent_a');
  });

  it('should submit bid', () => {
    const task = marketplace.publishTask('agent_a', {
      title: 'Test',
      description: 'Test',
      requirements: [],
      reward: 100,
      deadline: '2026-12-31'
    });

    const bid = marketplace.submitBid(task.task_id, 'agent_b', {
      price: 80,
      estimated_time_hours: 2,
      message: 'I can do this'
    });

    expect(bid.agent_id).toBe('agent_b');
    expect(bid.price).toBe(80);
  });

  it('should complete workflow', () => {
    const task = marketplace.publishTask('agent_a', {
      title: 'Test',
      description: 'Test',
      requirements: [],
      reward: 100,
      deadline: '2026-12-31'
    });

    const bid = marketplace.submitBid(task.task_id, 'agent_b', {
      price: 80,
      estimated_time_hours: 2,
      message: 'Test'
    });

    marketplace.acceptBid(task.task_id, bid.bid_id);
    marketplace.completeTask(task.task_id);

    expect(marketplace.getBalance('agent_b')).toBe(100);
  });
});
