import React, { useState } from 'react'
import { Zone } from '../data/zones'

type Props = { zone: Zone }

export default function ClimateAiCard({ zone }: Props){
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [probability, setProbability] = useState<number | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const OWM_KEY = import.meta.env.VITE_OWM_KEY || ''

  async function fetchWeather(){
    setError(null)
    if(!OWM_KEY){ setError('Falta VITE_OWM_KEY en el .env'); return }
    try{
      const lat = zone.coords[0][0]
      const lon = zone.coords[0][1]
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&lang=es`
      const res = await fetch(url)
      if(!res.ok) throw new Error(`OWM HTTP ${res.status}`)
      const data = await res.json()
      setWeather(data)
      return data
    }catch(e:any){ setError(String(e.message || e)); throw e }
  }

  // call server proxy at /api/ai/gemini (server holds credentials)
  // default to localhost:3001 if not set (use server proxy)
  const AI_PROXY_BASE = ((import.meta.env.VITE_AI_PROXY_URL as string) || 'http://localhost:3001').replace(/\/$/, '')

  async function askAi(wdata: any){
    setError(null)
    setLoading(true)
    try{
      const url = (AI_PROXY_BASE || '') + '/api/ai/gemini'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneName: zone.name, weatherSnapshot: wdata, avcd: zone.avcd, cmsr: zone.cmsr })
      })

      if(res.status === 429){
        setError('El servicio AI está saturado (429). Se usará un fallback heurístico.')
        return null
      }

      if(!res.ok){
        const txt = await res.text()
        throw new Error(txt || `HTTP ${res.status}`)
      }

      const data = await res.json()
      if(typeof data.probability !== 'undefined' && data.probability !== null){
        setProbability(Number(data.probability))
        setExplanation(data.explanation || '')
        // dispatch global event so map / other components can react
        try{ window.dispatchEvent(new CustomEvent('rcu:aiPrediction', { detail: { zoneId: zone.id, probability: Number(data.probability), explanation: data.explanation || '' } })) }catch(e){}
      } else {
        setProbability(null)
        setExplanation(data.explanation || String(data))
      }

    }catch(e:any){ setError(String(e.message || e)); }
    setLoading(false)
  }

  async function handleCompute(){
    setLoading(true)
    setError(null)
    try{
  const w = await fetchWeather()
      // First try AI proxy
      await askAi(w)
      // if AI returned null probability, use heuristic fallback
      if(probability === null){
        const rain = (w?.rain && w.rain['1h']) ? w.rain['1h'] : 0
        const base = Math.min(100, Math.max(0, zone.avcd))
        const rainFactor = rain > 5 ? 15 : rain > 1 ? 8 : 0
        const cmsrFactor = (100 - Math.min(100, Math.max(0, zone.cmsr))) * 0.2
        const p = Math.round(Math.min(100, base + rainFactor + cmsrFactor))
        setProbability(p)
        setExplanation((prev)=> prev ? prev : `Fallback heurístico: AVCD=${zone.avcd}, lluvia=${rain}mm, CMSR=${zone.cmsr}`)
        try{ window.dispatchEvent(new CustomEvent('rcu:aiPrediction', { detail: { zoneId: zone.id, probability: p, explanation: `fallback` } })) }catch(e){}
      }
    }catch(e){ /* error ya seteado */ }
    setLoading(false)
  }

  return (
    <div className="p-4 rounded-lg shadow-sm bg-white">
      <div className="font-semibold">Clima y probabilidad IA — {zone.name}</div>

      <div className="mt-3 text-sm">
        <div className="flex gap-4 flex-wrap">
          <div>AVCD: <strong>{zone.avcd}</strong></div>
          <div>CMSR: <strong>{zone.cmsr}</strong></div>
          <div>Población: <strong>{zone.population.toLocaleString()}</strong></div>
        </div>
      </div>

      <div className="mt-3">
        <button className="btn-primary" onClick={handleCompute} disabled={loading}>{loading ? 'Calculando...' : 'Actualizar clima y calcular probabilidad'}</button>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      {weather && (
        <div className="mt-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><strong>Condición:</strong> {weather.weather?.[0]?.description}</div>
            <div><strong>Temp:</strong> {weather.main?.temp}°C</div>
            <div><strong>Humedad:</strong> {weather.main?.humidity}%</div>
            <div><strong>Viento:</strong> {weather.wind?.speed ? `${weather.wind.speed} m/s` : 'N/A'}</div>
            <div><strong>Presión:</strong> {weather.main?.pressure ?? 'N/A'} hPa</div>
            <div><strong>Visibilidad:</strong> {weather.visibility ?? 'N/A'}</div>
          </div>
        </div>
      )}

      {probability !== null && (
        <div className="mt-3 p-3 rounded border">
          <div className="font-semibold">Probabilidad estimada de siniestro: <span className="text-xl">{probability}%</span></div>
          {explanation && <div className="mt-2 text-sm text-gray-700">{explanation}</div>}
          <div className="mt-3 text-sm text-gray-600">(La IA integra variables climáticas como humedad, precipitación y viento en su estimación.)</div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">Nota: la IA ofrece una estimación basada en los datos suministrados; validar con fuentes oficiales antes de tomar decisiones.</div>
    </div>
  )
}
