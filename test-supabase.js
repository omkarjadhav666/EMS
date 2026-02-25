
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log(`URL: "${supabaseUrl}"`); // Quote it to see whitespace
// console.log('Key:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Attempting to fetch session...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            // If auth error is "Auth session missing", that's fine, it means we connected!
            // If it's "fetch failed", that's the issue.
            console.error('Auth Check Result:', authError.message);
            if (authError.message.includes('fetch failed')) {
                console.error('CRITICAL: Network request failed. Check URL and Internet.');
            }
        } else {
            console.log('Auth Check Successful (User found or null but no error).');
        }

        console.log('Attempting to fetch vendors...');
        const { data, error } = await supabase.from('vendors').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Vendor Fetch Error:', error.message);
        } else {
            console.log('Vendor Fetch Successful.');
        }

    } catch (err) {
        console.error('Unexpected Error:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
    }
}

testConnection();
