import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  ocupation: string;
  active: boolean;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState<Omit<User, '_id' | 'email'>>({
    first_name: '',
    last_name: '',
    role: '',
    ocupation: '',
    active: false
  });
  const [roles] = useState([
    { label: 'Empleado', value: 'Employee' },
    { label: 'Gerente', value: 'Manager' },
    { label: 'Administrador', value: 'Admin' },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseURL = import.meta.env.VITE_BACKEND_URL_SERVER;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in local storage');
        }

        const response = await axios.get(`${baseURL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching users:', error.message);
          setError('Error fetching users. Please try again later.');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred.');
        }
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setUpdatedUser({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      ocupation: user.ocupation,
      active: user.active
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, ariaChecked, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (ariaChecked as unknown as boolean) : value
    }));
  };
  

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL_SERVER;
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }

      if (!selectedUser?._id) return;

      await axios.put(`${baseURL}/api/user/${selectedUser._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      const response = await axios.get(`${baseURL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setIsModalOpen(false);
      Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating user:', error.message);
        Swal.fire('Error!', 'No se pudo actualizar el usuario. Inténtalo de nuevo.', 'error');
      } else {
        console.error('Unexpected error:', error);
        Swal.fire('Error!', 'Error inesperado. Inténtalo de nuevo.', 'error');
      }
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el usuario?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Delete user', id);
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    });
  };

  return (
    <div className="p-8">
      {error && <div className="mb-4 p-4 bg-red-100 text-red-800">{error}</div>}
      <div className="flex items-center mb-6">
        <img src="/users.png" alt="Users" className="w-8 h-8 mr-2" />
        <h2 className="text-3xl font-bold text-gray-800">Usuarios</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Ocupación</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-800 border">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 border">{user.email}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 border">{user.role}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 border">{user.ocupation}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 border text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="mr-4 text-blue-950 hover:text-blue-600"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-blue-950 hover:text-blue-600"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <img src="/edit-user.png" alt="Edit User" className="mx-auto mb-4 w-16 h-16" />
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={updatedUser.first_name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                  Apellido:
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={updatedUser.last_name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Rol:
                </label>
                <select
                  id="role"
                  name="role"
                  value={updatedUser.role}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ocupation">
                  Ocupación:
                </label>
                <input
                  type="text"
                  id="ocupation"
                  name="ocupation"
                  value={updatedUser.ocupation}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={updatedUser.active}
                    onChange={handleInputChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Activo</span>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
