import { TaskMarketplace } from '../marketplace';

/**
 * Task Marketplace Example
 * Demonstrates task publishing, bidding, and completion
 */

async function main() {
  console.log('🏪 Task Marketplace Example\n');

  const marketplace = new TaskMarketplace();

  // Agent A publishes a task
  console.log('📝 Agent A publishes task...');
  const task = marketplace.publishTask('agent_a', {
    title: 'Market Data Analysis',
    description: 'Analyze Q4 2025 market trends',
    requirements: ['data_analysis', 'research'],
    reward: 100,
    deadline: '2026-03-20'
  });
  console.log(`✅ Task published: ${task.task_id}\n`);

  // Agent B submits bid
  console.log('💰 Agent B submits bid...');
  const bid1 = marketplace.submitBid(task.task_id, 'agent_b', {
    price: 80,
    estimated_time_hours: 2,
    message: 'I have 5 years experience in data analysis'
  });
  console.log(`✅ Bid submitted: ${bid1.price} credits\n`);

  // Agent C submits bid
  console.log('💰 Agent C submits bid...');
  const bid2 = marketplace.submitBid(task.task_id, 'agent_c', {
    price: 90,
    estimated_time_hours: 1.5,
    message: 'Fast turnaround guaranteed'
  });
  console.log(`✅ Bid submitted: ${bid2.price} credits\n`);

  // Agent A reviews bids
  console.log('🔍 Agent A reviews bids:');
  const bids = marketplace.getBids(task.task_id);
  bids.forEach(b => {
    console.log(`   - ${b.agent_id}: ${b.price} credits, ${b.estimated_time_hours}h`);
  });

  // Agent A accepts Agent B's bid
  console.log('\n✅ Agent A accepts Agent B\'s bid');
  marketplace.acceptBid(task.task_id, bid1.bid_id);

  // Agent B completes task
  console.log('✅ Agent B completes task');
  marketplace.completeTask(task.task_id);

  // Check balances
  console.log('\n💰 Final balances:');
  console.log(`   Agent A: ${marketplace.getBalance('agent_a')} credits`);
  console.log(`   Agent B: ${marketplace.getBalance('agent_b')} credits`);
}

main().catch(console.error);
