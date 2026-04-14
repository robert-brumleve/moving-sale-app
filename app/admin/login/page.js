'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
    else window.location.href = '/admin/dashboard';
  }

  return (
    <div>
      <h1>Admin Login</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
