
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image: File | null;
  ocupation: string;
  department: string;
};

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, 
    reset,
  } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    const formData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      ocupation: data.ocupation || 'Por actualizar',
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Registro exitoso!');
        reset(); 
        setImagePreview(null); 
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      toast.error('Error en la conexión con el servidor.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue('image', file); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="w-full max-w-lg bg-white p-8 shadow-md rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mt-4">Registro de usuarios</h2>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first_name">
              Nombres
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.first_name ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
              id="first_name"
              type="text"
              placeholder="Nombres"
              {...register('first_name', { required: 'Este campo es obligatorio' })}
            />
            {errors.first_name && <p className="text-red-500 text-xs italic">{errors.first_name.message}</p>}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="last_name">
              Apellidos
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.last_name ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
              id="last_name"
              type="text"
              placeholder="Apellidos"
              {...register('last_name', { required: 'Este campo es obligatorio' })}
            />
            {errors.last_name && <p className="text-red-500 text-xs italic">{errors.last_name.message}</p>}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-5/6 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Correo electrónico"
              {...register('email', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Formato de email no válido',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-5/6 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
              id="password"
              type="password"
              placeholder="Contraseña"
              {...register('password', { required: 'Este campo es obligatorio' })}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-5/6 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="image">
              Imagen de perfil
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-3 h-20 w-20 rounded-full object-cover" />}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="ocupation">
              Ocupación
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="ocupation"
              type="text"
              placeholder="Ocupación"
              {...register('ocupation')}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 ml-16">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="department">
              Departamento
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="department"
              type="text"
              placeholder="Departamento"
              {...register('department')}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Registrarse
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;
