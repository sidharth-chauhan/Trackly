import Login from './pages/login.jsx'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/register.jsx';
import Projects from './pages/projects.jsx';
import CreateProject from './pages/createproject.jsx';
import ProjectStatus from './pages/projectstatus.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />}
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/create" element={<CreateProject />} />
      <Route path="/edit/:id" element={<CreateProject />} />
      <Route path="/status" element={<ProjectStatus />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    
  );
}

export default App;
