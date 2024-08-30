import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Obtener datos del localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAuthenticated = token && user;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-blue-900 text-white p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link to="/">
            <img
              className="h-8 w-8 mr-2 cursor-pointer"
              src="/ec.png"
              alt="Logo"
            />
          </Link>
          <span className="font-semibold text-xl tracking-tight">Evaluaciones</span>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className={`w-full block lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Link
              to="/home"
              className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
            >
              Inicio
            </Link>
            <Link
              to="/documentation"
              className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
            >
              Documentación
            </Link>
            {isAuthenticated ? (
              <>
                {user.role === 'Admin' && (
                  <Link
                    to="/dashboard-admin"
                    className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
                  >
                    Panel Admin
                  </Link>
                )}
                <span className="text-sm font-semibold">
                  {user.first_name} {user.last_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
                >
                  Registro
                </Link>
                <Link
                  to="/login"
                  className="inline-block text-sm px-4 py-2 leading-none border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white font-semibold rounded transition duration-300 ease-in-out no-underline"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
