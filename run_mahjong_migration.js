const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://iovbamjyvnpucaljkrkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdmJhbWp5dm5wdWNhbGprcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODUwNTUsImV4cCI6MjA4MDI2MTA1NX0.aQl0Cas2cnRlyxRhnTtdMmuEWNW62b8b-bzPHVhEDAY';

async function runMigration() {
    try {
        // Read the SQL file
        const sqlContent = fs.readFileSync(
            path.join(__dirname, 'supabase/migrations/20251208_add_mahjong_solitaire.sql'),
            'utf-8'
        );

        console.log('Running SQL migration...');
        console.log(sqlContent);

        // Use Supabase REST API to insert directly
        const response = await fetch(`${SUPABASE_URL}/rest/v1/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                title: 'Mahjong Solitaire',
                description: 'Taşları eşleştir ve tahtayı temizle! Strateji ve konsantrasyon gerektirir.',
                category: 'fun',
                difficulty: 'medium',
                min_age: 8,
                max_age: 99,
                points: 50,
                is_active: true,
                game_data: {
                    type: 'mahjong-solitaire'
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to insert game: ${response.status} - ${error}`);
        }

        console.log('✅ Migration successful! Mahjong Solitaire game added to database.');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
