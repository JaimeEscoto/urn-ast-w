import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Profile() {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) return;
    api(`/users/${user.id}/profile`).then(setData).catch(() => {});
  }, []);

  if (!user) return <div className="card"><p>Inicia sesión para ver tu perfil.</p></div>;
  if (!data) return <div className="card"><p>Cargando…</p></div>;

  const u = data.user;
  return (
    <div className="profile">
      <div className="card hero">
        <div className="avatar">{u.name?.[0]?.toUpperCase()}</div>
        <div>
          <h2>{u.name}</h2>
          <p className="muted">{u.city || 'Runner'}</p>
          <div className="stats">
            <div><strong>{Number(u.total_km).toFixed(1)}</strong><span>km totales</span></div>
            <div><strong>{u.total_activities}</strong><span>actividades</span></div>
            <div><strong>{data.medals.length}</strong><span>medallas</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>🏅 Medallas</h3>
        {data.medals.length === 0 && <p className="muted">Aún no tienes medallas. ¡Sube tu primera carrera!</p>}
        <div className="medals">
          {data.medals.map(m => (
            <div key={m.code} className="medal">
              <div className="icon">{m.icon}</div>
              <strong>{m.name}</strong>
              <span className="muted">{m.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Actividades recientes</h3>
        {data.activities.map(a => (
          <div key={a.id} className="activity-row">
            <div>
              <strong>{a.title || `${a.distance_km} km`}</strong>
              <div className="muted">{a.distance_km} km · {a.duration_min} min · {a.pace_per_km || '—'}</div>
            </div>
            <span className={`badge ${a.validated ? 'ok' : 'pending'}`}>
              {a.validated ? '✓ Validada' : `${a.validation_count}/3`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
