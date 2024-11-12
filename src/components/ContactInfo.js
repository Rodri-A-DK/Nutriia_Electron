// src/components/ContactInfo.js
import React from 'react';

const ContactInfo = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-4">Habilita tu acceso a Nutria</h2>
            <p className="text-gray-700 mb-6">
                Para habilitar tu cuenta, por favor contacta al administrador o realiza el pago correspondiente.
            </p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Contactar o Pagar
            </button>
        </div>
    );
   
};

export default ContactInfo;
