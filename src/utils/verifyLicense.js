import { supabase } from '../supabaseClient'; // Asegúrate de importar tu cliente de Supabase

export const checkLicense = async (userId) => {
    console.log('Verificando licencia para el usuario:', userId); // Para depuración

    const { data, error } = await supabase
        .from('licenciasdefinitiva')
        .select('user_id')
        .eq('user_id', userId)
        .single(); // Obtén un solo resultado

    // Manejo de errores
    if (error) {
        console.error('Error al verificar la licencia:', error);
        return { isActive: false }; // Devuelve falso si hay un error
    }

    // Verifica si se encontró el usuario
    if (!data) {
        console.error('No se encontró una licencia para este usuario.');
        return { isActive: false }; // Devuelve falso si no hay datos
    }

    // Si se encontró el user_id, la licencia es válida
    return { isActive: true }; // Devuelve verdadero si se encuentra el usuario
};
