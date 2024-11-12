// src/components/Login.js
import React from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Configura la URL de autenticación de Supabase para abrir en una ventana emergente
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/callback`, // Redirecciona a una URL de callback que puedes manejar
                },
            });

            if (error) {
                console.error('Error al iniciar sesión:', error.message);
            } else {
               
         
            }
        } catch (error) {
            console.error('Error al abrir la ventana de autenticación:', error);
        }
    };

    const verificarSesion = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error al verificar la sesión:', error.message);
        } else if (user) {
            navigate('/');
        } else {
            console.log('No hay usuario, redirigiendo a /');
        }
    };

    return (
        <div className="flex items-center justify-center h-full bg-gray-400">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4">Iniciar sesión</h2>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Iniciar sesión con Google
                </button>
            </div>
        </div>
    );
};

export default Login;
