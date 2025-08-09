import { useEffect, useState } from 'react';
export default function Home(){
  const [msg, setMsg] = useState('');
  useEffect(()=>{
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
    fetch(base + '/v1/health').then(r=>r.json()).then(j=>setMsg(JSON.stringify(j))).catch(()=>setMsg('offline'));
  },[]);
  return (
    <main style={{padding:20}}>
      <h1>Canvassing Web</h1>
      <p>Backend health: {msg || '...'}</p>
    </main>
  );
}
