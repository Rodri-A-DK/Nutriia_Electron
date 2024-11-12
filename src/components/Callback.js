// src/components/Callback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Error al obtener el usuario:', error.message);
                    // Redirige al usuario a la página de error o muestra un mensaje 
                    navigate('/error'); // O lo que corresponda
                } else if (user) {
                    navigate('/main');
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error al obtener el usuario:', error.message);
                navigate('/error'); 
            }
        };

        fetchUser();
    }, [navigate]);

    return <div>Procesando autenticación...</div>;
};

export default Callback;
