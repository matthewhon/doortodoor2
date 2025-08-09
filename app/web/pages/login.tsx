import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

  async function submit(e:any){
    e.preventDefault(); setMsg('');
    const res = await fetch(API + '/v1/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok){ localStorage.setItem('token', data.access_token); location.href = '/'; }
    else setMsg(data.error || 'Login failed');
  }

  return (
    <main style={{maxWidth:420, margin:'40px auto', padding:20}}>
      <h1>Login</h1>
      {msg && <div style={{color:'red'}}>{msg}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><br/>
        <button type="submit">Login</button>
      </form>
      <div style={{marginTop:10}}>
        <a href="/register">Create account</a> · <a href="/forgot">Forgot password?</a>
      </div>
    </main>
  );
}
