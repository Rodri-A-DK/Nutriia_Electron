// src/components/PaymentInfo.js
import React from 'react';

const PaymentInfo = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Licencia necesaria</h1>
            <p>Para acceder a Nutria, necesitas una licencia activa.</p>
            <p>Contacta a soporte o realiza el pago para habilitar tu cuenta.</p>
            {/* Aquí puedes agregar un botón o enlace para la pasarela de pago en el futuro */}
        </div>
    );
};

export default PaymentInfo;
