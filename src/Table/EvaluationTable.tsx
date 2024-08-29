import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const calculateStars = (totalPoints: number): number => {
  if (totalPoints >= 27) return 5;
  if (totalPoints >= 23) return 4;
  if (totalPoints >= 17) return 3;
  if (totalPoints >= 14) return 2;
  return 1;
};

const EvaluationTable: React.FC = () => {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [skillsOptions, setSkillsOptions] = useState<any[]>([]);
  const [communicOptions, setCommunicOptions] = useState<any[]>([]);
  const [teamworkOptions, setTeamworkOptions] = useState<any[]>([]);
  const [timeOptions, setTimeOptions] = useState<any[]>([]);
  const [adaptabilityOptions, setAdaptabilityOptions] = useState<any[]>([]);
  const [softSkillsOptions, setSoftSkillsOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/view-evaluations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    };

    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSkillsOptions(response.data.technical_skills || []);
        setCommunicOptions(response.data.comunication || []);
        setTeamworkOptions(response.data.teamwork || []);
        setTimeOptions(response.data.time_management || []);
        setAdaptabilityOptions(response.data.adaptability || []);
        setSoftSkillsOptions(response.data.soft_skills || []);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchEvaluations();
    fetchOptions();
  }, []);

  const handleEdit = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar la evaluación?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Obtener el token desde el localStorage
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error('No se encontró el token de autenticación');
          }
  
          // Realizar la petición DELETE a la API
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          // Verificar si la eliminación fue exitosa
          if (response.ok) {
            Swal.fire('Eliminado!', 'La evaluación ha sido eliminada.', 'success');
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/view-evaluations`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      
            setEvaluations(response.data);
          } else {
            const errorData = await response.json();
            Swal.fire('Error', errorData.message || 'Hubo un problema al eliminar la evaluación.', 'error');
          }
        } catch (error) {
          Swal.fire( 'Hubo un problema al eliminar la evaluación.', 'error');
        }
      }
    });
  };
  

  const handleModalSave = async () => {
    if (selectedEvaluation) {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}'); 
        const evaluatorId = user.id;
  
        // Actualizar la evaluación en el backend
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/${selectedEvaluation._id}`,
          {
            ...selectedEvaluation,
            id_user: selectedEvaluation.id_user._id,
            id_evaluator: evaluatorId,
            id_technical_skills: Number(selectedEvaluation.id_technical_skills),
            id_comunication: Number(selectedEvaluation.id_comunication),
            id_teamwork: Number(selectedEvaluation.id_teamwork),
            id_time_management: Number(selectedEvaluation.id_time_management),
            id_adaptability: Number(selectedEvaluation.id_adaptability),
            id_soft_skills: Number(selectedEvaluation.id_soft_skills),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_SERVER}/api/evaluation/view-evaluations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setEvaluations(response.data);
  
        setShowModal(false);
      } catch (error) {
        console.error('Error updating evaluation:', error);
      }
    }
  };
  

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <img src="/evaluations.png" alt="Evaluaciones" className="w-8 h-8 mr-2" />
        <h2 className="text-3xl font-bold text-gray-800">Evaluaciones</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Empleado</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Puntuación</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Evaluado por</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation, index) => {
              const totalPoints = (evaluation.id_technical_skills || 0) +
                                  (evaluation.id_comunication || 0) +
                                  (evaluation.id_teamwork || 0) +
                                  (evaluation.id_time_management || 0) +
                                  (evaluation.id_adaptability || 0) +
                                  (evaluation.id_soft_skills || 0);
              const stars = calculateStars(totalPoints);
              
              return (
                <tr
                  key={evaluation._id}
                  className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 border">
                    {evaluation.id_user?.first_name} {evaluation.id_user?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 border text-center">
                    <StarRatings
                      rating={stars}
                      starRatedColor="darkblue"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 border">
                    {evaluation.id_evaluator?.first_name} {evaluation.id_evaluator?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 border text-center">
                    <button
                      onClick={() => handleEdit(evaluation)}
                      className="mr-4 text-blue-950 hover:text-blue-600"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(evaluation._id)}
                      className="text-blue-950 hover:text-blue-600"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  {showModal && selectedEvaluation && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <img
          src="/edit-evaluation.png"
          alt="Edit Evaluation"
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
      
      {/* Título */}
      <h2 className="text-2xl font-bold text-center mb-2">Editar Evaluación</h2>
      
      {/* Subtítulo con el nombre del empleado */}
      <p className="text-lg font-semibold text-center text-gray-600 mb-6">
        {selectedEvaluation.id_user?.first_name} {selectedEvaluation.id_user?.last_name}
      </p>

      <form>
        {/* Habilidades Técnicas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Habilidades Técnicas</label>
          <select
            value={selectedEvaluation.id_technical_skills || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_technical_skills: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {skillsOptions.length ? skillsOptions.map(skill => (
              <option key={skill.id} value={skill.points}>{skill.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Comunicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Comunicación</label>
          <select
            value={selectedEvaluation.id_comunication || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_comunication: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {communicOptions.length ? communicOptions.map(comm => (
              <option key={comm.id} value={comm.points}>{comm.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Trabajo en Equipo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Trabajo en Equipo</label>
          <select
            value={selectedEvaluation.id_teamwork || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_teamwork: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {teamworkOptions.length ? teamworkOptions.map(team => (
              <option key={team.id} value={team.points}>{team.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Gestión del Tiempo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gestión del Tiempo</label>
          <select
            value={selectedEvaluation.id_time_management || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_time_management: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {timeOptions.length ? timeOptions.map(time => (
              <option key={time.id} value={time.points}>{time.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Adaptabilidad */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Adaptabilidad</label>
          <select
            value={selectedEvaluation.id_adaptability || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_adaptability: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {adaptabilityOptions.length ? adaptabilityOptions.map(adapt => (
              <option key={adapt.id} value={adapt.points}>{adapt.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Habilidades Blandas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Habilidades Blandas</label>
          <select
            value={selectedEvaluation.id_soft_skills || ''}
            onChange={(e) => setSelectedEvaluation({ ...selectedEvaluation, id_soft_skills: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {softSkillsOptions.length ? softSkillsOptions.map(soft => (
              <option key={soft.id} value={soft.points}>{soft.name}</option>
            )) : <option value="">Cargando...</option>}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleModalSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-2 ml-4 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default EvaluationTable;
