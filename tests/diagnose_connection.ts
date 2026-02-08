
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);

if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8').replace(/\r/g, ''); // Fix Windows CRLF
const envConfig: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    if (!line.trim() || line.startsWith('#')) return;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
        envConfig[key] = value;
    }
});

console.log('Loaded Keys:', Object.keys(envConfig));

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

console.log('--- Diagnostic: Supabase Connection ---');
console.log(`URL: ${url}`);
console.log(`Key: ${key ? 'Present (Hidden)' : 'MISSING'}`);

if (!url || !key) {
    console.error('❌ Missing credentials in .env');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    console.log('1. Testing simple fetch (profiles)...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('❌ Connection Failed:', error.message);
        console.error('Details:', error);
    } else {
        console.log('✅ Connection Successful!');
        console.log('2. Testing recent migration (email column)...');

        // Try to insert a dummy user to check schema specific to the error
        // We use a random ID to avoid conflicts
        const dummyId = '00000000-0000-0000-0000-000000000000';
        // We just check if the column exists by selecting it, not inserting (safer)
        const { error: colError } = await supabase
            .from('profiles')
            .select('email')
            .limit(1);

        if (colError) {
            console.error('❌ Schema Check Failed (Email column might be missing):', colError.message);
        } else {
            console.log('✅ Schema Check Passed: "email" column is queryable.');
        }
    }
}

testConnection();
