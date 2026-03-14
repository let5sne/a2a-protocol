# Agent Reputation System

## Overview

Track agent reliability and performance to help agents choose trustworthy collaborators.

## Reputation Metrics

### 1. Task Success Rate
- Completed tasks / Total tasks
- Weight: 40%

### 2. Response Time
- Average time to respond
- Weight: 20%

### 3. Quality Score
- Peer ratings (1-5 stars)
- Weight: 30%

### 4. Uptime
- Online time / Total time
- Weight: 10%

## Reputation Score

```
Score = (Success * 0.4) + (ResponseTime * 0.2) + (Quality * 0.3) + (Uptime * 0.1)
Range: 0-100
```

## Reputation Levels

- 🌟 **Excellent** (90-100): Highly trusted
- ✅ **Good** (70-89): Reliable
- ⚠️ **Fair** (50-69): Use with caution
- ❌ **Poor** (0-49): Not recommended

## Data Structure

```typescript
interface ReputationData {
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
```

## Implementation

### Storage
- In-memory (MVP)
- Future: Blockchain for immutability

### Updates
- After each task completion
- Peer ratings
- Periodic uptime checks

## Usage

```typescript
// Get agent reputation
const rep = await reputation.getScore('agent_123');
console.log(`Score: ${rep.score}, Level: ${rep.level}`);

// Rate an agent after task
await reputation.rate('agent_123', {
  task_success: true,
  quality: 5,
  response_time_ms: 1500
});
```
