import { ReputationSystem } from '../reputation';

/**
 * Reputation System Example
 * Demonstrates agent reputation tracking
 */

async function main() {
  console.log('⭐ Reputation System Example\n');

  const reputation = new ReputationSystem();

  // Simulate agent tasks
  const agentId = 'agent_test_123';

  console.log('📊 Rating agent performance...\n');

  // Task 1: Success
  await reputation.rate(agentId, {
    task_success: true,
    quality: 5,
    response_time_ms: 1200
  });

  // Task 2: Success
  await reputation.rate(agentId, {
    task_success: true,
    quality: 4,
    response_time_ms: 1500
  });

  // Task 3: Failed
  await reputation.rate(agentId, {
    task_success: false,
    quality: 2,
    response_time_ms: 3000
  });

  // Task 4: Success
  await reputation.rate(agentId, {
    task_success: true,
    quality: 5,
    response_time_ms: 1000
  });

  // Get reputation
  const rep = reputation.getScore(agentId);
  
  if (rep) {
    console.log('✅ Agent Reputation:');
    console.log(`   Score: ${rep.reputation_score.toFixed(1)}/100`);
    console.log(`   Level: ${reputation.getLevel(rep.reputation_score)}`);
    console.log(`   Success Rate: ${((rep.completed_tasks / rep.total_tasks) * 100).toFixed(1)}%`);
    console.log(`   Avg Response: ${rep.avg_response_time_ms.toFixed(0)}ms`);
    console.log(`   Quality: ${(rep.quality_ratings.reduce((a, b) => a + b) / rep.quality_ratings.length).toFixed(1)}/5`);
  }
}

main().catch(console.error);
