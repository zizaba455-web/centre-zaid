'use client'
import { useState } from 'react'
import { enseignants } from '@/lib/data'

export default function PresencesProfsPage() {
  const [profs, setProfs] = useState(enseignants)
  const [tab, setTab] = useState<'pointage'|'planning'|'remplacements'>('pointage')

  function signIn(id: number) {
    const now = new Date()
    const time = `${now.getHours()}h${String(now.getMinutes()).padStart(2,'0')}`
    setProfs(prev => prev.map(p => p.id === id ? { ...p, signIn: time, status: 'present' as const } : p))
  }

  function signOut(id: number) {
    const now = new Date()
    const time = `${now.getHours()}h${String(now.getMinutes()).padStart(2,'0')}`
    setProfs(prev => prev.map(p => p.id === id ? { ...p, signOut: time } : p))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Présences enseignants</h1>
        <p className="text-sm text-gray-400 mt-1">Lundi 07 Juillet 2025</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {[
          { key: 'pointage', label: 'Pointage du jour' },
          { key: 'planning', label: 'Planning semaine' },
          { key: 'remplacements', label: 'Remplacements' },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab === t.key ? 'border-[#2d6a2d] text-[#2d6a2d]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Pointage */}
      {tab === 'pointage' && (
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium">Pointage — chaque enseignant signe à l'arrivée et au départ</span>
            <span className="text-xs text-gray-400">
              {profs.filter(p => p.status === 'present').length}/{profs.length} présents
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {profs.map(prof => (
              <div key={prof.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-[#2d6a2d] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {prof.prenom[0]}{prof.nom[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{prof.prenom} {prof.nom}</div>
                  <div className="text-xs text-gray-400">{prof.matiere}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${prof.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {prof.status === 'present' ? 'Présent' : 'Absent'}
                </span>
                <div className="text-xs text-gray-400 w-24 text-center">
                  {prof.signIn ? `Arrivée: ${prof.signIn}` : '—'}
                </div>
                <div className="text-xs text-gray-400 w-24 text-center">
                  {prof.signOut ? `Départ: ${prof.signOut}` : '—'}
                </div>
                <button
                  onClick={() => signIn(prof.id)}
                  disabled={!!prof.signIn}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${prof.signIn ? 'bg-green-50 text-green-700 font-medium cursor-default' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                  {prof.signIn ? '✓ Arrivée' : 'Signer arrivée'}
                </button>
                <button
                  onClick={() => signOut(prof.id)}
                  disabled={!prof.signIn || !!prof.signOut}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${prof.signOut ? 'bg-green-50 text-green-700 font-medium cursor-default' : !prof.signIn ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                  {prof.signOut ? '✓ Départ' : 'Signer départ'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planning */}
      {tab === 'planning' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="w-20 py-2 px-3 text-left text-gray-400 font-medium">Horaire</th>
                  {['Lundi','Mardi','Mercredi','Jeudi','Vendredi'].map(j => (
                    <th key={j} className="py-2 px-2 text-center bg-[#2d6a2d] text-white font-medium rounded-lg mx-0.5">{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { heure: '08h–09h', cours: ['Français CE1\nI.Diallo', 'Maths CM1\nM.Ndiaye', 'Sciences 6è\nF.Mbaye', 'Arabe CE2\nA.Baldé', 'Islam\nC.Fall'] },
                  { heure: '09h–10h', cours: ['Maths CE2\nO.Traoré', 'Français CM2\nI.Diallo', 'ABSENT\nM.Ndiaye', 'Remplac.\nO.Traoré', 'Sciences 5è\nF.Mbaye'] },
                  { heure: '10h–11h', cours: ['Arabe CM1\nA.Baldé', 'Islam 6è\nC.Fall', 'Français CE2\nI.Diallo', 'Maths 5è\nM.Ndiaye', '—'] },
                  { heure: '11h–12h', cours: ['Sciences CE1\nF.Mbaye', '—', 'Arabe 6è\nA.Baldé', 'Islam CM2\nC.Fall', 'Maths CE1\nO.Traoré'] },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3 text-gray-400 text-right">{row.heure}</td>
                    {row.cours.map((c, j) => (
                      <td key={j} className="py-1 px-1">
                        <div className={`text-center py-2 px-1 rounded-lg text-[10px] leading-tight whitespace-pre-line ${
                          c === '—' ? 'bg-gray-50 text-gray-300' :
                          c.includes('ABSENT') ? 'bg-red-50 text-red-600 border border-red-200' :
                          c.includes('Remplac') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {c}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 mt-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-50 border border-blue-100 rounded inline-block"/> Cours normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-50 border border-red-200 rounded inline-block"/> Absence</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded inline-block"/> Remplacement</span>
            </div>
          </div>
        </div>
      )}

      {/* Remplacements */}
      {tab === 'remplacements' && (
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium">Remplacements actifs</span>
            <button className="text-xs bg-[#2d6a2d] text-white px-3 py-1.5 rounded-lg">+ Nouveau</button>
          </div>
          <div className="p-4">
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg mb-4 flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"/>
              <span><strong>Moussa Ndiaye</strong> absent aujourd'hui — Maths CM1/CM2 non couverts à 09h</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Prof absent</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Classe</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Horaire</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Remplaçant</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-50">
                  <td className="px-3 py-3">M. Ndiaye</td>
                  <td className="px-3 py-3">CM1</td>
                  <td className="px-3 py-3">09h–10h</td>
                  <td className="px-3 py-3">
                    <select className="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option>Ousmane Traoré</option>
                      <option>Ibrahima Diallo</option>
                    </select>
                  </td>
                  <td className="px-3 py-3"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Confirmé</span></td>
                </tr>
                <tr className="border-t border-gray-50">
                  <td className="px-3 py-3">M. Ndiaye</td>
                  <td className="px-3 py-3">CM2</td>
                  <td className="px-3 py-3">10h–11h</td>
                  <td className="px-3 py-3">
                    <select className="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option>— Choisir —</option>
                      <option>Fatou Mbaye</option>
                      <option>Cheikh Fall</option>
                    </select>
                  </td>
                  <td className="px-3 py-3"><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">En attente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}