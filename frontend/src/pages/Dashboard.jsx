import useFetch from '../hooks/useFetch.js';
import Alert from '../components/Alert.jsx';

export default function Dashboard() {
  const { data, error, loading } = useFetch('/dashboard');
  const max = Math.max(1, ...(data?.byDomain || []).map((d) => d.count));
  return (
    <section>
      <h1>Dashboard</h1>
      <Alert>{error}</Alert>{loading && <p>Loading...</p>}
      {data && (
        <>
          <div className="grid stats">
            {Object.entries(data.totals).map(([k, v]) => <div key={k} className="note stat"><strong>{v}</strong><span>{k}</span></div>)}
          </div>
          <h2>Projects per domain</h2>
          {data.byDomain.map((d) => (
            <div key={d.domain} className="row"><span>{d.domain}</span><div className="bar"><div style={{ width: `${(100 * d.count) / max}%` }} /></div><b>{d.count}</b></div>
          ))}
          <h2>Project progress</h2>
          <table>
            <thead><tr><th>Project</th><th>Mentor</th><th>Status</th><th>Milestones</th><th>Done</th></tr></thead>
            <tbody>{data.projects.map((p) => (
              <tr key={p.title}><td>{p.title}</td><td>{p.mentor || '-'}</td><td>{p.status}</td><td>{p.done} / {p.milestones}</td>
                <td>{p.milestones ? Math.round((100 * p.done) / p.milestones) : 0}%</td></tr>
            ))}</tbody>
          </table>
        </>
      )}
    </section>
  );
}
