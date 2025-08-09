import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App(){
  const [msg, setMsg] = useState('...');
  useEffect(()=>{
    const base = (require('./app.json').expo.extra.apiBase) || 'http://10.0.2.2:8080';
    fetch(base + '/v1/health').then(r=>r.json()).then(j=>setMsg(JSON.stringify(j))).catch(()=>setMsg('offline'));
  },[]);
  return (
    <View style={styles.container}><Text>Mobile health: {msg}</Text></View>
  );
}
const styles = StyleSheet.create({ container:{ flex:1, alignItems:'center', justifyContent:'center' } });
