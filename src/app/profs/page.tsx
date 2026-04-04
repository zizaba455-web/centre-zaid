'use client'
import { useState } from 'react'
import { enseignants, AV_COLORS, getInitiales } from '@/lib/data'
import { Enseignant } from '@/types'

export default function ProfsPage() {
  const [liste, setListe] = useState(enseignants)
  const [selected, setSelected] = useState<Enseignant | null>(null)
  const [search, setSearch] = useState('')

  const filtered = liste.filter(p =>
    `${p.prenom} ${p.nom} ${p.matiere}`.toLowerCase().includes(search.toLowerCase())
  )

  function deleteProf(id: number) {
    if (confirm('Supprimer cet enseignant ?')) {
      setListe(prev => prev.filter(p => p.id !== id))
      setSelected(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Enseignants</h1>
          <p className="text-sm text-gray-400 mt-1">{liste.length} enseignants actifs</p>
        </div>
        <button className="text-sm bg-[#2d6a2d] text-white px-4 py-2 rounded-lg hover:bg-[#4a8c4a] font-medium">
          + Ajouter enseignant
        </button>
      </div>

      <input
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full max-w-sm mb-5 focus:outline-none focus:border-[#2d6a2d]"
        placeholder="Rechercher un enseignant..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Enseignant</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Matière</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Classes</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Présence sem.</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Bonus</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                      style={{background: AV_COLORS[i % AV_COLORS.length]}}>
                      {getInitiales(p.prenom, p.nom)}
                    </div>
                    <span className="font-medium">{p.prenom} {p.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.matiere}</td>
                <td className="px-4 py-3 text-gray-600">{p.classes.join(', ')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${p.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {p.status === 'present' ? '5/5 ✓' : '4/5'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.status === 'present' ? '10 800 F' : '5 400 F'}
                </td>
                <td className="px-4 py-3">
                  <strong className={p.status === 'present' ? 'text-green-600' : 'text-yellow-600'}>
                    {p.status === 'present' ? '9/10' : '7/10'}
                  </strong>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                      ✏ Modifier
                    </button>
                    <button
                      onClick={() => deleteProf(p.id)}
                      className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded">
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal modifier */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{fontFamily:'Georgia,serif'}}>Modifier l'enseignant</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Prénom</label>
                <input defaultValue={selected.prenom} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Nom</label>
                <input defaultValue={selected.nom} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"/>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-medium text-gray-500">Matière</label>
                <input defaultValue={selected.matiere} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Téléphone</label>
                <input defaultValue={selected.tel} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"/>
              </div>
            </div>
            <div className="flex gap-2 justify-between mt-5 pt-4 border-t border-gray-100">
              <button onClick={() => deleteProf(selected.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg">Supprimer</button>
              <div className="flex gap-2">
                <button onClick={() => setSelected(null)} className="text-xs border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">Annuler</button>
                <button onClick={() => setSelected(null)} className="text-xs bg-[#2d6a2d] text-white px-4 py-2 rounded-lg hover:bg-[#4a8c4a]">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}