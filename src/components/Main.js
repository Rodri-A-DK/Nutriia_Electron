// src/components/Main.js
import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Sidebar from './Sidebar';
import ContactInfo from './ContactInfo';

const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error('Error al obtener el usuario:', error.message);
                } else {
                    console.log('Usuario obtenido:', user);
                }

                // Si no hay usuario, redirigir al login
                if (!user) {
                    console.log('No hay usuario, redirigiendo a /login');
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error inesperado en checkUser:', err);
            }
        };

        checkUser();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <h2 className="text-3xl font-bold">Bienvenido a Nutria</h2>
        </div>
    );
};

export default Main;
