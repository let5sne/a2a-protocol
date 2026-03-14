export interface ReputationData {
  agent_id: string;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  avg_response_time_ms: number;
  quality_ratings: number[];
  uptime_percentage: number;
  last_seen: string;
  reputation_score: number;
}

export interface Rating {
  task_success: boolean;
  quality?: number; // 1-5
  response_time_ms?: number;
}

export class ReputationSystem {
  private data: Map<string, ReputationData> = new Map();

  getScore(agentId: string): ReputationData | null {
    return this.data.get(agentId) || null;
  }

  async rate(agentId: string, rating: Rating): Promise<void> {
    let rep = this.data.get(agentId);
    
    if (!rep) {
      rep = {
        agent_id: agentId,
        total_tasks: 0,
        completed_tasks: 0,
        failed_tasks: 0,
        avg_response_time_ms: 0,
        quality_ratings: [],
        uptime_percentage: 100,
        last_seen: new Date().toISOString(),
        reputation_score: 50
      };
    }

    // Update task stats
    rep.total_tasks++;
    if (rating.task_success) {
      rep.completed_tasks++;
    } else {
      rep.failed_tasks++;
    }

    // Update response time
    if (rating.response_time_ms) {
      const total = rep.avg_response_time_ms * (rep.total_tasks - 1);
      rep.avg_response_time_ms = (total + rating.response_time_ms) / rep.total_tasks;
    }

    // Update quality
    if (rating.quality) {
      rep.quality_ratings.push(rating.quality);
    }

    // Calculate score
    rep.reputation_score = this.calculateScore(rep);
    rep.last_seen = new Date().toISOString();

    this.data.set(agentId, rep);
  }

  private calculateScore(rep: ReputationData): number {
    const successRate = rep.total_tasks > 0 
      ? (rep.completed_tasks / rep.total_tasks) * 100 
      : 50;
    
    const responseScore = Math.max(0, 100 - (rep.avg_response_time_ms / 100));
    
    const avgQuality = rep.quality_ratings.length > 0
      ? (rep.quality_ratings.reduce((a, b) => a + b, 0) / rep.quality_ratings.length) * 20
      : 50;
    
    const score = (successRate * 0.4) + (responseScore * 0.2) + (avgQuality * 0.3) + (rep.uptime_percentage * 0.1);
    
    return Math.min(100, Math.max(0, score));
  }

  getLevel(score: number): string {
    if (score >= 90) return '🌟 Excellent';
    if (score >= 70) return '✅ Good';
    if (score >= 50) return '⚠️ Fair';
    return '❌ Poor';
  }
}
