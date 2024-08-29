import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Question {
  _id: number;
  name: string;
  points: number;
}

const SuccessModal: React.FC<{ employee: { first_name: string; last_name: string }; onClose: () => void }> = ({ employee, onClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose();
    navigate('/dashboard-admin/admin/evaluations');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <img src="/evaluation-ok.png" alt="Success" className="w-20 h-20 mb-4" />
          <p className="text-xl font-semibold text-center mb-4">
            ¡Evaluación registrada con éxito!
          </p>
          <p className="text-md text-gray-600 text-center mb-6">
            Gracias por contribuir al crecimiento profesional de {employee.first_name} {employee.last_name}.
          </p>
          <button
            onClick={handleOkClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const EvaluationForm: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [evaluatedEmployee, setEvaluatedEmployee] = useState<{ first_name: string; last_name: string } | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';
  const baseUrl = import.meta.env.VITE_BACKEND_URL_SERVER;

  useEffect(() => {
    axios.get(`${baseUrl}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setEmployees(response.data);
    })
    .catch(() => {
      toast.error('Error al cargar empleados');
    });

    // Fetch questions
    axios.get(`${baseUrl}/api/evaluation/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setQuestions(response.data);
    })
    .catch(() => {
      toast.error('Error al cargar preguntas');
    });
  }, [token]);

  const handleChange = (category: string, _questionId: number, points: number) => {
    setAnswers(prev => ({
      ...prev,
      [category]: points 
    }));
  };

  const handleSubmit = () => {
    if (!selectedEmployee) {
      toast.warning('Selecciona un empleado');
      return;
    }

    const selectedEmployeeData = employees.find(emp => emp._id === selectedEmployee);

    const evaluationData = {
      id_user: selectedEmployee, 
      id_technical_skills: answers['technical_skills'] || 0,
      id_comunication: answers['comunication'] || 0,
      id_teamwork: answers['teamwork'] || 0,
      id_time_management: answers['time_management'] || 0,
      id_adaptability: answers['adaptability'] || 0,
      id_soft_skills: answers['soft_skills'] || 0,
      id_evaluator: user.id
    };

    axios.post(`${baseUrl}/api/evaluation`, evaluationData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setEvaluatedEmployee(selectedEmployeeData || { first_name: '', last_name: '' });
      setShowModal(true);
      setSelectedEmployee(''); 
      setAnswers({}); 
    })
    .catch(() => {
      toast.error('Error al enviar la evaluación');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center mb-8">
        <img src="/evaluation.png" alt="Evaluación" className="w-16 h-16 mr-4" />
        <h1 className="text-2xl font-bold text-gray-800">Evaluación de Empleados</h1>
      </div>

      <div className="mb-6">
        <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700">
          Selecciona el empleado a evaluar
        </label>
        <select
          id="employeeSelect"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)} 
          className="mt-2 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccione un empleado</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee._id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(questions).map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">{category.replace('_', ' ')}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una pregunta
            </label>
            <select
              onChange={(e) => {
                const selectedQuestion = questions[category].find((q: Question) => q._id === parseInt(e.target.value));
                handleChange(category, selectedQuestion?._id || 0, selectedQuestion?.points || 0);
              }}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar pregunta</option>
              {questions[category].map((question: Question) => (
                <option key={question._id} value={question._id}>
                  {question.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md mt-4 hover:bg-blue-700 transition-all"
      >
        Enviar Evaluación
      </button>

      {showModal && evaluatedEmployee && (
        <SuccessModal
          employee={evaluatedEmployee}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EvaluationForm;
