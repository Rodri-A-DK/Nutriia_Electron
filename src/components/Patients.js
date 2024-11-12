import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import AuthCheck from './AuthCheck';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [licenseActive, setLicenseActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.log('No hay usuario autenticado:', authError);
                navigate('/login');
                setLoading(false);
                return;
            }

            const { data: licenseData, error: licenseError } = await supabase
                .from('licencias')
                .select('user_id')
                .eq('user_id', user.id)
                .eq('estado', 'activo')
                .gt('fecha_expiracion', new Date().toISOString())
                .single();

            if (licenseError || !licenseData) {
                console.log('Licencia no válida');
                navigate('/contact-info');
                setLicenseActive(false);
                setLoading(false);
                return;
            }

            setLicenseActive(true);

            const { data: patientsData, error: patientsError } = await supabase
                .from('pacientes')
                .select('*')
                .eq('user_id', user.id);

            if (patientsError) {
                console.error('Error al obtener pacientes:', patientsError);
            } else {
                setPatients(patientsData);
            }

            setLoading(false);
        };

        fetchPatients();
    }, [navigate]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    const filteredPatients = patients.filter((patient) =>
        patient.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPatients = filteredPatients.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const handleDeletePatient = async (id) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar a este paciente?');
        if (confirmDelete) {
            const { error } = await supabase.from('pacientes').delete().eq('id', id);
            if (!error) {
                setPatients((prev) => prev.filter((patient) => patient.id !== id));
                alert('Paciente eliminado exitosamente');
            }
        }
    };

    const handleEditToggle = (patientId) => {
        setIsEditing(isEditing === patientId ? null : patientId);
    };

    const handleUpdatePatient = async (patient) => {
        const { error } = await supabase
            .from('pacientes')
            .update({
                nombre: patient.nombre,
                altura: patient.altura,
                peso: patient.peso,
                nivel_actividad: patient.nivel_actividad,
                ubicacion: patient.ubicacion,
                fecha: patient.fecha,
                tiempo_objetivo: patient.tiempo_objetivo,
                afecciones: patient.afecciones,
                preferencias: patient.preferencias,
            })
            .eq('id', patient.id);

        if (!error) {
            alert('Paciente actualizado correctamente');
            setIsEditing(null);
        } else {
            alert('Error al actualizar el paciente');
        }
    };

    return (
        <AuthCheck setLicenseActive={setLicenseActive}>
            <div>
                <strong><input
                    type="text"
                    placeholder="Nombre del paciente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded"
                /></strong>
                <div>
                    <h3>Lista de pacientes</h3>
                    <ol>
                        {sortedPatients.map((patient) => (
                            <li key={patient.id} className="cursor-pointer hover:bg-gray-500 p-2 rounded flex justify-between items-center">
                                <div>
                                <span className="font-bold uppercase"> {patient.nombre}</span>
                                    <div className="mt-2">
                                        {isEditing === patient.id ? (
                                            <>
                                                <p>Nombre</p>
                                                <input type="text" value={patient.nombre} onChange={(e) => patient.nombre = e.target.value} />
                                                <p>Altura</p>
                                                <input type="number" value={patient.altura} onChange={(e) => patient.altura = e.target.value} />
                                                <p>Peso</p>
                                                <input type="number" value={patient.peso} onChange={(e) => patient.peso = e.target.value} />
                                                <p>Actividad Física</p>
                                                <input type="text" value={patient.nivel_actividad} onChange={(e) => patient.nivel_actividad = e.target.value} />
                                                <p>Ubicación</p>
                                                <input type="text" value={patient.ubicacion} onChange={(e) => patient.ubicacion = e.target.value} />
                                                <p>Fecha</p>
                                                <input type="date" value={patient.fecha} onChange={(e) => patient.fecha = e.target.value} />
                                                <p>Objetivo en meses</p>
                                                <input type="text" value={patient.tiempo_objetivo} onChange={(e) => patient.tiempo_objetivo = e.target.value} />
                                                <p>Afecciones</p>
                                                <input type="text" value={patient.afecciones} onChange={(e) => patient.afecciones = e.target.value} />
                                                <p>Preferencias</p>
                                                <input type="text" value={patient.preferencias} onChange={(e) => patient.preferencias = e.target.value} />
                                                <button onClick={() => handleUpdatePatient(patient)} className="bg-blue-500 text-white px-2 py-1 rounded">Guardar Cambios</button>
                                                <button onClick={() => setIsEditing(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>Altura:</strong> {patient.altura} cm</p>
                                                <p><strong>Peso:</strong> {patient.peso} kg</p>
                                                <p><strong>Nivel de Actividad:</strong> {patient.nivel_actividad}</p>
                                                <p><strong>Ubicación:</strong> {patient.ubicacion}</p>
                                                <p><strong>Fecha:</strong> {patient.fecha}</p>
                                                <p><strong>Tiempo Estimado para el Objetivo:</strong> {patient.tiempo_objetivo} meses</p>
                                                <p><strong>Afecciones:</strong> {patient.afecciones}</p>
                                                <p><strong>Preferencias Alimenticias:</strong> {patient.preferencias}</p>
                                                <div className="text-right">
                                                <button onClick={() => handleEditToggle(patient.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"> Editar </button></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeletePatient(patient.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </AuthCheck>
    );
};

export default Patients;
