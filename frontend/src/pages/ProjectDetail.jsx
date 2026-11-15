import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api, STATUSES } from '../api.js';
import Alert from '../components/Alert.jsx';
import Field from '../components/Field.jsx';

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const project = useFetch(`/projects/${id}`);
  const miles = useFetch(`/milestones?projectId=${id}`);
  const mentors = useFetch('/mentors');
  const [mentorId, setMentorId] = useState('');
  const [m, setM] = useState({ title: '', dueDate: '' });
  const [msg, setMsg] = useState({ type: 'success', text: '' });
  const say = (type, text) => setMsg({ type, text });

  async function run(fn, ok) {
    try { await fn(); say('success', ok); project.reload(); miles.reload(); } catch (e) { say('error', e.message); }
  }
  const addMilestone = (e) => {
    e.preventDefault();
    if (!m.title.trim()) return say('error', 'Milestone title is required');
    run(async () => { await api('/milestones', { method: 'POST', body: { ...m, dueDate: m.dueDate || null, project: { id: Number(id) } } }); setM({ title: '', dueDate: '' }); }, 'Milestone added');
  };
  const setStatus = (x, status) => run(() => api(`/milestones/${x.id}`, { method: 'PUT', body: { ...x, status } }), 'Status updated');
  const removeProject = async () => {
    if (!window.confirm('Delete this project and its milestones?')) return;
    try { await api(`/projects/${id}`, { method: 'DELETE' }); nav('/'); } catch (e) { say('error', e.message); }
  };

  const p = project.data;
  const list = miles.data || [];
  const done = list.filter((x) => x.status === 'COMPLETED').length;
  const pct = list.length ? Math.round((100 * done) / list.length) : 0;

  return (
    <section>
      <Link to="/">&larr; All projects</Link>
      <Alert>{project.error}</Alert><Alert type={msg.type}>{msg.text}</Alert>
      {p && (
        <>
          <h1>{p.title}</h1>
          <div className="note">
            <p>{p.description || 'No description.'}</p>
            <p><b>Domain:</b> {p.domain} &nbsp; <b>Skills:</b> {p.requiredSkills || '-'} &nbsp; <b>Status:</b> {p.status}</p>
            <p><b>Mentor:</b> {p.mentor ? `${p.mentor.name} (${p.mentor.department})` : 'Not allocated'}</p>
            <div className="toolbar">
              <select value={mentorId} onChange={(e) => setMentorId(e.target.value)} aria-label="Select mentor">
                <option value="">Select mentor...</option>{mentors.data?.map((x) => <option key={x.id} value={x.id}>{x.name} (max {x.maxTeams})</option>)}
              </select>
              <button className="btn" disabled={!mentorId} onClick={() => run(() => api(`/projects/${id}/mentor/${mentorId}`, { method: 'PUT' }), 'Mentor allocated')}>Allocate mentor</button>
              <button className="btn danger" onClick={removeProject}>Delete project</button>
            </div>
          </div>
          <h2>Milestones ({pct}% complete)</h2>
          <div className="bar"><div style={{ width: `${pct}%` }} /></div>
          <table>
            <thead><tr><th>Milestone</th><th>Due</th><th>Status</th><th /></tr></thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id}><td>{x.title}</td><td>{x.dueDate || '-'}</td>
                  <td><select value={x.status} onChange={(e) => setStatus(x, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td><button className="btn small danger" onClick={() => run(() => api(`/milestones/${x.id}`, { method: 'DELETE' }), 'Milestone deleted')}>Delete</button></td></tr>
              ))}
              {list.length === 0 && <tr><td colSpan="4">No milestones yet.</td></tr>}
            </tbody>
          </table>
          <form className="note form inline" onSubmit={addMilestone} noValidate>
            <Field label="New milestone"><input value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} /></Field>
            <Field label="Due date"><input type="date" value={m.dueDate} onChange={(e) => setM({ ...m, dueDate: e.target.value })} /></Field>
            <button className="btn" type="submit">Add</button>
          </form>
        </>
      )}
    </section>
  );
}
