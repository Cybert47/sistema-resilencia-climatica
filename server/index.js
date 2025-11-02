import express from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { GoogleAuth } from 'google-auth-library'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '256kb' }))

// Simple rate limit to protect from abuse
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 })
app.use(limiter)

const MODEL = process.env.GEMINI_MODEL || 'models/gemini-1.0'
const PORT = process.env.PORT || 3001

async function getAccessToken(){
  // If an API key is provided prefer it (no GoogleAuth). Otherwise use service account.
  if(process.env.GEMINI_API_KEY){
    return null // signal to caller that API key flow should be used instead
  }
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] })
  const client = await auth.getClient()
  const res = await client.getAccessToken()
  if(!res) throw new Error('No se pudo obtener access token')
  return typeof res === 'string' ? res : res.token
}

// Retry that respects Retry-After
async function fetchWithRetry(url, options, maxRetries = 4){
  for(let attempt = 0; attempt <= maxRetries; attempt++){
    const r = await fetch(url, options)
    if(r.status === 429){
      const ra = r.headers.get('retry-after')
      const wait = ra ? Number(ra) * 1000 : Math.min(1000 * 2 ** attempt, 10000)
      const jitter = Math.random() * 300
      await new Promise(res => setTimeout(res, wait + jitter))
      continue
    }
    if(!r.ok){
      const text = await r.text()
      const e = new Error(`HTTP ${r.status}: ${text}`)
      e.status = r.status
      throw e
    }
    return r.json()
  }
  throw new Error('Max retries reached (429)')
}

app.post('/api/ai/gemini', async (req, res) => {
  try{
    const { zoneName, weatherSnapshot, avcd, cmsr } = req.body || {}
    if(!zoneName) return res.status(400).json({ error: 'Missing zoneName' })

    // Build a concise prompt for the model
    const prompt = `Analiza riesgo de siniestro en la zona "${zoneName}".`
      + `\nAVCD=${avcd}, CMSR=${cmsr}.\nClima: ${JSON.stringify(weatherSnapshot)}`
      + `\n\nDevuelve SOLO un JSON con {"probability": number, "explanation": string}.`

    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/${MODEL}:generateText`
    const body = {
      prompt: { text: prompt },
      temperature: 0.2,
      maxOutputTokens: 300
    }

    // Prefer API key flow if configured (simpler for development). Otherwise use OAuth token.
    const apiKey = process.env.GEMINI_API_KEY
    let result = null
    if(apiKey){
      // Use API key via Authorization header (simple approach). Some Google endpoints also accept ?key=API_KEY.
      try{
        result = await fetchWithRetry(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
        })
      }catch(e){
        console.error('Gemini API key call failed:', e.message || e)
        result = null
      }
    }else{
      // Try service-account / GoogleAuth flow
      const token = await getAccessToken()
      if(!token){
        // getAccessToken returned null when GEMINI_API_KEY is present; but here means no token
        throw new Error('No credentials available for Gemini (set GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS)')
      }
      result = await fetchWithRetry(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
    }

    // Extract text candidate
    const text = (result?.candidates?.[0]?.output?.[0]?.content || result?.candidates?.[0]?.output || result?.candidates?.[0]?.content || '')
    let parsed = null
    try{ parsed = JSON.parse(text) }catch(e){
      const m = String(text).match(/\{[\s\S]*\}/)
      if(m) try{ parsed = JSON.parse(m[0]) }catch(_){ parsed = null }
    }

    if(parsed && typeof parsed.probability !== 'undefined') return res.json(parsed)

    // If model didn't return structured JSON or the external call failed, reply with a heuristic fallback
    const fallback = (() => {
      try{
        const w = weatherSnapshot || {}
        let p = 0.05
        // precipitation increases risk
        if(typeof w.precip === 'number') p += Math.min(0.5, w.precip * 0.03)
        // high temp can increase certain risks
        if(typeof w.temp === 'number') p += w.temp > 30 ? 0.08 : (w.temp > 25 ? 0.04 : 0)
        if(avcd) p += 0.18
        if(cmsr) p += 0.12
        p = Math.max(0, Math.min(0.99, p))
        return { probability: Math.round(p * 100), explanation: `Heurística local: riesgo estimado en base a precip(${w.precip}), temp(${w.temp}), AVCD=${avcd}, CMSR=${cmsr}` }
      }catch(e){
        return { probability: null, explanation: String(text || 'No hay respuesta del modelo').slice(0,1000) }
      }
    })()
    return res.json(fallback)

  }catch(err){
    console.error('Gemini proxy error:', err?.message || err)
    const status = err?.status || 500
    res.status(status).json({ error: err.message || 'Gemini proxy error' })
  }
})

app.listen(PORT, ()=>console.log(`Gemini proxy listening on http://localhost:${PORT}`))
