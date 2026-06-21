import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Profile from './pages/Profile.jsx';
import Feed from './pages/Feed.jsx';
import Events from './pages/Events.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const logged = !!localStorage.getItem('token');
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">🏃 RunnersHub</div>
        <nav>
          <NavLink to="/feed">Validar</NavLink>
          <NavLink to="/events">Eventos</NavLink>
          <NavLink to="/profile">Perfil</NavLink>
          {!logged && <NavLink to="/login">Entrar</NavLink>}
          {logged && (
            <button className="link" onClick={() => { localStorage.clear(); location.href = '/login'; }}>
              Salir
            </button>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
