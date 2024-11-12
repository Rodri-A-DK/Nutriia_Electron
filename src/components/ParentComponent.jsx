// src/ParentComponent.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AddPatient from './AddPatient';

const ParentComponent = () => {
    const [user, setUser] = useState(null);

    // Obtener el usuario cuando el componente se monta
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error al obtener el usuario:", error.message);
            } else {
                setUser(data.user);
            }
        };
        fetchUser();
    }, []);

    // Asegúrate de que user esté disponible antes de cargar el componente AddPatient
    return (
        <div>
            {user ? (
                <AddPatient user={user} /> // Pasamos el objeto user como propiedad a AddPatient
            ) : (
                <p>Cargando usuario...</p>
            )}
        </div>
    );
};

export default ParentComponent;
