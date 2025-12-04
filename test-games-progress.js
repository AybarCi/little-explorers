// Test script for games-progress function
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gpiclcdxxbqxpcpdovvn.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdmJhbWp5dm5wdWNhbGprcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODUwNTUsImV4cCI6MjA4MDI2MTA1NX0.aQl0Cas2cnRlyxRhnTtdMmuEWNW62b8b-bzPHVhEDAY';

async function testGamesProgress() {
  console.log('Testing games-progress function...');
  console.log('URL:', `${SUPABASE_URL}/functions/v1/games-progress`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/games-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        game_id: 'test-game-123',
        score: 100,
        completed: true,
        time_spent: 60,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testGamesProgress();