import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import Results from './pages/Results';
import Test from './pages/Test';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<RegistrationForm />} />
        <Route path="/questions" element={<Test />} />
        <Route path="/submit" element={<Results />} />
        </Routes>
    </div>
  );
}

export default App;
