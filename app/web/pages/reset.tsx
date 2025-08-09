import { useEffect, useState } from 'react';
export default function Reset(){
  const [token,setToken]=useState(''); const [pwd,setPwd]=useState(''); const [msg,setMsg]=useState('');
  const API=process.env.NEXT_PUBLIC_API_BASE||'http://localhost:8080';

  useEffect(()=>{ const u=new URL(location.href); setToken(u.searchParams.get('token')||''); },[]);
  async function submit(e:any){ e.preventDefault(); setMsg('');
    const r=await fetch(API+'/v1/auth/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,new_password:pwd})});
    const d=await r.json(); if(r.ok) setMsg('Password updated. You can now log in.'); else setMsg(d.error||'Failed'); 
  }

  return (<main style={{maxWidth:420,margin:'40px auto',padding:20}}>
    <h1>Reset password</h1>{msg&&<div>{msg}</div>}
    <form onSubmit={submit}>
      <input placeholder="New password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} required/><br/>
      <button type="submit">Update password</button>
    </form>
    <div style={{marginTop:10}}><a href="/login">Back to login</a></div>
  </main>);
}
