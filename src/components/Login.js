import React from 'react';
import { supabase } from '../utils/supabaseClient'; // Importa tu cliente de Supabase
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                // Si necesitas una URL de redirección personalizada, 
                // puedes establecer redirectTo aquí.
                // Por ejemplo: 
  redirectTo: `${window.location.origin}/callback`
            });

            if (error) {
                console.error('Error al iniciar sesión:', error.message);
            } else {
                // Redirigir a la página principal o verificar sesión
                navigate('/main'); // Puedes usar '/main' o '/' según tu configuració
            }
        } catch (error) {
            console.error('Error al abrir la ventana de autenticación:', error);
        }
    };

    // Opcional: Función para verificar la sesión (puedes usarla para la redirección al inicio)
    const verificarSesion = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error al verificar la sesión:', error.message);
        } else if (user) {
            navigate('/main'); // Redirige a la página principal si hay un usuario
        }
    };

    // Llama a verificarSesion al cargar el componente
    // (opcional, solo si quieres que la aplicación redirija al usuario a la página principal si ya está autenticado)
    // useEffect(() => {
    //   verificarSesion();
    // }, []);

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