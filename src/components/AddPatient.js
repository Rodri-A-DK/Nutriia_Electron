import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AddPatient = () => {
    const [userId, setUserId] = useState(null);
    const [patientData, setPatientData] = useState({
        nombre: "",
        altura: "",
        peso: "",
        nivel_actividad: "",
        ubicacion: "",
        fecha: "",
        tiempo_objetivo: "",
        afecciones: "",
        preferencias: ""
    });

    useEffect(() => {
        // Obtén el user_id del usuario autenticado
        const fetchUserId = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error al obtener user_id:", error);
            } else {
                setUserId(user.id);
            }
        };

        fetchUserId();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({
            ...patientData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            console.error("Error: userId es undefined");
            alert("Error al agregar paciente. No se encontró userId.");
            return;
        }

        try {
            const { error } = await supabase.from('pacientes').insert([
                {
                    user_id: userId, // Usa el user_id obtenido
                    ...patientData
                }
            ]);
            if (error) throw error;
            alert("Paciente agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar paciente:", error);
            alert("Error al agregar paciente.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Agregar Pacientes</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={patientData.nombre} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Altura</label>
                    <input type="number" name="altura" value={patientData.altura} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Peso</label>
                    <input type="number" name="peso" value={patientData.peso} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nivel de Actividad Física</label>
                    <input type="text" name="nivel_actividad" value={patientData.nivel_actividad} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Ubicación</label>
                    <input type="text" name="ubicacion" value={patientData.ubicacion} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Fecha</label>
                    <input type="date" name="fecha" value={patientData.fecha} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tiempo Estimado para el Objetivo</label>
                    <input type="text" name="tiempo_objetivo" value={patientData.tiempo_objetivo} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Afecciones</label>
                    <input type="text" name="afecciones" value={patientData.afecciones} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Preferencias Alimenticias</label>
                    <input type="text" name="preferencias" value={patientData.preferencias} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Agregar Paciente</button>
            </form>
        </div>
    );
};

export default AddPatient;
