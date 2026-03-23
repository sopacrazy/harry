import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xuaiwpuabtwzxikjmcgh.supabase.co';
const supabaseAnonKey = 'sb_publishable_4pkFyPfeJDR2jubYNFUElQ_ug3bicIy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
