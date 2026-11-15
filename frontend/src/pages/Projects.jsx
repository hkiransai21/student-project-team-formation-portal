import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { DOMAINS } from '../api.js';
import ProjectForm from '../components/ProjectForm.jsx';
import Alert from '../components/Alert.jsx';

export default function Projects() {
  const [q, setQ] = useState('');
  const [domain, setDomain] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const { data, error, loading, reload } = useFetch(`/projects?q=${encodeURIComponent(q)}&domain=${encodeURIComponent(domain)}`);

  return (
    <section>
      <h1>Project Ideas</h1>
      <div className="toolbar">
        <input placeholder="Search by title..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search projects" />
        <select value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Filter by domain">
          <option value="">All domains</option>{DOMAINS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <button className="btn" onClick={() => setShow(!show)}>{show ? 'Close form' : '+ New idea'}</button>
      </div>
      <Alert type="success">{msg}</Alert><Alert>{error}</Alert>
      {show && <ProjectForm onSaved={(m) => { setMsg(m); setShow(false); reload(); }} />}
      {loading && <p>Loading...</p>}
      {data && data.length === 0 && <p>No projects match your search.</p>}
      <div className="grid">
        {data?.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`} className="note card">
            <span className={`tag ${p.status}`}>{p.status}</span>
            <h3>{p.title}</h3>
            <p>{p.domain} {p.requiredSkills && `| ${p.requiredSkills}`}</p>
            <small>Mentor: {p.mentor ? p.mentor.name : 'Not allocated'}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
