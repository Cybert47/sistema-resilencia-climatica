import React, { useState, useEffect } from 'react'

type Step = { id: number, title: string, text: string, img: string }

export default function PreventionModal({ open, onClose, steps, current = 0 }: { open: boolean, onClose: () => void, steps: Step[], current?: number }){
  const [index, setIndex] = useState<number>(current || 0)

  useEffect(()=>{
    setIndex(current || 0)
  },[current, open])

  if(!open) return null

  const s = steps[index] || steps[0]
  const prev = () => setIndex(i => Math.max(0, i-1))
  const next = () => setIndex(i => Math.min(steps.length - 1, i+1))

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-70 max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4 flex items-center justify-center bg-gray-50">
            <img src={s.img} alt={s.title} className="max-h-72 w-full object-contain rounded" />
          </div>
          <div className="md:w-1/2 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{s.id}. {s.title}</h3>
                <p className="text-sm text-gray-700 mt-2">{s.text}</p>
              </div>
              <div>
                <button aria-label="Cerrar" onClick={onClose} className="ml-3 p-2 rounded hover:bg-gray-100">✕</button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <button onClick={prev} disabled={index === 0} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Anterior</button>
                <div className="flex-1 text-center text-sm text-gray-600">Paso {index+1} de {steps.length}</div>
                <button onClick={next} disabled={index === steps.length - 1} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Siguiente</button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {steps.map((st, i) => (
                  <button key={st.id} onClick={()=>setIndex(i)} className={`text-center p-1 rounded ${i === index ? 'ring-2 ring-primary' : ''}`}>
                    <img src={st.img} alt={st.title} className="w-full h-16 object-cover rounded" />
                    <div className="text-xs mt-1">{st.id}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">Consejos visuales rápidos — sigue las instrucciones de las autoridades y prioriza tu seguridad.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
