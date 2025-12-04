// Test script to manually save game progress
// Usage: node test_save_progress.js <user_id> <game_id> <score>

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

async function testSaveProgress(userId, gameId, score) {
  console.log('Testing save progress for:');
  console.log('User ID:', userId);
  console.log('Game ID:', gameId);
  console.log('Score:', score);
  
  try {
    // First, let's try to get a valid JWT token for the user
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Try to sign in as the user (this might fail if we don't have password)
    console.log('Attempting to get user token...');
    
    // For testing, let's just try to call the function with anon key
    const response = await fetch(`${SUPABASE_URL}/functions/v1/games-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, // Try with anon key first
      },
      body: JSON.stringify({
        game_id: gameId,
        score: score,
        completed: true,
        time_spent: 120,
        progress_data: {}
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error testing save progress:', error);
  }
}

// Get arguments
const userId = process.argv[2];
const gameId = process.argv[3];
const score = parseInt(process.argv[4]) || 100;

if (!userId || !gameId) {
  console.error('Usage: node test_save_progress.js <user_id> <game_id> <score>');
  process.exit(1);
}

testSaveProgress(userId, gameId, score);