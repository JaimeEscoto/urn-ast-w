import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Events() {
  const [events, setEvents] = useState([]);
  const logged = !!localStorage.getItem('token');

  useEffect(() => { api('/events').then(setEvents); }, []);

  async function join(id) {
    try {
      await api(`/events/${id}/join`, { method: 'POST' });
      alert('¡Inscrito al evento!');
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="events">
      <h2>Eventos de clubes</h2>
      {events.length === 0 && <div className="card"><p className="muted">Aún no hay eventos próximos.</p></div>}
      {events.map(ev => (
        <div key={ev.id} className="card event">
          <div className="event-date">
            <strong>{new Date(ev.event_date).getDate()}</strong>
            <span>{new Date(ev.event_date).toLocaleString('es', { month: 'short' })}</span>
          </div>
          <div className="event-body">
            <h3>{ev.title}</h3>
            <div className="muted">{ev.club_name} · {ev.location}</div>
            <p>{ev.description}</p>
            <div className="foot">
              <span className="badge">{ev.distance_km} km</span>
              <span className="muted">{ev.attendees} inscritos</span>
              {logged && <button className="btn primary" onClick={() => join(ev.id)}>Unirme</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
