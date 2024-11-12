import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo.png'; // Ajusta la ruta según la ubicación de tu logo

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const storedSidebarState = localStorage.getItem('sidebarOpen');
        if (storedSidebarState !== null) {
            setIsOpen(storedSidebarState === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', isOpen);
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (

    <div
    
        ref={sidebarRef}
        className={`block top-0 left-0 flex-col h-full transition-all duration-300 ${
            isOpen ? 'bg-gray-800 text-white w-64' : 'bg-gray-400 text-transparent w-10'
        }`}
    >
        
        <button
            onClick={toggleSidebar}
            className="flex top-0 left-0 flex-col h-10 w-10 "
        >
            <img src={logo} alt="Logo" className={`top-10 left-10 w-30 h-full ${isOpen ? '' : ''}`} />
        </button>
        <div className={`mt-4 ${isOpen ? 'block' : 'hidden'}`}>
            <Link to="/main" className="p-4 hover:bg-gray-700 block">Inicio</Link>
            <Link to="/add-patient" className="p-4 hover:bg-gray-700 block">Agregar Paciente</Link>
            <Link to="/patients" className="p-4 hover:bg-gray-700 block">Pacientes</Link>
            <Link to="/diets" className="p-4 hover:bg-gray-700 block">Dietas</Link>
        </div>

    </div>  
    

    );
    
};

export default Sidebar;
