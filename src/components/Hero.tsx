import React from 'react'

export default function Hero(){
  return (
    <section className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-md">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Solidaridad en acción: unidos por las familias afectadas</h1>
        <p className="mt-3 text-gray-700">La Cruz Roja Bogotá trabaja con comunidades para reducir riesgos, atender emergencias y brindar apoyo inmediato. Participa, reporta y ayuda a salvar vidas.</p>
        <div className="mt-4 flex gap-3">
          <a href="https://donar.cruzrojabogota.org.co/" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center">Donar</a>
          <a href="https://voluntariado.cruzrojacolombiana.org/login/" target="_blank" rel="noopener noreferrer" className="border-2 border-primary text-primary px-4 py-2 rounded-xl inline-block text-center">Ser voluntario</a>
        </div>
      </div>
      <div className="w-80">
        <img src="/assets/hero.svg" alt="Ilustración de apoyo humanitario" className="rounded-lg shadow-sm" />
      </div>
    </section>
  )
}
