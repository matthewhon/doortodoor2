export default function Health(){
  return <pre>{JSON.stringify({ ok:true }, null, 2)}</pre>
}
