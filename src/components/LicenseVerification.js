// src/pages/VerificacionDeLicencia.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLicense } from '../utils/verifyLicense';
import { supabase } from '../utils/supabaseClient';

const VerificacionDeLicencia = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUserLicense = async () => {
            const user = supabase.auth.user();
            if (!user) {
                navigate('/'); // Redirige al inicio de sesión si no hay usuario
                return;
            }

            const { isActive } = await checkLicense(user.id);
            if (!licenseActive) {
                navigate('/ComprarLicencia'); // Redirige si la licencia no está activa
            }
            
            if (isActive) {
                navigate('/main'); // Redirige a la página principal
            } else {
                navigate('/ComprarLicencia'); // Redirige a la página de compra de licencia
            }
            setLoading(false);
        };

        verifyUserLicense();
    }, [navigate]);

    if (loading) return <p>Verificando licencia...</p>;

    return null;
};

export default VerificacionDeLicencia;
