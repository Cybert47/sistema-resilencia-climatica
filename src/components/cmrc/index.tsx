import React, { useState } from 'react'
import ConclusionsCard from './ConclusionsCard'
import DemographyCard from './DemographyCard'
import CommunitiesCard from './CommunitiesCard'
import CMRCDetails from './CMRCDetails'

export default function CMRCSection(){
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="cmrc" className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">CMRC — Resumen Comunitario</h2>
        <button
          onClick={()=>setExpanded(e=>!e)}
          className={`px-3 py-2 rounded font-medium ${expanded ? 'bg-cruzroja-red text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {expanded ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConclusionsCard />
        <DemographyCard />
        <CommunitiesCard />
      </div>

      {expanded && (
        <div className="mt-6">
          <CMRCDetails onClose={() => setExpanded(false)} />
        </div>
      )}
    </section>
  )
}
