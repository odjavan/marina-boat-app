
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    console.log('Checking counts...');

    // Clients
    const { count: clientCount, error: clientError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'cliente');

    if (clientError) console.error('Client Error:', clientError);
    else console.log('Clients (DB):', clientCount);

    // All Profiles
    const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_type, count'); // This is not valid SQL syntax for grouping, let's just fetch all types

    if (profilesError) console.error('Profiles Error:', profilesError);
    else {
        // Manual grouping
        const { data: profiles } = await supabase.from('profiles').select('user_type');
        const counts: Record<string, number> = {};
        profiles?.forEach(p => {
            counts[p.user_type] = (counts[p.user_type] || 0) + 1;
        });
        console.log('Profile Types:', counts);
    }

    // Services
    const { count: serviceCount, error: serviceError } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true });

    if (serviceError) console.error('Service Error:', serviceError);
    else console.log('Services (All):', serviceCount);

    // Service Statuses
    const { data: services } = await supabase.from('service_requests').select('status');
    const statusCounts: Record<string, number> = {};
    services?.forEach(s => {
        statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
    });
    console.log('Service Statuses:', statusCounts);

    // Vessels
    const { count: vesselCount, error: vesselError } = await supabase
        .from('boats')
        .select('*', { count: 'exact', head: true });

    if (vesselError) console.error('Vessel Error:', vesselError);
    else console.log('Vessels:', vesselCount);
}

checkCounts();
