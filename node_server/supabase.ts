const { createClient } = require('@supabase/supabase-js');
module.exports = createClient(
    process.env.APP_SUPABASE_URL,
    process.env.APP_SUPABASE_KEY
);