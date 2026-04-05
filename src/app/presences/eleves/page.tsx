'use client'
import { useState, useEffect } from 'react'
import { getEleves, CLASSES, isNouvel } from '@/lib/data'
import { Eleve } from '@/types'

export default function PresencesElevesPage() {
  const [eleves, setEleves] = useState<Eleve[]>([])
  const [classe, setClasse] = useState('')
  const [presences, setPresences] = useState<Record<number, boolean>>({})

  useEffect(() => {
    getEleves().then(data => setEleves(data))
  }, [])

  const classesDisponibles = CLASSES.filter(c => eleves.some(e => e.classe === c))
  const elevesClasse = classe ? eleves.filter(e => e.classe === classe) : []
  const nbPresents = Object.values(presences).filter(Boolean).length

  function toggle(id: number) {
    setPresences(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function marquerTous() {
    const all: Record<number, boolean> = {}
    elevesClasse.forEach(e => all[e.id] = true)
    setPresences(all)
  }

  function initClasse(c: string) {
    setClasse(c)
    const init: Record<number, boolean> = {}
    eleves.filter(e => e.classe === c).forEach(e => init[e.id] = true)
    setPresences(init)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Présences élèves</h1>
        <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-medium">Appel — choisir une classe</span>
          </div>
          <div className="p-4">
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d] mb-4"
              value={classe}
              onChange={e => initClasse(e.target.value)}>
              <option value="">Choisir une classe...</option>
              {classesDisponibles.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {classe && elevesClasse.length > 0 && (
              <>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] bg-green-50 text-green-700 font-medium px-2 py-1 rounded-full">{nbPresents} présents</span>
                  <span className="text-[10px] bg-red-50 text-red-700 font-medium px-2 py-1 rounded-full">{elevesClasse.length - nbPresents} absents</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded-full">
                    {elevesClasse.length > 0 ? Math.round(nbPresents / elevesClasse.length * 100) : 0}%
                  </span>
                </div>

                <div className="flex flex-col">
                  {elevesClasse.map(e => (
                    <div key={e.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs font-medium">{e.prenom} {e.nom}</span>
                        {isNouvel(e.enrolledAt) && (
                          <span className="text-[9px] bg-yellow-100 text-yellow-700 border border-yellow-300 px-1.5 py-0.5 rounded-full">NOUVEAU</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggle(e.id)}
                        className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${presences[e.id] ? 'bg-[#2d6a2d]' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${presences[e.id] ? 'left-4' : 'left-0.5'}`}/>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={marquerTous} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                    Tous présents
                  </button>
                  <button className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">
                    Valider l'appel ✓
                  </button>
                </div>
              </>
            )}

            {!classe && (
              <div className="text-center text-gray-400 text-sm py-8">
                Sélectionnez une classe pour faire l'appel
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-medium">Récapitulatif par classe</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {classesDisponibles.map(c => {
                const nb = eleves.filter(e => e.classe === c).length
                return (
                  <div key={c}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{c}</span>
                      <span className="text-gray-500">{nb} élève(s)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2d6a2d] rounded-full" style={{width:'93%'}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-medium">Absences récentes</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                { nom: 'Ibrahima Faye', classe: 'CE1', date: 'Hier' },
                { nom: 'Aïssatou Ba', classe: 'CP', date: 'Il y a 2 jours' },
                { nom: 'Cheikh Diop', classe: 'Daara', date: 'Avant-hier' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-[9px] flex-shrink-0">
                    {a.nom[0]}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{a.nom}</span>
                    <span className="text-gray-400 ml-1">— {a.classe}</span>
                  </div>
                  <span className="text-gray-400">{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}