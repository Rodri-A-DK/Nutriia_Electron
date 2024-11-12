// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Configura las variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; 
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// Verifica que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be provided');
}

// Crea y exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
