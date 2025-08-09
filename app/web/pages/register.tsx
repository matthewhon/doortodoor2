import { useState } from 'react';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  const [msg,setMsg]=useState(''); const API=process.env.NEXT_PUBLIC_API_BASE||'http://localhost:8080';
  async function submit(e:any){ e.preventDefault(); setMsg('');
    const r=await fetch(API+'/v1/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password,name})}); const d=await r.json();
    if(r.ok){ setMsg('Account created. You can log in.'); } else setMsg(d.error||'Registration failed');
  }
  return (<main style={{maxWidth:420,margin:'40px auto',padding:20}}>
    <h1>Create account</h1>{msg&&<div>{msg}</div>}
    <form onSubmit={submit}>
      <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)}/><br/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><br/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><br/>
      <button type="submit">Register</button>
    </form>
    <div style={{marginTop:10}}><a href="/login">Back to login</a></div>
  </main>);
}
