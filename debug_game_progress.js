// Debug script to check game_progress for current user
// Usage: node debug_game_progress.js <user_id>

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration. Make sure .env file exists with:');
  console.error('EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function checkGameProgress(userId) {
  console.log('Checking game_progress for user:', userId);
  console.log('Using Supabase URL:', SUPABASE_URL);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Check game_progress table
    const { data: progressData, error: progressError } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId);
    
    console.log('Game Progress Query Result:');
    console.log('Data:', progressData);
    console.log('Error:', progressError);
    console.log('Count:', progressData?.length || 0);
    
    if (progressData && progressData.length > 0) {
      console.log('\nFirst progress entry:', progressData[0]);
    }
    
    // Also check all game_progress entries to see if there are any at all
    const { data: allProgress, error: allError } = await supabase
      .from('game_progress')
      .select('*')
      .limit(10);
    
    console.log('\nAll game_progress entries (limit 10):');
    console.log('Data:', allProgress);
    console.log('Error:', allError);
    console.log('Count:', allProgress?.length || 0);
    
  } catch (error) {
    console.error('Error checking game_progress:', error);
  }
}

// Get user_id from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a user_id as argument');
  console.error('Usage: node debug_game_progress.js <user_id>');
  process.exit(1);
}

checkGameProgress(userId);