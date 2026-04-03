const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: vendors } = await supabase.from('vendors').select('id, name');
  for (let i = 0; i < vendors.length; i++) {
    const v = vendors[i];
    const newUrl = `https://picsum.photos/seed/${v.id}/800/600`;
    const { error } = await supabase.from('vendors').update({ image_url: newUrl }).eq('id', v.id);
    if (error) console.error(error);
  }
  console.log('Updated vendors');
}

run();
