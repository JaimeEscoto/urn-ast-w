import { useState } from 'react';
import { api } from '../api.js';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const data = await api(path, { method: 'POST', body: form });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      location.href = '/feed';
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="card auth">
      <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <input placeholder="Nombre" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Ciudad" value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })} />
          </>
        )}
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        {err && <div className="error">{err}</div>}
        <button className="btn primary" type="submit">
          {mode === 'login' ? 'Entrar' : 'Registrarme'}
        </button>
      </form>
      <button className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? '¿Nuevo? Crea tu cuenta' : 'Ya tengo cuenta'}
      </button>
    </div>
  );
}
