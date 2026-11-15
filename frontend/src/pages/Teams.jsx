import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { api } from '../api.js';
import Alert from '../components/Alert.jsx';
import Field from '../components/Field.jsx';

export default function Teams() {
  const teams = useFetch('/teams');
  const students = useFetch('/students');
  const projects = useFetch('/projects');
  const [msg, setMsg] = useState({ type: 'success', text: '' });
  const [team, setTeam] = useState({ name: '', maxSize: 4, projectId: '' });
  const [stu, setStu] = useState({ name: '', email: '', skills: '' });
  const [pick, setPick] = useState({});
  const [sugg, setSugg] = useState({ studentId: '', list: null });
  const say = (type, text) => setMsg({ type, text });
  const refresh = () => { teams.reload(); students.reload(); };
  async function run(fn, ok) { try { await fn(); say('success', ok); refresh(); } catch (e) { say('error', e.message); } }

  const createTeam = (e) => {
    e.preventDefault();
    if (!team.name.trim()) return say('error', 'Team name is required');
    if (team.maxSize < 2 || team.maxSize > 6) return say('error', 'Team size must be between 2 and 6');
    run(() => api('/teams', { method: 'POST', body: { name: team.name, maxSize: Number(team.maxSize), project: team.projectId ? { id: Number(team.projectId) } : null } }).then(() => setTeam({ name: '', maxSize: 4, projectId: '' })), 'Team created');
  };
  const register = (e) => {
    e.preventDefault();
    if (!stu.name.trim() || !/^\S+@\S+\.\S+$/.test(stu.email)) return say('error', 'Enter a name and a valid email');
    run(() => api('/students', { method: 'POST', body: stu }).then(() => setStu({ name: '', email: '', skills: '' })), 'Student registered');
  };
  async function suggest(id) {
    setSugg({ studentId: id, list: null });
    if (!id) return;
    try { setSugg({ studentId: id, list: await api(`/students/${id}/suggestions`) }); } catch (e) { say('error', e.message); }
  }
  const free = (students.data || []).filter((s) => !s.team);

  return (
    <section>
      <h1>Teams</h1>
      <Alert type={msg.type}>{msg.text}</Alert><Alert>{teams.error}</Alert>
      <div className="grid">
        {teams.data?.map((t) => (
          <div key={t.id} className="note card">
            <h3>{t.name}</h3>
            <p>{t.memberCount} / {t.maxSize} members</p>
            <small>Project: {t.project ? t.project.title : 'None yet'}</small>
            <p>{(students.data || []).filter((s) => s.team?.id === t.id).map((s) => s.name).join(', ')}</p>
            <div className="toolbar">
              <select value={pick[t.id] || ''} onChange={(e) => setPick({ ...pick, [t.id]: e.target.value })} aria-label={`Student to join ${t.name}`}>
                <option value="">Add student...</option>{free.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="btn small" disabled={!pick[t.id]} onClick={() => run(() => api(`/teams/${t.id}/join/${pick[t.id]}`, { method: 'POST' }), 'Student joined the team')}>Join</button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid">
        <form className="note form" onSubmit={createTeam} noValidate>
          <h3>Create team</h3>
          <Field label="Team name"><input value={team.name} onChange={(e) => setTeam({ ...team, name: e.target.value })} /></Field>
          <Field label="Max size (2-6)"><input type="number" value={team.maxSize} onChange={(e) => setTeam({ ...team, maxSize: e.target.value })} /></Field>
          <Field label="Project (optional)"><select value={team.projectId} onChange={(e) => setTeam({ ...team, projectId: e.target.value })}>
            <option value="">None</option>{projects.data?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
          <button className="btn" type="submit">Create</button>
        </form>
        <form className="note form" onSubmit={register} noValidate>
          <h3>Register student</h3>
          <Field label="Name"><input value={stu.name} onChange={(e) => setStu({ ...stu, name: e.target.value })} /></Field>
          <Field label="Email"><input value={stu.email} onChange={(e) => setStu({ ...stu, email: e.target.value })} /></Field>
          <Field label="Skills (comma separated)"><input value={stu.skills} onChange={(e) => setStu({ ...stu, skills: e.target.value })} /></Field>
          <button className="btn" type="submit">Register</button>
        </form>
        <div className="note form">
          <h3>Suggested teams</h3>
          <p>Calls the matching microservice.</p>
          <select value={sugg.studentId} onChange={(e) => suggest(e.target.value)} aria-label="Student for suggestions">
            <option value="">Choose a student...</option>{free.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {sugg.list && sugg.list.length === 0 && <p>No overlapping skills found.</p>}
          {sugg.list?.map((s) => <p key={s.teamId}><b>{s.name}</b> - match {Math.round(s.score * 100)}%</p>)}
        </div>
      </div>
    </section>
  );
}
