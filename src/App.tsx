import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Layout from './Layout';
import Home from './Home/Home';
import RegisterForm from './components/users/Register';
import LoginForm from './components/users/Login';
import Dashboard from './Dashboard/Admin';
import EmployeeProfile from './components/users/employee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/*" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="employee" element={<EmployeeProfile />} />
          <Route path="dashboard-admin/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
