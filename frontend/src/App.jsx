import Login from './pages/login.jsx';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register.jsx';
import Projects from './pages/projects.jsx';
import CreateProject from './pages/createproject.jsx';
import EditProject from './pages/editproject.jsx';
import ProjectStatus from './pages/projectstatus.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path={`${import.meta.env.VITE_BASE_PATH}/`} element={<Login />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/register`} element={<Register />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/projects`} element={<Projects />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/create`} element={<CreateProject />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/edit/:id`} element={<EditProject />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/status`} element={<ProjectStatus />} />
      <Route path={`${import.meta.env.VITE_BASE_PATH}/dashboard`} element={<Dashboard />} />
    </Routes>
  );
}

export default App;
