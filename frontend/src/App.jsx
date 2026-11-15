import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { isDemo, onDemo } from './api.js';
import { resetDemo } from './mockApi.js';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Teams from './pages/Teams.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [demo, setDemo] = useState(isDemo());
  useEffect(() => { onDemo(() => setDemo(true)); }, []);
  return (
    <>
      {demo && (
        <div className="demo">Demo mode: sample data is stored in your browser because the live Spring Boot API is not connected. Full source code is in the GitHub repository.{' '}
          <button onClick={() => { resetDemo(); window.location.reload(); }}>Reset data</button></div>
      )}
      <header className="nav">
        <b className="brand">Project &amp; Team Portal</b>
        <nav>
          <NavLink to="/" end>Projects</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
