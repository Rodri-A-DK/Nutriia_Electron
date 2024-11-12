import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AuthCheck from './AuthCheck';
import { jsPDF } from 'jspdf';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Diets = () => {
    const [dietText, setDietText] = useState('');
    const [loading, setLoading] = useState(false);
    const [licenseActive, setLicenseActive] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [calorieRequirement, setCalorieRequirement] = useState('');
    const [calorie1Requirement, setCalorie1Requirement] = useState('');
    const [dietRequirement, setDietRequirement] = useState('');
    const [userPrompt, setUserPrompt] = useState(''); // Estado para el prompt personalizado del usuario
    const [chat, setChat] = useState(null); // Estado para el chat de Gemini

    const navigate = useNavigate();
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    useEffect(() => {
        const fetchPatients = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                console.log('No hay usuario autenticado:', authError);
                return navigate('/login');
            }
            const { data: patientsData, error: patientsError } = await supabase
                .from('pacientes')
                .select('*')
                .eq('user_id', user.id);
            if (patientsError) {
                console.error('Error al obtener pacientes:', patientsError);
            } else {
                setPatients(patientsData);
            }
        };
        fetchPatients();

        // Iniciar el chat con el historial previo
        const initializeChat = async () => {
            const initialChat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "Quiero que seas mi herramienta de trabajo para mi consultorio de nutricionista. tu trabajo sera generarme dietas. Cuando generes una dieta, es sumamente importante que las calorías de todas las comidas sumadas den el requerimiento diario que se te va a especificar mas adelante. ajusta la dieta que armes para cumplir ese requerimiento. Así debería verse: **Total del día 1:** **X calorias en el dia - X gramos proteína - X gramos carbohidratos - X gramos grasas**." }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Entendido, doctor. Me aseguraré de que las calorías en las comidas sumen en total el requisito diario que se me especifique" }],
                    },
                    {
                        role: "user",
                        parts: [{ text: "Cuando te pida una dieta de 7 días, debes generarla de la siguiente forma:                  - Utiliza las proporciones calóricas precisas para cada macronutriente:                    - 9 kcal por cada gramo de grasa,                    - 4 kcal por cada gramo de proteína,                    - 4 kcal por cada gramo de carbohidrato.                  - Para cada comida, proporciona:                    - Cantidad en gramos,                    - Calorías,                    - Proteínas,                    - Carbohidratos,                    - Grasas.                  No incluyas recomendaciones, advertencias ni notas adicionales; solo responde con la dieta solicitada tal como se describe.                  Aquí tienes un ejemplo del formato que deseo:                  * **Avena:** 50 gramos - 190 kcal - 5 gramos proteína - 41 gramos carbohidratos - 3 gramos grasas                  * **Fruta:** 1 plátano mediano - 105 kcal - 1 gramo proteína - 27 gramos carbohidratos - 0 gramos grasas                  * **Leche descremada:** 250 ml - 100 kcal - 8 gramos proteína - 12 gramos carbohidratos - 0 gramos grasas                  * **Huevos:** 2 - 150 kcal - 12 gramos proteína - 1 gramo carbohidratos - 10 gramos grasas                  **Total desayuno:** **545 kcal - 26 gramos proteína - 81 gramos carbohidratos - 13 gramos grasas**" }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Claro que si doctor, estoy aquí para ayudarlo, no para aconsejarlo, ni cuestionar, seguire al pie de la letra" }],
                    },

                ],
            });
            setChat(initialChat);
        };
        
        initializeChat();
    }, [navigate]);

    const generateDiet = async () => {
        if (!chat) {
            console.log("Chat no inicializado aún");
            return;
        }
        if (!selectedPatient) {
            alert('Por favor, selecciona un paciente.');
            return;
        }
        if (!calorieRequirement || !calorie1Requirement || !dietRequirement) {
            alert('Por favor, ingresa todos los requerimientos.');
            return;
        }

        setLoading(true);

        try {
            // Crea el prompt basado en los datos del paciente y el prompt personalizado del usuario
            const prompt = `
            Genera una dieta de 7 dias La dieta debe contener "${calorie1Requirement}" comidas al día con un requerimiento obligatorio de ${calorieRequirement} calorias al dia. 
            teniendo en cuenta los siguientes datos:
            - nombre: ${selectedPatient.nombre}
            - epoca del año en que inicio la dieta: ${selectedPatient.fecha}
            - Ubicacion:  ${selectedPatient.ubicacion}
            - Afecciones: ${selectedPatient.afecciones}
            - Preferencias: ${selectedPatient.preferencias}
            `;

            // Envía el prompt al chat de Gemini
            const result = await chat.sendMessage(prompt);
            const aiMessage = await result.response.text();

            // Guarda la respuesta de la IA en dietText para mostrarla
            setDietText(aiMessage);
        } catch (error) {
            console.error('Error al generar la dieta:', error);
        }

        setLoading(false);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const margin = 10;
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 8;
        const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

        const lines = doc.splitTextToSize(dietText, doc.internal.pageSize.width - 2 * margin);
    
        let y = margin;
        lines.forEach((line, index) => {
            if (y + lineHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
    
        doc.save('mi-dieta.pdf');
    };

    const filteredPatients = patients.filter((patient) =>
        patient.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Generando dieta...</div>;
    }

    return (
        <AuthCheck setLicenseActive={setLicenseActive}>
            <div>
                <h1>Generador de Dietas</h1>
                {licenseActive ? (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar paciente..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        <div>
                            <h3>Selecciona un paciente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPatients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className={`border p-4 rounded cursor-pointer ${
                                            selectedPatient && selectedPatient.id === patient.id ? 'bg-blue-500 text-white' : 'bg-white'
                                        }`}
                                        onClick={() => setSelectedPatient(patient)}
                                    >
                                        <h4>{patient.nombre}</h4>
                                        <p>Altura: {patient.altura} cm, Peso: {patient.peso} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedPatient && (
                            <>
                                <div className="mt-4">
                                    <input
                                        type="number"
                                        value={calorieRequirement}
                                        onChange={(e) => setCalorieRequirement(e.target.value)}
                                        placeholder="Cantidad de calorías"
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="number"
                                        value={calorie1Requirement}
                                        onChange={(e) => setCalorie1Requirement(e.target.value)}
                                        placeholder="Cantidad de comidas"
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <select
                                        value={dietRequirement}
                                        onChange={(e) => setDietRequirement(e.target.value)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Selecciona un objetivo</option>
                                        <option value="definicion">Definición</option>
                                        <option value="volumen">Volumen</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <textarea
                                        value={userPrompt}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        placeholder="Escribe un detalle adicional para la dieta"
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <button onClick={generateDiet} className="bg-blue-500 text-white p-2 mt-4 rounded">
                                    Generar dieta
                                </button>

                                {dietText && (
                                    <div>
                                        <h2>Dieta Generada</h2>
                                        <div>{dietText}</div>
                                        <button onClick={exportToPDF} className="mt-4 bg-green-500 text-white p-2 rounded">
                                            Guardar como PDF
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p>No tienes licencia activa</p>
                )}
            </div>

        </AuthCheck>
    );
};

export default Diets;