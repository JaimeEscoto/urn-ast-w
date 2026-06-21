import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Feed() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', distance_km: '', duration_min: '', pace_per_km: '' });
  const logged = !!localStorage.getItem('token');

  const load = () => api('/activities').then(setItems);
  useEffect(() => { load(); }, []);

  async function publish(e) {
    e.preventDefault();
    await api('/activities', { method: 'POST', body: form });
    setForm({ title: '', distance_km: '', duration_min: '', pace_per_km: '' });
    load();
  }

  async function validate(id) {
    try {
      await api(`/activities/${id}/validate`, { method: 'POST' });
      load();
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="feed">
      {logged && (
        <form className="card" onSubmit={publish}>
          <h3>Subir actividad</h3>
          <input placeholder="Título (ej. Carrera matutina)"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div className="row">
            <input type="number" step="0.01" placeholder="Distancia (km)"
              value={form.distance_km} onChange={e => setForm({ ...form, distance_km: e.target.value })} required />
            <input type="number" placeholder="Duración (min)"
              value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} required />
            <input placeholder="Pace (5:30/km)"
              value={form.pace_per_km} onChange={e => setForm({ ...form, pace_per_km: e.target.value })} />
          </div>
          <button className="btn primary">Publicar</button>
        </form>
      )}

      <h2>Validación comunitaria</h2>
      {items.map(a => (
        <div key={a.id} className="card activity">
          <div className="head">
            <div className="avatar small">{a.user_name?.[0]}</div>
            <div>
              <strong>{a.user_name}</strong>
              <div className="muted">{new Date(a.created_at).toLocaleString()}</div>
            </div>
            {a.validated && <span className="badge ok">✓ Validada</span>}
          </div>
          <h4>{a.title || 'Actividad'}</h4>
          <div className="metrics">
            <div><strong>{a.distance_km}</strong><span>km</span></div>
            <div><strong>{a.duration_min}</strong><span>min</span></div>
            <div><strong>{a.pace_per_km || '—'}</strong><span>pace</span></div>
          </div>
          <div className="foot">
            <span className="muted">{a.validation_count}/3 validaciones</span>
            {logged && !a.validated && (
              <button className="btn outline" onClick={() => validate(a.id)}>✓ Validate</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
