import React from 'react';

const DietTable = ({ dietData }) => {
    return (
        <table className="table-auto border-collapse w-full">
            <thead>
                <tr>
                    <th className="border p-2">Comida</th>
                    <th className="border p-2">Alimentos</th>
                    <th className="border p-2">Cantidad (g)</th>
                    <th className="border p-2">Calorías</th>
                    <th className="border p-2">Proteína (g)</th>
                    <th className="border p-2">Carbohidratos (g)</th>
                    <th className="border p-2">Grasas (g)</th>
                    <th className="border p-2">Total (kcal)</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(dietData).map((meal) => (
                    <tr key={meal}>
                        <td className="border p-2">{meal}</td>
                        <td className="border p-2">
                            {dietData[meal].foods.map((food) => (
                                <div key={food.nombre}>{food.nombre} ({food.cantidad}g)</div>
                            ))}
                        </td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">{dietData[meal].proteina.toFixed(2) || '-'}</td>
                        <td className="border p-2">{dietData[meal].carbohidratos.toFixed(2) || '-'}</td>
                        <td className="border p-2">{dietData[meal].grasas.toFixed(2) || '-'}</td>
                        <td className="border p-2">{dietData[meal].totalCalorias.toFixed(2) || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DietTable;