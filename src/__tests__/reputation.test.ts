import { ReputationSystem } from '../reputation';

describe('Reputation System', () => {
  let reputation: ReputationSystem;

  beforeEach(() => {
    reputation = new ReputationSystem();
  });

  it('should start with no reputation', () => {
    const score = reputation.getScore('agent_123');
    expect(score).toBeNull();
  });

  it('should track successful tasks', async () => {
    await reputation.rate('agent_123', {
      task_success: true,
      quality: 5,
      response_time_ms: 1000
    });

    const rep = reputation.getScore('agent_123');
    expect(rep).not.toBeNull();
    expect(rep!.completed_tasks).toBe(1);
    expect(rep!.total_tasks).toBe(1);
  });

  it('should calculate reputation score', async () => {
    await reputation.rate('agent_123', { task_success: true, quality: 5 });
    await reputation.rate('agent_123', { task_success: true, quality: 4 });
    
    const rep = reputation.getScore('agent_123');
    expect(rep!.reputation_score).toBeGreaterThan(70);
  });

  it('should return correct level', () => {
    expect(reputation.getLevel(95)).toBe('🌟 Excellent');
    expect(reputation.getLevel(75)).toBe('✅ Good');
    expect(reputation.getLevel(55)).toBe('⚠️ Fair');
    expect(reputation.getLevel(30)).toBe('❌ Poor');
  });
});
