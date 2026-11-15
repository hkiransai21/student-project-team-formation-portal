import { useState } from 'react';
import { api, DOMAINS } from '../api.js';
import Field from './Field.jsx';
import Alert from './Alert.jsx';

const empty = { title: '', domain: '', requiredSkills: '', description: '' };

export default function ProjectForm({ onSaved }) {
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const v = {};
    if (f.title.trim().length < 3) v.title = 'Title must be at least 3 characters';
    if (!f.domain) v.domain = 'Choose a domain';
    setErrors(v); setServerError('');
    if (Object.keys(v).length) return;
    try { await api('/projects', { method: 'POST', body: f }); setF(empty); onSaved('Project created successfully'); }
    catch (err) { setErrors(err.fields || {}); setServerError(err.message); }
  }

  return (
    <form className="note form" onSubmit={submit} noValidate>
      <h3>New project idea</h3>
      <Field label="Title" error={errors.title}><input value={f.title} onChange={set('title')} placeholder="Smart Attendance System" /></Field>
      <Field label="Domain" error={errors.domain}>
        <select value={f.domain} onChange={set('domain')}><option value="">Select...</option>{DOMAINS.map((d) => <option key={d}>{d}</option>)}</select>
      </Field>
      <Field label="Skills needed (comma separated)"><input value={f.requiredSkills} onChange={set('requiredSkills')} placeholder="React, Java" /></Field>
      <Field label="Description" error={errors.description}><textarea rows="3" value={f.description} onChange={set('description')} /></Field>
      <Alert>{serverError}</Alert>
      <button className="btn" type="submit">Post idea</button>
    </form>
  );
}
