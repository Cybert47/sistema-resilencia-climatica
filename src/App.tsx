import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Cards from './components/Cards'
import MapView from './components/MapView'
import Footer from './components/Footer'
import CMRCSection from './components/cmrc'
import AdvcSection from './components/AdvcSection'
import LocationAlert from './components/LocationAlert'
import AvcdCmsr from './components/AvcdCmsr'

export default function App() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  return (
    <div className="min-h-screen font-poppins text-text bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <Hero />

        <section className="my-6">
          {/* Solicitud de ubicación: aparece antes del mapa */}
          <LocationAlert onLocation={(coords)=>setUserLocation(coords)} />
        </section>

        <section className="my-12">
          {/* Mapa */}
          <MapView userLocation={userLocation} />
        </section>

        <section className="my-6">
          {/* AVCD y CMSR (debajo de las alertas que genera el mapa) */}
          <AvcdCmsr />
          {/* Manual / guía AVCD — contenido técnico y de uso para la plataforma */}
          <AdvcSection />
        </section>

        <section className="my-12">
          <Cards />
        </section>

        {/* CMRC summary section linked from the header */}
        <CMRCSection />

        {/* indicadores por zona eliminado según solicitud */}

        {/* Participation section removed as requested */}
      </main>
      <Footer />
    </div>
  )
}
