import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';

interface Evaluation {
  id_technical_skills: number;
  id_comunication: number;
  id_teamwork: number;
  id_time_management: number;
  id_adaptability: number;
  id_soft_skills: number;
  id_evaluator: {
    first_name: string;
    last_name: string;
  };
}

interface EmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  active: boolean;
  evaluations?: Evaluation[];
  feedbacks?: { comment: string }[];
}

const EmployeeProfile: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';
  const baseUrl = import.meta.env.VITE_BACKEND_URL_SERVER;

  useEffect(() => {
    axios.get(`${baseUrl}/api/reports/employee/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setEmployee(response.data);
      })
      .catch(() => {
        toast.error('Error al cargar la información del empleado');
      });
  }, [token, user.id]);

  const calculateRanking = (evaluations: Evaluation[]) => {
    return evaluations.reduce((acc, evaluation) => acc +
      evaluation.id_technical_skills +
      evaluation.id_comunication +
      evaluation.id_teamwork +
      evaluation.id_time_management +
      evaluation.id_adaptability +
      evaluation.id_soft_skills, 0);
  };

  const renderRankingSummary = (points: number) => {
    if (points >= 27) {
      return 'Excelente desempeño en habilidades generales.';
    } else if (points >= 18) {
      return 'Buen desempeño, pero hay áreas que pueden mejorar.';
    } else if (points >= 10) {
      return 'Se necesita trabajar en varias áreas clave.';
    } else {
      return 'Desempeño bajo, se necesita mejora en casi todas las áreas.';
    }
  };

  const renderStarRating = (points: number) => {
    if (points >= 27) {
      return 5;
    } else if (points >= 23) {
      return 4;
    } else if (points >= 17) {
      return 3;
    } else if (points >= 14) {
      return 2;
    } else if (points >= 5) {
      return 1;
    } else {
      return 0;
    }
  };

  if (!employee) {
    return <p>Cargando información del empleado...</p>;
  }

  const totalPoints = employee.evaluations ? calculateRanking(employee.evaluations) : 0;
  const starRating = renderStarRating(totalPoints);
  const rankingSummary = renderRankingSummary(totalPoints);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-8">
        <img src="/user-tec.png" alt="Avatar" className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg" />
      </div>

      {/* Sección Datos Personales */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Datos Personales</h2>
        <div className="text-sm text-gray-700">
          <p><strong>Nombres y Apellidos:</strong> {employee.first_name} {employee.last_name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Ocupación:</strong> {employee.role}</p>
        </div>
      </div>

      {/* Sección Datos de la Cuenta */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Datos de la Cuenta</h2>
        <div className="text-sm text-gray-700">
          <p><strong>Estatus:</strong> {employee.active ? 'Cuenta Activa' : 'Cuenta Inactiva'}</p>
          <p><strong>Rol del Usuario:</strong> {employee.role}</p>
        </div>
      </div>

      {/* Sección Evaluaciones */}
      {employee.evaluations && employee.evaluations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Evaluaciones</h2>
          <div className="text-sm text-gray-700 mb-4">
            <p><strong>Su ranking es:</strong></p>
            <StarRatings
              rating={starRating}
              starRatedColor="blue"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
            <p>{rankingSummary}</p>
            {employee.evaluations.map((evaluation, index) => (
              <div key={index}>
                <p><strong>Evaluado por:</strong> {evaluation.id_evaluator.first_name} {evaluation.id_evaluator.last_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Feedbacks */}
      {employee.feedbacks && employee.feedbacks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
          <div className="text-sm text-gray-700">
            {employee.feedbacks.map((feedback, index) => (
              <p key={index} className="mb-2">{feedback.comment}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
