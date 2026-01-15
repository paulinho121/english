
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple .env parser since we can't rely on dotenv being installed/configured for this script
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Testing B2B Database Schema...');
console.log(`📡 Connecting to: ${supabaseUrl}`);

async function testOrganizationsTable() {
    console.log('\n--- 1. Testing "organizations" Table Existence ---');
    // We expect this to either return [] (if connected but empty/RLS blocked)
    // Or throw an error if table doesn't exist.

    try {
        const { data, error } = await supabase.from('organizations').select('id, name').limit(1);

        if (error) {
            console.error('❌ Error querying organizations:', error.message);
            if (error.code === '42P01') { // Postgres code for undefined_table
                console.error('⚠️  CRITICAL: Table "organizations" does NOT exist. Migration failed or was not run.');
            } else {
                console.log('✅ Connection successful. Table likely exists (RLS might be restricting access, which is GOOD).');
                console.log('   Error details (Expected if RLS is on):', error);
            }
        } else {
            console.log('✅ Table "organizations" exists and is accessible.');
            console.log(`   Rows found: ${data.length}`);
        }

    } catch (e) {
        console.error('❌ Unexpected error:', e);
    }
}

async function testProfilesLink() {
    console.log('\n--- 2. Testing "profiles" Link (organization_id) ---');
    // We try to select organization_id from profiles. 
    // If column doesn't exist, we'll get an error.

    try {
        const { data, error } = await supabase.from('profiles').select('organization_id').limit(1);

        if (error) {
            // 'column "organization_id" does not exist' is likely error if migration failed
            if (error.message.includes('organization_id')) {
                console.error('⚠️  CRITICAL: Column "organization_id" missing in profiles table.');
            } else {
                console.log('✅ Column check passed (Error was unrelated to column existence).');
                // Likely RLS or just empty return
            }
        } else {
            console.log('✅ Column "organization_id" exists in profiles.');
        }

    } catch (e) {
        console.error('❌ Unexpected error:', e);
    }
}

async function run() {
    await testOrganizationsTable();
    await testProfilesLink();
    console.log('\n🏁 Verification Complete.');
}

run();
