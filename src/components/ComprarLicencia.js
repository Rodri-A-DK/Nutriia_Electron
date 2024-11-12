// src/pages/ComprarLicencia.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const ComprarLicencia = () => {
    const navigate = useNavigate();

    const handlePurchase = async () => {
        const user = supabase.auth.user();
        if (!user) return;

        // Aquí podrías integrar un sistema de pago (ejemplo: MercadoPago o Stripe).
        // Simulemos la compra marcando la licencia como activa en la base de datos.

        const { error } = await supabase
            .from('licencias')
            .update({ licencia_activa: true })
            .eq('user_id', user.id);

        if (error) {
            console.error('Error al activar la licencia:', error);
            alert('Error en el proceso de compra. Intente nuevamente.');
        } else {
            alert('¡Compra exitosa! Tu licencia ha sido activada.');
            navigate('/main');
        }
    };

    return (
        <div className="p-4">
            <h1>Comprar Licencia</h1>
            <p>Para continuar usando la aplicación, necesitas una licencia activa.</p>
            <button onClick={handlePurchase} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Comprar Licencia
            </button>
        </div>
    );
};

export default ComprarLicencia;
