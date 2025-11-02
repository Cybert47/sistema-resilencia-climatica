import React from 'react'

const SmallCard: React.FC<{title:string, children:React.ReactNode, cta:string}> = ({title, children, cta}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="mt-2 text-text">{children}</p>
    </div>
    <div className="mt-4">
      <button className="px-4 py-2 bg-primary text-white rounded">{cta}</button>
    </div>
  </div>
)

export default function Participation(){
  return (
    <div id="participa">
      <h3 className="text-2xl font-semibold">Participa</h3>
      <p className="text-text mt-2">Súmate como voluntario o comparte tu perfil como candidato para fortalecer las capacidades del proyecto.</p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="font-semibold text-lg">Participa con Cruz Roja</h4>
            <p className="mt-2 text-text">Súmate como voluntario o colabora con una donación para apoyar acciones locales.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <a href="https://donar.cruzrojabogota.org.co/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-white rounded inline-block text-center">Donar</a>
            <a href="https://voluntariado.cruzrojacolombiana.org/login/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border-2 border-primary text-primary rounded inline-block text-center">Ser voluntario</a>
          </div>
        </div>
      </div>
    </div>
  )
}
