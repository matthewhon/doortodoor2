import { useState } from 'react';
export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState('');
  const API=process.env.NEXT_PUBLIC_API_BASE||'http://localhost:8080';
  async function submit(e:any){ e.preventDefault(); setMsg('');
    await fetch(API+'/v1/auth/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
    setMsg('If that email exists, a reset link has been sent.');
  }
  return (<main style={{maxWidth:420,margin:'40px auto',padding:20}}>
    <h1>Forgot password</h1>{msg&&<div>{msg}</div>}
    <form onSubmit={submit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><br/>
      <button type="submit">Send reset link</button>
    </form>
    <div style={{marginTop:10}}><a href="/login">Back to login</a></div>
  </main>);
}
