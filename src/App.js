// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import AddPatient from './components/AddPatient';
import Patients from './components/Patients';
import Diets from './components/Diets';
import Login from './components/Login';
import ContactInfo from './components/ContactInfo';
import AuthCheck from './components/AuthCheck';
import ComprarLicencia from './components/ComprarLicencia';
import Callback from './components/Callback';

const App = () => {
    const [user, setUser] = useState(null);
    const [licenseActive, setLicenseActive] = useState(false);

    return (
        <Router>
            <AuthCheck setLicenseActive={setLicenseActive}>
                <div className="flex h-screen">
                    <Sidebar isOpen={licenseActive} />
                    <div className="flex-grow p-6 overflow-y-auto bg-gray-400">
                        <Routes>
                            <Route path="/callback" element={<Callback />} />
                            <Route path="/" element={<Login />} />
                            <Route path="/main" element={<Main />} />
                            <Route path="/add-patient" element={<AddPatient />} />
                            <Route path="/patients" element={<Patients />} />
                            <Route path="/diets" element={<Diets />} />
                            <Route path="/contact-info" element={<ContactInfo />} />
                            <Route path="/comprar-licencia" element={<ComprarLicencia />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/ParamentComponent" element={<Login />} /> 
                        </Routes>
                    </div>
                </div>
            </AuthCheck>
        </Router>
    );
};

export default App;