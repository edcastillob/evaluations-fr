import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import UserTable from '../Table/UserTable';
import EvaluationTable from '../Table/EvaluationTable';
import RegisterForm from '../components/users/Register';
import Statistics from '../components/Statistics/Statistics';
import ProtectedRoute from '../common/ProtectedRoute'; // Ajusta la ruta si es necesario
import EvaluationForm from '../components/Evaluation/Evaluation';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Statistics />} allowedRoles={['Admin', 'Manager']} />} />
          <Route path="/admin/users" element={<ProtectedRoute element={<UserTable />} allowedRoles={['Admin', 'Manager']} />} />
          <Route path="/admin/users/create" element={<ProtectedRoute element={<RegisterForm />} allowedRoles={['Admin']} />} />
          <Route path="/admin/users/edit/:id" element={<ProtectedRoute element={<div>Editar Usuario - Formulario</div>} allowedRoles={['Admin']} />} />
          <Route path="/admin/evaluations" element={<ProtectedRoute element={<EvaluationTable />} allowedRoles={['Admin', 'Manager']} />} />
          <Route path="/admin/evaluations/create" element={<ProtectedRoute element={<EvaluationForm />} allowedRoles={['Admin']} />} />
          <Route path="/admin/evaluations/edit/:id" element={<ProtectedRoute element={<div>Editar Evaluación - Formulario</div>} allowedRoles={['Admin']} />} />
          <Route path="/admin/statistics" element={<ProtectedRoute element={<Statistics />} allowedRoles={['Admin', 'Manager']} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
