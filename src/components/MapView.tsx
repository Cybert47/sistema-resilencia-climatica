import React, { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, CircleMarker, useMap, Marker, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import zonesData, { Zone } from '../data/zones'
import { pointInPolygon, zoneColor, dangerFromAvcd, centroid } from '../utils/geo'
import ClimateAiCard from './ClimateAiCard'
import { getZonePrediction } from '../utils/ai'

export default function MapView({ userLocation }: { userLocation?: [number, number] | null }){
  const [showZones, setShowZones] = useState(true)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [map, setMap] = useState<any>(null)
  const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(null)
  const [clickedInfo, setClickedInfo] = useState<{ zoneName?: string | null, danger?: {level:string,colorClass:string,text:string} | null } | null>(null)
  const [showEvacRoutes, setShowEvacRoutes] = useState(true)
  const [showMeetingPoints, setShowMeetingPoints] = useState(true)

  useEffect(()=>{
    if(!map || !userLocation) return
    try{ map.setView(userLocation, 14) }catch(e){/* ignore */}
  },[userLocation, map])

  function MapSetter({ onMap }: { onMap: (m: any) => void }){
    const mapInstance = useMap()
    useEffect(()=>{ onMap(mapInstance) }, [mapInstance, onMap])
    return null
  }

  function MapClickHandler(){
    const map = useMap()
    useEffect(()=>{
      function onClick(e: any){
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        const p: [number, number] = [lat, lng]
        setClickedPoint(p)
        const found = zonesData.find(z => pointInPolygon(p, z.coords))
        if(found){
          const d = dangerFromAvcd(found.avcd)
          setClickedInfo({ zoneName: found.name, danger: d })
          setSelectedZone(found.id)
        } else {
          setClickedInfo({ zoneName: null, danger: null })
          setSelectedZone(null)
        }
      }
      map.on('click', onClick)
      return ()=>{ map.off('click', onClick) }
    },[map])
    return null
  }

  // when a zone is selected from the left panel, place the point at the centroid and show info
  useEffect(()=>{
    if(!selectedZone) return
    const z = zonesData.find(z=>z.id === selectedZone)
    if(!z) return
    const c = centroid(z.coords)
    setClickedPoint(c)
    const d = dangerFromAvcd(z.avcd)
    setClickedInfo({ zoneName: z.name, danger: d })
    if(map){
      try{ map.setView(c, 14) }catch(e){/* ignore */}
    }
  },[selectedZone, map])

  const totals = useMemo(()=>{
    const selected = showZones ? zonesData : []
    const population = selected.reduce((s,z)=>s+z.population,0)
    const estAffected = selected.reduce((s,z)=>s + Math.round(z.population * (z.avcd/100) * 0.12),0)
    return { population, estAffected }
  },[showZones])

  // predictionColors: map zoneId -> { probability, color }
  const [predictionColors, setPredictionColors] = useState<Record<string,{probability:number,color:string,explanation?:string}>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  // helper to map probability -> color hex
  function colorFromProb(p: number){
    if(p >= 70) return '#E00000' // red
    if(p >= 40) return '#F59E0B' // amber
    return '#10B981' // green
  }

  // helper to map probability -> level label
  function levelFromProb(p: number){
    if(p >= 70) return { level: 'Alta', text: 'Alerta alta' }
    if(p >= 40) return { level: 'Media', text: 'Alerta media' }
    return { level: 'Baja', text: 'Alerta baja' }
  }

  const AI_CONF_THRESHOLD = Number(import.meta.env.VITE_AI_CONFIDENCE_THRESHOLD || 45)

  function shouldUseAiForZone(zone: Zone, pred?: {probability?: number} | null){
    if(!pred || typeof pred.probability !== 'number') return false
    const prob = Number(pred.probability)
    if(Number.isNaN(prob)) return false
    if(prob >= AI_CONF_THRESHOLD) return true
    // if low confidence, only use AI when AVCD is not already medium/high (avoid downgrades)
    const d = dangerFromAvcd(zone.avcd)
    if(d.level === 'Alto' || d.level === 'Medio') return false
    return true
  }

  // load persisted predictions from localStorage on mount
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('rcu:aiZoneColors')
      if(raw){
        const parsed = JSON.parse(raw)
        // Normalize persisted colors to the canonical green/amber/red based on probability
        const normalized: Record<string,{probability:number,color:string,explanation?:string}> = {}
        Object.keys(parsed).forEach(k => {
          const entry = parsed[k]
          const prob = typeof entry?.probability === 'string' ? Number(entry.probability) : entry?.probability
          if(typeof prob === 'number' && !Number.isNaN(prob)){
            normalized[k] = { probability: prob, color: colorFromProb(Number(prob)), explanation: entry?.explanation }
          } else if(entry?.color){
            // fallback: keep existing color but try to map to nearest canonical color by matching known hexes
            const known = ['#E00000','#F59E0B','#10B981']
            normalized[k] = { probability: entry.probability ?? null, color: known.includes(entry.color) ? entry.color : '#10B981', explanation: entry?.explanation }
          }
        })
        setPredictionColors(normalized)
      }
    }catch(e){}
  },[])

  // listen to events from ClimateAiCard when a single zone has new prediction
  useEffect(()=>{
    function handler(e: any){
      const d = e?.detail
      if(!d || !d.zoneId) return
      const color = d.probability != null ? colorFromProb(Number(d.probability)) : undefined
      setPredictionColors(prev=>{
        const next = { ...prev, [d.zoneId]: { probability: Number(d.probability), color, explanation: d.explanation } }
        try{ localStorage.setItem('rcu:aiZoneColors', JSON.stringify(next)) }catch(e){}
        return next
      })
    }
    window.addEventListener('rcu:aiPrediction', handler)
    return ()=> window.removeEventListener('rcu:aiPrediction', handler)
  },[])

  // bulk update predictions for visible zones
  async function updateAllPredictions(){
    setApiError(null)
    try{
      const toQuery = showZones ? zonesData : []
      const next: Record<string,{probability:number,color:string,explanation?:string}> = { ...predictionColors }
      for(const z of toQuery){
        try{
          // fetch current weather for the zone (if OWM key available)
          let weather = null
          try{
            const OWM_KEY = import.meta.env.VITE_OWM_KEY || ''
            if(OWM_KEY){
              const lat = z.coords[0][0]
              const lon = z.coords[0][1]
              const u = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&lang=es`
              const r = await fetch(u)
              if(r.ok) weather = await r.json()
            }
          }catch(e){/* ignore weather fetch errors */}

          const res = await getZonePrediction(z, weather)
          if(res.probability != null){
            const color = colorFromProb(res.probability)
            next[z.id] = { probability: res.probability, color, explanation: res.explanation || '' }
          }
        }catch(e:any){
          // capture a representative API/network error
          console.error('Zone prediction failed for', z.id, e?.message || e)
          setApiError(String(e?.message || e))
        }
      }
      setPredictionColors(next)
      try{ localStorage.setItem('rcu:aiZoneColors', JSON.stringify(next)) }catch(e){}
    }catch(e:any){
      console.error('updateAllPredictions failed', e?.message || e)
      setApiError(String(e?.message || e))
    }
  }

  // precompute selected zone styles based on whether we should use AI for that zone
  const selectedZonePred = selectedZone ? predictionColors[selectedZone] : undefined
  const selectedZoneData = selectedZone ? zonesData.find(z=>z.id === selectedZone) : undefined
  const selectedZoneUseAi = selectedZoneData ? shouldUseAiForZone(selectedZoneData, selectedZonePred) : false
  const leftPanelStyle = selectedZoneUseAi && selectedZonePred ? { borderLeft: `6px solid ${colorFromProb(Number(selectedZonePred.probability))}` } : (selectedZone && predictionColors[selectedZone] ? { borderLeft: `6px solid ${predictionColors[selectedZone].color}` } : undefined)

  return (
    <div className="w-full rounded-lg overflow-hidden px-2 sm:px-0">
      <div className="flex flex-col md:flex-row gap-6">
  <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-sm" style={leftPanelStyle}>
          <h4 className="font-semibold">Controles</h4>
          <div className="mt-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={showZones} onChange={e=>setShowZones(e.target.checked)} />
              <span>Mostrar zonas (AVCD / CMSR)</span>
            </label>
          </div>

            <div className="mt-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showEvacRoutes} onChange={e=>setShowEvacRoutes(e.target.checked)} />
                <span>Mostrar rutas de evacuación (solo para zonas en rojo)</span>
              </label>
            </div>
            <div className="mt-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showMeetingPoints} onChange={e=>setShowMeetingPoints(e.target.checked)} />
                <span>Mostrar puntos de reunión</span>
              </label>
            </div>

          <div className="mt-4">
            <h5 className="font-medium">Resumen</h5>
            <div className="text-sm mt-2">Población total (zonas mostradas): <strong>{totals.population}</strong></div>
            <div className="text-sm">Estimación personas afectadas (demo): <strong>{totals.estAffected}</strong></div>
          </div>

          <div className="mt-4">
            <h5 className="font-medium">Zonas</h5>
            <ul className="mt-2 space-y-2 text-sm">
              {zonesData.map(z => (
                <li key={z.id}>
                  <button onClick={()=>setSelectedZone(z.id)} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">{z.name} — AVCD: {z.avcd} — CMSR: {z.cmsr} {predictionColors[z.id] ? `— IA: ${predictionColors[z.id].probability}%` : ''}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-xs text-gray-600">
            Nota: valores AVCD/CMSR y población de ejemplo. Reemplazar por datos reales del proyecto RCU.
          </div>
        </div>

        <div className="md:flex-1">
          <div className="rounded-lg overflow-hidden h-[50vh] md:h-[450px]">
            <div className="flex items-center gap-3 mb-2">
              <button className="btn-primary" onClick={updateAllPredictions}>Actualizar predicciones IA</button>
              <div className="text-sm text-gray-600">Colores de zona definidos por IA (si existen) — rojo/ámbar/verde</div>
            </div>
            {apiError && (
              <div className="mb-2 text-sm text-red-600">Error al actualizar predicciones: {apiError}</div>
            )}
            <MapContainer center={[4.587, -74.210]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <MapSetter onMap={(m)=>setMap(m)} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

              {showZones && zonesData.map((z: Zone) => {
                const pred = predictionColors[z.id]
                const useAiForPoly = shouldUseAiForZone(z, pred)
                const fill = useAiForPoly && pred && typeof pred.probability === 'number' ? colorFromProb(pred.probability) : zoneColor(z.avcd)
                return (
                <Polygon
                  key={z.id}
                  positions={z.coords.map(c=>[c[0], c[1]]) as any}
                  pathOptions={{ color: fill, fillColor: fill, fillOpacity: 0.22, weight: 2 }}
                  // make polygon interactive so we can show hover info
                  interactive={true as any}
                  eventHandlers={{
                    mouseover: ()=> setHoveredZone(z.id),
                    mouseout: ()=> setHoveredZone(prev => (prev === z.id ? null : prev)),
                    click: ()=> {
                      setSelectedZone(z.id)
                      const c = centroid(z.coords)
                      setClickedPoint(c)
                      const d = dangerFromAvcd(z.avcd)
                      setClickedInfo({ zoneName: z.name, danger: d })
                      if(map){ try{ map.setView(c, 14) }catch(e){} }
                    }
                  }}
                />
              )})}

              <MapClickHandler />

              {clickedPoint && (
                <CircleMarker center={clickedPoint as any} radius={7} pathOptions={{ color: '#111827', fillColor: '#111827', fillOpacity: 0.9 }}>
                  <Popup>
                    <div className="text-sm">
                      <div style={{fontWeight:600}}>Punto seleccionado</div>
                      <div>Lat: {clickedPoint[0].toFixed(5)}, Lng: {clickedPoint[1].toFixed(5)}</div>
                      {clickedInfo && clickedInfo.zoneName ? (
                        <div className="mt-2">
                          <div>Zona: {clickedInfo.zoneName}</div>
                          <div>Riesgo: {clickedInfo.danger?.level} ({clickedInfo.danger?.text})</div>
                        </div>
                      ) : (
                        <div className="mt-2">Fuera de zonas conocidas</div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Evacuation routes for selected zone if AVCD >= 75 and toggle is on */}
              {selectedZone && showEvacRoutes && (() => {
                const z = zonesData.find(z=>z.id === selectedZone)
                if(!z) return null
                if(!z.evacuationRoutes) return null
                // color routes red if zone is high AVCD, else blue
                return z.evacuationRoutes.map((route, idx)=> (
                  <Polyline key={idx} positions={route.map(r=>[r[0], r[1]]) as any} pathOptions={{ color: z.avcd >= 75 ? '#E60000' : '#1E90FF', weight: 4, dashArray: '8 6' }} />
                ))
              })()}

              {/* Meeting points for visible zones */}
              {showMeetingPoints && zonesData.map(z => (
                (z.meetingPoints || []).map(mp => (
                  <CircleMarker key={mp.id} center={mp.coord as any} radius={6} pathOptions={{ color: '#ffffff', fillColor: '#0ea5e9', fillOpacity: 0.95 }}>
                    <Popup>
                      <div className="text-sm">
                        <div style={{fontWeight:600}}>{mp.name}</div>
                        <div className="text-xs">{mp.description}</div>
                        <div className="mt-1 text-xs text-gray-600">Zona: {z.name}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))
              ))}

              {userLocation && (
                <CircleMarker center={userLocation as any} radius={8} pathOptions={{ color: '#1E40AF', fillColor: '#1E40AF', fillOpacity: 0.9 }}>
                  <Popup>Tu ubicación aproximada</Popup>
                </CircleMarker>
              )}

              {/* Hover overlay: show IA explanation and quick climate summary for hovered zone */}
              {hoveredZone && (()=>{
                const z = zonesData.find(x=>x.id===hoveredZone)
                const pred = predictionColors[hoveredZone]
                if(!z) return null
                return (
                  <div className="absolute z-50 right-4 top-4 w-72 pointer-events-none sm:w-80">
                    <div className="bg-white p-3 rounded shadow">
                      <div className="font-semibold">{z.name}</div>
                      <div className="text-sm text-gray-700 mt-1">IA Prob: <strong>{pred ? `${pred.probability}%` : 'N/A'}</strong></div>
                      {pred?.explanation && <div className="text-xs text-gray-600 mt-2">{pred.explanation}</div>}
                    </div>
                  </div>
                )
              })()}

            </MapContainer>
          </div>
        </div>
      </div>
      
      {/* AVCD/CMSR moved to dedicated component `AvcdCmsr` and rendered from App to control layout/order. */}

      {/* Cards debajo del mapa con información de la zona seleccionada/clicada */}
    <div className="mt-6 container px-0">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
            // determine zone to show: selectedZone priority, else clickedInfo
            const zone = selectedZone ? zonesData.find(z=>z.id === selectedZone) : (clickedInfo?.zoneName ? zonesData.find(z=>z.name === clickedInfo.zoneName) : null)
            if(zone){
              const d = dangerFromAvcd(zone.avcd)
              const ai = predictionColors[zone.id]
              // If AI prediction exists, decide whether to use it. If AI prob < threshold and AVCD indicates Med/Alto, fallback to AVCD.
              const hasAi = ai && typeof ai.probability === 'number'
              let useAi = !!hasAi
              if(hasAi){
                const prob = Number(ai.probability)
                if(Number.isNaN(prob)) useAi = false
                else if(prob < AI_CONF_THRESHOLD){
                  // fallback to AVCD for red/amber alerts when AI low-confidence
                  if(d.level === 'Alto' || d.level === 'Medio') useAi = false
                }
              }
              const aiLevel = useAi && hasAi ? levelFromProb(Number(ai.probability)) : null
              const aiColor = useAi && hasAi ? colorFromProb(Number(ai.probability)) : undefined
              const cardStyle = aiColor ? { borderLeft: `6px solid ${aiColor}`, backgroundColor: aiColor } : undefined
              const levelLabel = useAi ? aiLevel?.level : (d.level === 'Alto' ? 'Alta' : (d.level === 'Medio' ? 'Media' : 'Baja'))
              const sourceLabel = useAi ? 'IA' : 'AVCD'
              const usedFallback = hasAi && !useAi
              return (
                <>
                  <div key={zone.id} className={`p-4 rounded-lg text-white ${aiColor ? '' : d.colorClass} max-h-96 md:max-h-64 overflow-auto flex flex-col justify-center`} style={cardStyle}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{zone.name}</div>
                        <div className="text-sm">Población: {zone.population.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">Alerta: {levelLabel} <span className="text-xs font-normal">({sourceLabel}{usedFallback ? ' · fallback' : ''})</span></div>
                        <div className="text-sm">{useAi ? (ai.explanation || '') : d.text}</div>
                        {useAi && ai && typeof ai.probability === 'number' && (
                          <div className="text-xs mt-1">IA: {ai.probability}%</div>
                        )}
                        {usedFallback && ai && typeof ai.probability === 'number' && (
                          <div className="text-xs mt-1 text-yellow-100">IA sugirió {ai.probability}%, pero se usó AVCD como fallback</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white/20 p-2 rounded">AVCD: <strong>{zone.avcd}</strong></div>
                      <div className="bg-white/20 p-2 rounded">CMSR: <strong>{zone.cmsr}</strong></div>
                    </div>
                  </div>

                  {/* AI climate/probability card */}
                  <div>
                    <ClimateAiCard zone={zone} />
                  </div>
                </>
              )
            }

            return (
              <div className="col-span-1 md:col-span-2 p-4 rounded-lg bg-white shadow-sm">
                <div className="font-medium">Ninguna zona seleccionada</div>
                <div className="text-sm text-gray-600">Haz click en el mapa o selecciona una zona para ver la información aquí.</div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
