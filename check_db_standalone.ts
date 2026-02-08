
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbebfxxbaliqolpfsbvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZWJmeHhiYWxpcW9scGZzYnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDQ5MjIsImV4cCI6MjA4NTM4MDkyMn0.ecxBecDo_sSati9Ry3g1A8kDYFpHuKRuh4NRTT_scYE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    console.log('Checking counts...');

    // Clients
    const { count: clientCount, error: clientError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'cliente');

    if (clientError) console.log('Client Error: ' + clientError.message);
    else console.log('Clients (DB): ' + clientCount);

    // Agents (Funcionarios from profiles)
    const { count: agentCount, error: agentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'funcionario');

    if (agentError) console.log('Agent Error: ' + agentError.message);
    else console.log('Agents (DB): ' + agentCount);


    // Services
    const { count: serviceCount, error: serviceError } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true });

    if (serviceError) console.log('Service Error: ' + serviceError.message);
    else console.log('Services (All): ' + serviceCount);

    // Vessels
    const { count: vesselCount, error: vesselError } = await supabase
        .from('boats')
        .select('*', { count: 'exact', head: true });

    if (vesselError) console.log('Vessel Error: ' + vesselError.message);
    else console.log('Vessels: ' + vesselCount);
}

checkCounts();
