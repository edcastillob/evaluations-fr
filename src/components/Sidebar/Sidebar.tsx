import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isEvaluationsOpen, setIsEvaluationsOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="relative p-6 bg-gray-800 border-b border-gray-700 flex flex-col items-center cursor-pointer">
        <Link 
          to="/dashboard-admin/admin/statistics" 
          className="absolute inset-0 z-10"
        />
        <img src="/dashboard-admin.png" alt="Evaluaciones" className="w-16 h-16 bg-white rounded-full" />
        <h2 className="text-2xl font-extrabold mt-2">Panel Admin</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="py-4 px-6">
          <button
            className="w-full text-left flex items-center justify-between text-sm font-semibold bg-gray-600 text-gray-100 hover:bg-gray-700 px-3 py-1 rounded-lg transition-all duration-300"
            onClick={() => setIsUsersOpen(!isUsersOpen)}
          >
            Usuarios
            {isUsersOpen ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
          </button>
          <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isUsersOpen ? 'max-h-40' : 'max-h-0'}`}>
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/dashboard-admin/admin/users" className="block text-gray-200 hover:text-gray-100 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 no-underline">Ver todos los usuarios</Link>
              </li>
              <li>
                <Link to="/dashboard-admin/admin/users/create" className="block text-gray-200 hover:text-gray-100 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 no-underline">Crear usuario</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-4 px-6">
          <button
            className="w-full text-left flex items-center justify-between text-sm font-semibold bg-gray-600 text-gray-100 hover:bg-gray-700 px-3 py-1 rounded-lg transition-all duration-300"
            onClick={() => setIsEvaluationsOpen(!isEvaluationsOpen)}
          >
            Evaluaciones
            {isEvaluationsOpen ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
          </button>
          <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isEvaluationsOpen ? 'max-h-40' : 'max-h-0'}`}>
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/dashboard-admin/admin/evaluations" className="block text-gray-200 hover:text-gray-100 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 no-underline">Ver todas las evaluaciones</Link>
              </li>
              <li>
                <Link to="/dashboard-admin/admin/evaluations/create" className="block text-gray-200 hover:text-gray-100 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 no-underline">Crear evaluación</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
