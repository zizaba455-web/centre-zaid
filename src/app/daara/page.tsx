'use client'
import { useState } from 'react'

const maitres = [
  { id: 1, nom: 'Serigne Bassirou Mbaye', groupe: 'Débutants — Qa\'ida / Iqra', present: true, signIn: '05h30' },
  { id: 2, nom: 'El Hadj Oumar Koné', groupe: 'Niveau 1 — Juz 1 à 5', present: true, signIn: '05h28' },
  { id: 3, nom: 'Cheikh Ahmad Tidiane', groupe: 'Niveau 2 — Juz 6 à 15', present: true, signIn: '05h25' },
  { id: 4, nom: 'Serigne Pape Diallo', groupe: 'Niveau 3 — Juz 16 à 25', present: true, signIn: '05h32' },
  { id: 5, nom: 'Mouhamadou Bamba Sy', groupe: 'Avancés — Juz 26 à 30', present: true, signIn: '05h20' },
]

const eleves = [
  { id: 1, nom: 'Babacar Traoré', niveau: 'juz', juz: 18, obj: 1, atteint: true, retard: false },
  { id: 2, nom: 'Cheikh Diop', niveau: 'juz', juz: 15, obj: 1, atteint: true, retard: false },
  { id: 3, nom: 'Abdoulaye Diallo', niveau: 'juz', juz: 8, obj: 1, atteint: true, retard: false },
  { id: 4, nom: 'Ibrahima Faye', niveau: 'juz', juz: 3, obj: 1, atteint: false, retard: true },
  { id: 5, nom: 'Lamine Kouyaté', niveau: 'juz', juz: 2, obj: 1, atteint: false, retard: true },
  { id: 6, nom: 'Ahmed Ba', niveau: 'alpha', lettre: 18, lettreNom: 'ع (Aïn)', niveauAlpha: 'Iqra 3', atteint: true, retard: false },
  { id: 7, nom: 'Fatou Diallo', niveau: 'alpha', lettre: 12, lettreNom: 'م (Mim)', niveauAlpha: 'Iqra 2', atteint: true, retard: false },
  { id: 8, nom: 'Omar Sow', niveau: 'alpha', lettre: 5, lettreNom: 'ه (Ha)', niveauAlpha: 'Qa\'ida', atteint: false, retard: false },
  { id: 9, nom: 'Sara Ndiaye', niveau: 'alpha', lettre: 2, lettreNom: 'ب (Ba)', niveauAlpha: 'Débutant', atteint: false, retard: false },
]

export default function DaaraPage() {
  const [tab, setTab] = useState<'juz'|'alpha'|'hizb'|'vie'>('juz')

  const juzEleves = eleves.filter(e => e.niveau === 'juz')
  const alphaEleves = eleves.filter(e => e.niveau === 'alpha')
  const atteints = eleves.filter(e => e.atteint).length
  const retards = eleves.filter(e => e.retard).length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Daara Internat</h1>
        <p className="text-sm text-gray-400 mt-1">154 élèves résidents — 11 mois / 12</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2d6a2d] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Résidents</div>
          <div className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>154</div>
          <div className="text-xs text-gray-400 mt-1">Internat actif</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8961a] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Juz cette semaine</div>
          <div className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>24</div>
          <div className="text-xs text-gray-400 mt-1">juz mémorisés</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a4fa0] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Objectif atteint</div>
          <div className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>{Math.round(atteints/eleves.length*100)}%</div>
          <div className="text-xs text-gray-400 mt-1">des élèves</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">En retard</div>
          <div className="text-3xl font-bold text-red-500" style={{fontFamily:'Georgia,serif'}}>{retards}</div>
          <div className="text-xs text-gray-400 mt-1">élèves à suivre</div>
        </div>
      </div>

      {/* Maîtres */}
      <div className="bg-white rounded-xl border border-gray-100 mb-5">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium">Maîtres coraniques — Présence</span>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {maitres.map(m => (
            <div key={m.id} className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-[#2d6a2d] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                {m.nom.split(' ').map(w => w[0]).slice(0,2).join('')}
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium">{m.nom}</div>
                <div className="text-[10px] text-gray-400">{m.groupe}</div>
              </div>
              <span className="text-[10px] bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">
                ✓ {m.signIn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs mémorisation */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {[
          { key: 'juz', label: 'Juz (avancés)' },
          { key: 'alpha', label: 'Alphabétique (débutants)' },
          { key: 'hizb', label: 'Vue 60 hizb' },
          { key: 'vie', label: 'Vie en internat' },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab === t.key ? 'border-[#2d6a2d] text-[#2d6a2d]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Juz */}
      {tab === 'juz' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-4">Progression par juz — objectif 1 juz / semaine</div>
          <div className="flex flex-col gap-3">
            {juzEleves.map(e => (
              <div key={e.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{e.nom} — Juz {e.juz}</span>
                  <span className={e.atteint ? 'text-green-600' : 'text-red-500'}>
                    {e.atteint ? '✓ Objectif atteint' : '✗ En retard'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${e.atteint ? 'bg-[#2d6a2d]' : 'bg-red-400'}`}
                    style={{width: `${((e.juz ?? 0) / 30) * 100}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
            <strong>Cérémonie prévue vendredi :</strong> Babacar Traoré (Juz 18) et Cheikh Diop (Juz 15) passent devant les maîtres.
          </div>
        </div>
      )}

      {/* Alpha */}
      {tab === 'alpha' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-4">
            Niveaux : <strong>Débutant</strong> → <strong>Qa'ida</strong> → <strong>Iqra 1</strong> → <strong>Iqra 2</strong> → <strong>Iqra 3</strong> → <strong>Nourania</strong> → <strong>Coran</strong>
          </div>
          <div className="flex flex-col gap-3">
            {alphaEleves.map(e => (
              <div key={e.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{e.nom}</span>
                  <span className="text-gray-500">{e.lettreNom} — {e.niveauAlpha}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c8961a] rounded-full transition-all"
                    style={{width: `${(e.lettre! / 28) * 100}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <strong>Rappel :</strong> Les débutants apprennent d'abord les 28 lettres arabes, puis les syllabes, puis les mots courts du Coran.
          </div>
        </div>
      )}

      {/* Hizb 60 */}
      {tab === 'hizb' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-4">Babacar Traoré — Hizb 18 atteint sur 60 (= Juz 9 sur 30)</div>
          <div className="grid grid-cols-10 gap-1 mb-4">
            {Array.from({length: 60}, (_, i) => {
              const n = i + 1
              const done = n <= 18
              const inProgress = n === 19 || n === 20
              return (
                <div key={n} className={`aspect-square rounded flex items-center justify-center text-[9px] font-medium ${done ? 'bg-[#2d6a2d] text-white' : inProgress ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-100 text-gray-400'}`}>
                  {n}
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#2d6a2d] rounded inline-block"/> Mémorisé</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded inline-block"/> En cours</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded inline-block"/> Pas encore</span>
          </div>
        </div>
      )}

      {/* Vie internat */}
      {tab === 'vie' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Qualité des repas', note: 4.3, color: '#2d6a2d' },
              { label: 'Propreté des dortoirs', note: 4.1, color: '#2d6a2d' },
              { label: 'Discipline nocturne', note: 5.0, color: '#2d6a2d' },
              { label: 'Ambiance générale', note: 4.5, color: '#2d6a2d' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.note} / 5</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${item.note/5*100}%`, background: item.color}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg text-xs text-green-800">
            <strong>0 incident cette semaine ✓</strong> — Cérémonie de passage hizb prévue vendredi à 16h. Présence de tous les maîtres confirmée.
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <strong>Rappel internat :</strong> Les 154 élèves vivent, mangent et dorment au daara 11 mois sur 12. Le responsable daara est joignable 7j/7.
          </div>
        </div>
      )}
    </div>
  )
}