// src/components/Callback.js
import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const Callback = () => {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Error al obtener el usuario:', error.message);
                    // Redirige al usuario a la URL externa
                    window.location.href = 'https://rodri-a-dk.github.io/Nutriia_Electron/';
                } else if (user) {
                    window.location.href = 'https://rodri-a-dk.github.io/Nutriia_Electron/';
                } else {
                    window.location.href = 'https://rodri-a-dk.github.io/Nutriia_Electron/';
                }
            } catch (error) {
                console.error('Error al obtener el usuario:', error.message);
                window.location.href = 'https://rodri-a-dk.github.io/Nutriia_Electron/';
            }
        };

        fetchUser();
    }, []);

    return <div>Procesando autenticación...</div>;
};

export default Callback;
