// src/components/Callback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                navigate('/main');  // Redirige a la página principal
            } else {
                navigate('/login');  // Si falla, vuelve al login
            }
        };

        fetchUser();
    }, [navigate]);

    return <div>Procesando autenticación...</div>;
};

export default Callback;
