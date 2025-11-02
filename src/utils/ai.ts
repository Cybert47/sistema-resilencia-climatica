// util to call AI proxy for zone probability
export async function getZonePrediction(zone: { id: string, name: string, avcd: number, cmsr: number, coords: any[] }, weatherSnapshot: any = null){
  const AI_PROXY_BASE = (import.meta.env.VITE_AI_PROXY_URL as string) || 'http://localhost:3001'
  const url = AI_PROXY_BASE.replace(/\/$/, '') + '/api/ai/gemini'
  try{
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zoneName: zone.name, weatherSnapshot, avcd: zone.avcd, cmsr: zone.cmsr })
    })
    if(!res.ok){
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }
    const data = await res.json()
    return { probability: typeof data.probability !== 'undefined' && data.probability !== null ? Number(data.probability) : null, explanation: data.explanation || null }
  }catch(e:any){
    // fallback heuristic locally: include weatherSnapshot influence when available
    const base = Math.min(100, Math.max(0, zone.avcd))
    let weatherFactor = 0
    try{
      if(weatherSnapshot){
        const rain = (weatherSnapshot?.rain && (weatherSnapshot.rain['1h'] || weatherSnapshot.rain['3h'])) ? (weatherSnapshot.rain['1h'] || weatherSnapshot.rain['3h']) : 0
        const hum = weatherSnapshot?.main?.humidity ?? weatherSnapshot?.humidity ?? null
        if(rain > 5) weatherFactor += 12
        else if(rain > 1) weatherFactor += 6
        if(hum != null && hum > 80) weatherFactor += 6
      }
    }catch(_){ }
    const cmsrFactor = (100 - Math.min(100, Math.max(0, zone.cmsr))) * 0.2
    const p = Math.round(Math.min(100, base + cmsrFactor + weatherFactor))
    return { probability: p, explanation: `Fallback heurístico local: AVCD=${zone.avcd}, CMSR=${zone.cmsr}, weather=${JSON.stringify(weatherSnapshot || {}).slice(0,200)}` }
  }
}
