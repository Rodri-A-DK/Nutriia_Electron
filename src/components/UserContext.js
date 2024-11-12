// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Asegúrate de que esta ruta sea correcta

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Aquí debes verificar el usuario de Supabase
        const fetchUser = async () => {
            const user = supabase.auth.user(); // Obtén el usuario de Supabase
            setUser(user); // Establece el estado del usuario
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
