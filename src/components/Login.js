// src/components/Login.js
import React from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
        } else {
            // Redirigir a la página principal o verificar sesión
            navigate('/main');
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
