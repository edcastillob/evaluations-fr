import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const navigate = useNavigate(); 

  const onSubmit = async (data: any) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify({
          first_name: responseData.first_name,
          last_name: responseData.last_name,
          email: responseData.email,
          role: responseData.role,
          id: responseData._id,
        }));
        toast.success('Inicio de sesión exitoso');
        reset();

        // Redireccionar según el rol del usuario
        const userRole = responseData.role;
        if (userRole === 'Admin') {
          navigate('/dashboard-admin');
        } else if (userRole === 'Employee') {
          navigate('/employee');
        } else {
          navigate('/'); // Redirigir a la página de inicio si el rol no coincide
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Error desconocido';
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toast.error('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm">
        {/* Formulario */}
        <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mb-8">
            {/* Icono de login */}
            <img src="/login.png" alt="Login Icon" className="mx-auto" style={{ width: 64, height: 64 }} />
            <h2 className="text-2xl font-bold text-gray-700 mt-4">Iniciar Sesión</h2>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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
              <p className="text-red-500 text-xs italic">{errors.email.message as string}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              {...register('password', {
                required: 'Este campo es obligatorio',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password.message as string}</p>
            )}
          </div>

          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
