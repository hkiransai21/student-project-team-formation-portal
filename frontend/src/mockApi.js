// In-browser stand-in for the Spring Boot API. Used automatically when the real backend is unreachable.
// It mirrors the same endpoints, validation and business rules, and keeps data in localStorage.
const KEY = 'portal-demo-v1';
const seed = () => ({
  seq: { project: 5, team: 4, student: 9, milestone: 6 },
  mentors: [{ id: 1, name: 'Dr. Meena K', department: 'CSE', maxTeams: 2 }, { id: 2, name: 'Dr. Arun S', department: 'IT', maxTeams: 3 }, { id: 3, name: 'Prof. Lakshmi R', department: 'AI&DS', maxTeams: 2 }],
  projects: [
    { id: 1, title: 'Smart Attendance System', description: 'Face-recognition based attendance for classrooms.', domain: 'AI', requiredSkills: 'Python,OpenCV', status: 'OPEN', mentorId: 1 },
    { id: 2, title: 'Campus Helpdesk Portal', description: 'Ticketing portal for campus maintenance requests.', domain: 'Web', requiredSkills: 'React,Spring Boot', status: 'ACTIVE', mentorId: 2 },
    { id: 3, title: 'Crop Disease Detector', description: 'Detect crop diseases from leaf images.', domain: 'AI', requiredSkills: 'Python,TensorFlow', status: 'OPEN', mentorId: 1 },
    { id: 4, title: 'Event Registration App', description: 'Register and manage club events.', domain: 'Web', requiredSkills: 'React,Java,MySQL', status: 'OPEN', mentorId: null }],
  teams: [{ id: 1, name: 'Team Alpha', maxSize: 4, projectId: 1 }, { id: 2, name: 'Team Beta', maxSize: 4, projectId: 2 }, { id: 3, name: 'Team Gamma', maxSize: 3, projectId: null }],
  students: [
    { id: 1, name: 'Asha N', email: 'asha@example.edu', skills: 'Python,OpenCV', teamId: 1 }, { id: 2, name: 'Bala R', email: 'bala@example.edu', skills: 'Python,SQL', teamId: 1 },
    { id: 3, name: 'Charan M', email: 'charan@example.edu', skills: 'React,CSS', teamId: 2 }, { id: 4, name: 'Divya S', email: 'divya@example.edu', skills: 'Java,Spring Boot', teamId: 2 },
    { id: 5, name: 'Elan K', email: 'elan@example.edu', skills: 'TensorFlow,Python', teamId: 3 }, { id: 6, name: 'Fathima A', email: 'fathima@example.edu', skills: 'React,Java', teamId: null },
    { id: 7, name: 'Girish P', email: 'girish@example.edu', skills: 'Python,TensorFlow', teamId: null }, { id: 8, name: 'Harini V', email: 'harini@example.edu', skills: 'MySQL,Java', teamId: null }],
  milestones: [
    { id: 1, title: 'Proposal approved', dueDate: '2026-11-20', status: 'COMPLETED', projectId: 2 }, { id: 2, title: 'Wireframes', dueDate: '2026-11-27', status: 'IN_PROGRESS', projectId: 2 },
    { id: 3, title: 'Backend API', dueDate: '2026-12-05', status: 'PENDING', projectId: 2 }, { id: 4, title: 'Dataset collection', dueDate: '2026-11-25', status: 'IN_PROGRESS', projectId: 1 },
    { id: 5, title: 'Model training', dueDate: '2026-12-10', status: 'PENDING', projectId: 1 }],
});
const load = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ } return seed(); };
const save = (db) => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ } };
export const resetDemo = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

const fail = (x) => { const e = new Error(typeof x === 'string' ? x : Object.values(x).join(', ')); e.fields = typeof x === 'string' ? {} : x; throw e; };
const skills = (s) => (s || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
const pv = (db, { mentorId, ...p }) => ({ ...p, mentor: db.mentors.find((m) => m.id === mentorId) || null });
const tv = (db, { projectId, ...t }) => { const p = db.projects.find((x) => x.id === projectId); return { ...t, project: p ? { id: p.id, title: p.title } : null, memberCount: db.students.filter((s) => s.teamId === t.id).length }; };
const sv = ({ teamId, ...s }) => ({ ...s, team: teamId ? { id: teamId } : null });
const mv = ({ projectId, ...m }) => ({ ...m, project: { id: projectId } });

export function mockApi(path, opts = {}) {
  const db = load(); const method = (opts.method || 'GET').toUpperCase(); const b = opts.body || {};
  const [pth, qs] = path.split('?'); const q = new URLSearchParams(qs || '');
  const [res, id, sub, arg] = pth.split('/').filter(Boolean); const n = Number(id);
  const out = (v) => { save(db); return v; };
  const proj = (i) => db.projects.find((p) => p.id === i) || fail(`Project ${i} not found`);

  if (res === 'projects') {
    if (!id && method === 'GET') { const t = (q.get('q') || '').toLowerCase(), d = q.get('domain') || ''; return db.projects.filter((p) => p.title.toLowerCase().includes(t) && (!d || p.domain === d)).sort((a, c) => c.id - a.id).map((p) => pv(db, p)); }
    if (!id && method === 'POST') {
      const e = {}; if ((b.title || '').trim().length < 3) e.title = 'Title must be 3-120 characters'; if (!b.domain) e.domain = 'Domain is required';
      if (Object.keys(e).length) fail(e);
      const p = { id: db.seq.project++, title: b.title.trim(), description: b.description || '', domain: b.domain, requiredSkills: b.requiredSkills || '', status: 'OPEN', mentorId: null };
      db.projects.push(p); return out(pv(db, p));
    }
    if (sub === 'mentor' && method === 'PUT') {
      const p = proj(n), m = db.mentors.find((x) => x.id === Number(arg)) || fail('Mentor not found');
      if (p.mentorId !== m.id && db.projects.filter((x) => x.mentorId === m.id).length >= m.maxTeams) fail(`Mentor ${m.name} is already at capacity (${m.maxTeams})`);
      p.mentorId = m.id; return out(pv(db, p));
    }
    if (method === 'GET') return pv(db, proj(n));
    if (method === 'DELETE') { proj(n); db.projects = db.projects.filter((p) => p.id !== n); db.milestones = db.milestones.filter((m) => m.projectId !== n); db.teams.forEach((t) => { if (t.projectId === n) t.projectId = null; }); return out(null); }
  }
  if (res === 'mentors') return db.mentors;
  if (res === 'teams') {
    if (!id && method === 'GET') return db.teams.map((t) => tv(db, t));
    if (!id && method === 'POST') {
      const e = {}; if (!(b.name || '').trim()) e.name = 'Team name is required'; if (!(b.maxSize >= 2 && b.maxSize <= 6)) e.maxSize = 'Team size must be 2-6';
      if (Object.keys(e).length) fail(e);
      const pid = b.project?.id || null; if (pid) proj(pid);
      const t = { id: db.seq.team++, name: b.name.trim(), maxSize: Number(b.maxSize), projectId: pid }; db.teams.push(t); return out(tv(db, t));
    }
    if (sub === 'join' && method === 'POST') {
      const t = db.teams.find((x) => x.id === n) || fail('Team not found'), s = db.students.find((x) => x.id === Number(arg)) || fail('Student not found');
      if (s.teamId) fail(`${s.name} is already in a team`);
      if (db.students.filter((x) => x.teamId === t.id).length >= t.maxSize) fail(`Team ${t.name} is full`);
      s.teamId = t.id; return out(sv(s));
    }
  }
  if (res === 'students') {
    if (!id && method === 'GET') return db.students.map(sv);
    if (!id && method === 'POST') {
      const e = {}; if (!(b.name || '').trim()) e.name = 'Name is required'; if (!/^\S+@\S+\.\S+$/.test(b.email || '')) e.email = 'Enter a valid email';
      if (Object.keys(e).length) fail(e);
      if (db.students.some((s) => s.email === b.email)) fail('Email already registered');
      const s = { id: db.seq.student++, name: b.name.trim(), email: b.email, skills: b.skills || '', teamId: null }; db.students.push(s); return out(sv(s));
    }
    if (sub === 'suggestions') {
      const s = db.students.find((x) => x.id === n) || fail('Student not found'); const mine = new Set(skills(s.skills));
      return db.teams.filter((t) => db.students.filter((x) => x.teamId === t.id).length < t.maxSize).map((t) => {
        const theirs = new Set(db.students.filter((x) => x.teamId === t.id).flatMap((x) => skills(x.skills)));
        const both = [...mine].filter((k) => theirs.has(k)).length; const uni = new Set([...mine, ...theirs]).size;
        return { teamId: t.id, name: t.name, score: uni ? Math.round((100 * both) / uni) / 100 : 0 };
      }).filter((x) => x.score > 0).sort((a, c) => c.score - a.score).slice(0, 5);
    }
  }
  if (res === 'milestones') {
    if (!id && method === 'GET') return db.milestones.filter((m) => m.projectId === Number(q.get('projectId'))).sort((a, c) => (a.dueDate || '').localeCompare(c.dueDate || '')).map(mv);
    if (!id && method === 'POST') {
      if (!(b.title || '').trim()) fail({ title: 'Title is required' }); proj(b.project?.id);
      const m = { id: db.seq.milestone++, title: b.title.trim(), dueDate: b.dueDate || null, status: b.status || 'PENDING', projectId: b.project.id }; db.milestones.push(m); return out(mv(m));
    }
    const m = db.milestones.find((x) => x.id === n) || fail('Milestone not found');
    if (method === 'PUT') { m.title = b.title; m.dueDate = b.dueDate; m.status = b.status; return out(mv(m)); }
    if (method === 'DELETE') { db.milestones = db.milestones.filter((x) => x.id !== n); return out(null); }
  }
  if (res === 'dashboard') {
    const counts = {}; db.projects.forEach((p) => { counts[p.domain] = (counts[p.domain] || 0) + 1; });
    return {
      totals: { projects: db.projects.length, teams: db.teams.length, students: db.students.length, mentors: db.mentors.length },
      byDomain: Object.entries(counts).map(([domain, count]) => ({ domain, count })).sort((a, c) => c.count - a.count),
      projects: db.projects.map((p) => { const ms = db.milestones.filter((m) => m.projectId === p.id); return { title: p.title, domain: p.domain, status: p.status, mentor: db.mentors.find((m) => m.id === p.mentorId)?.name || null, milestones: ms.length, done: ms.filter((m) => m.status === 'COMPLETED').length }; }),
    };
  }
  return fail('Not available in demo mode');
}
