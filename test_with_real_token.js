// Test script to validate saveGameProgress with a real user token
const https = require('https');

// Get token from command line arguments
const token = process.argv[2];
const gameId = process.argv[3] || 'math_game_1';
const score = parseInt(process.argv[4]) || 100;

if (!token) {
  console.error('Usage: node test_with_real_token.js <user_access_token> [game_id] [score]');
  console.error('Example: node test_with_real_token.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... math_game_1 100');
  process.exit(1);
}

console.log('Testing save progress with real user token:');
console.log('Token:', token.substring(0, 20) + '...');
console.log('Game ID:', gameId);
console.log('Score:', score);

const SUPABASE_URL = 'https://gpiclcdxxbqxpcpdovvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdmJhbWp5dm5wdWNhbGprcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODUwNTUsImV4cCI6MjA4MDI2MTA1NX0.aQl0Cas2cnRlyxRhnTtdMmuEWNW62b8b-bzPHVhEDAY';

async function testSaveProgress() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/games-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        game_id: gameId,
        score: score,
        completed: true,
        time_spent: 120,
        progress_data: {}
      })
    });

    const data = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Game progress saved successfully!');
    } else {
      console.log('\n❌ FAILED:', data.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testSaveProgress();