import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
const AuthCheck = ({ children, setLicenseActive }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndCheckLicense = async () => {
            setLoading(true);

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.log('No hay usuario autenticado:', authError);
                setLicenseActive(false);
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('licencias')
                    .select('user_id')
                    .eq('user_id', user.id)
                    .eq('estado', 'activo')
                    .gt('fecha_expiracion', new Date().toISOString())
                    .single();

                if (error || !data) {
                    console.log('Error al verificar la licencia o licencia no válida:', error);
                    setLicenseActive(false);
                    navigate('/contact-info');
                } else {
                    setLicenseActive(true);
                }
            } catch (err) {
                console.error('Error al verificar la licencia:', err);
                setLicenseActive(false);
            }

            setLoading(false);
        };

        fetchUserAndCheckLicense();
    }, [navigate, setLicenseActive]);

    // Verifica si 'children' es un elemento válido
    console.log('children:', children);

    return <>{children}</>; // Renderiza los hijos
};


export default AuthCheck;
