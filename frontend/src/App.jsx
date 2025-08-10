import { Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Projects from './pages/projects.jsx';
import CreateProject from './pages/createproject.jsx';
import EditProject from './pages/editproject.jsx';
import ProjectStatus from './pages/projectstatus.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/edit/:id" element={<EditProject />} />
        <Route path="/status" element={<ProjectStatus />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;