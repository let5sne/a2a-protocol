import { Agent } from '../agent';

/**
 * Orchestrator Agent - Coordinates multiple agents to complete complex tasks
 * 
 * Scenario: Market research project
 * 1. Find market analysis agent
 * 2. Request market research
 * 3. Find data analysis agent
 * 4. Request statistical analysis
 * 5. Combine results
 */
async function main() {
  const orchestrator = new Agent('OrchestratorAgent', ['orchestration', 'project_management']);
  
  await orchestrator.register();
  console.log('🎯 Orchestrator Agent started\n');
  
  // Wait for other agents to register
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('🔍 Step 1: Finding market analysis agent...');
  const marketAgents = await orchestrator.searchAgents('market_research');
  
  if (marketAgents.length === 0) {
    console.log('❌ No market analysis agent found');
    return;
  }
  
  const marketAgent = marketAgents[0];
  console.log(`✅ Found: ${marketAgent.name}\n`);
  
  console.log('📊 Step 2: Requesting market research...');
  const marketResult = await orchestrator.requestTask(marketAgent.agent_id, {
    task: 'market_research',
    context: { industry: 'AI' }
  });
  
  console.log('✅ Market research completed:', marketResult.result);
  
  console.log('\n🔍 Step 3: Finding data analysis agent...');
  const dataAgents = await orchestrator.searchAgents('statistical_analysis');
  
  if (dataAgents.length === 0) {
    console.log('❌ No data analysis agent found');
    return;
  }
  
  const dataAgent = dataAgents[0];
  console.log(`✅ Found: ${dataAgent.name}\n`);
  
  console.log('📈 Step 4: Requesting statistical analysis...');
  const dataResult = await orchestrator.requestTask(dataAgent.agent_id, {
    task: 'statistical_analysis',
    context: { data: marketResult.result }
  });
  
  console.log('✅ Statistical analysis completed:', dataResult.result);
  
  console.log('\n🎉 Step 5: Project completed!');
  console.log('📋 Final Report:');
  console.log({
    market_insights: marketResult.result,
    statistical_analysis: dataResult.result,
    conclusion: 'AI market shows strong growth potential'
  });
}

main().catch(console.error);
