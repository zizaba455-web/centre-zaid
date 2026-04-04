'use client'
import { useState } from 'react'
import { eleves, CLASSES, POLES, isNouvel, getInitiales, AV_COLORS, getMontant } from '@/lib/data'
import { Eleve, StatutPaiement } from '@/types'

export default function ElevesPage() {
  const [search, setSearch] = useState('')
  const [filterClasse, setFilterClasse] = useState('')
  const [filterPole, setFilterPole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [liste, setListe] = useState<Eleve[]>(eleves)
  const [selected, setSelected] = useState<Eleve | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  const filtered = liste.filter(e => {
    const name = `${e.prenom} ${e.nom}`.toLowerCase()
    return (
      (!search || name.includes(search.toLowerCase())) &&
      (!filterClasse || e.classe === filterClasse) &&
      (!filterPole || e.pole === filterPole) &&
      (!filterStatus || e.status === filterStatus)
    )
  })

  function statusBadge(s: StatutPaiement) {
    if (s === 'paid') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700">✓ Payé</span>
    if (s === 'unpaid') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700">✗ Impayé</span>
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-700">◑ Partiel</span>
  }

  function changeStatus(id: number, status: StatutPaiement) {
    setListe(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }

  function deleteEleve(id: number) {
    if (confirm('Supprimer cet élève ?')) {
      setListe(prev => prev.filter(e => e.id !== id))
      setShowEdit(false)
    }
  }

  function saveEdit(updated: Eleve) {
    setListe(prev => prev.map(e => e.id === updated.id ? updated : e))
    setShowEdit(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Élèves</h1>
        <p className="text-sm text-gray-400 mt-1">{filtered.length} élève(s) affiché(s)</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-[#2d6a2d]"
          placeholder="Rechercher par nom, prénom..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]" value={filterClasse} onChange={e => setFilterClasse(e.target.value)}>
          <option value="">Toutes les classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]" value={filterPole} onChange={e => setFilterPole(e.target.value)}>
          <option value="">Tous les pôles</option>
          {POLES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="paid">Payé</option>
          <option value="unpaid">Impayé</option>
          <option value="partial">Partiel</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-[#1a2818]">{filtered.length} élèves</span>
          <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200">Exporter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Élève</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Classe</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Pôle</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Inscription</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Mensualité</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                        style={{background: AV_COLORS[i % AV_COLORS.length]}}>
                        {getInitiales(e.prenom, e.nom)}
                      </div>
                      <span className="font-medium">{e.prenom} {e.nom}</span>
                      {isNouvel(e.enrolledAt) && (
                        <span className="text-[9px] bg-yellow-100 text-yellow-700 border border-yellow-300 px-1.5 py-0.5 rounded-full">NOUVEAU</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.classe}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${e.pole === 'École' ? 'bg-blue-50 text-blue-700' : e.pole === 'Daara' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {e.pole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.inscription.toLocaleString()} F</td>
                  <td className="px-4 py-3 text-gray-600">{e.mensualite.toLocaleString()} F/mois</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {statusBadge(e.status)}
                      <select
                        className="text-[10px] border border-gray-200 rounded px-1 py-0.5 ml-1"
                        value={e.status}
                        onChange={ev => changeStatus(e.id, ev.target.value as StatutPaiement)}
                      >
                        <option value="paid">Payé</option>
                        <option value="unpaid">Impayé</option>
                        <option value="partial">Partiel</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setSelected(e); setShowEdit(true) }}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                        ✏ Modifier
                      </button>
                      <button
                        onClick={() => deleteEleve(e.id)}
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
      </div>

      {/* Modal modifier */}
      {showEdit && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{fontFamily:'Georgia,serif'}}>Modifier l'élève</h2>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <EditForm eleve={selected} onSave={saveEdit} onDelete={deleteEleve} />
          </div>
        </div>
      )}
    </div>
  )
}

function EditForm({ eleve, onSave, onDelete }: { eleve: Eleve, onSave: (e: Eleve) => void, onDelete: (id: number) => void }) {
  const [form, setForm] = useState({ ...eleve })
  const set = (k: keyof Eleve, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Prénom', key: 'prenom' },
          { label: 'Nom', key: 'nom' },
          { label: 'Date de naissance', key: 'dob', type: 'date' },
          { label: 'Téléphone parent', key: 'tel' },
          { label: 'Tuteur', key: 'tuteur' },
        ].map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">{f.label}</label>
            <input
              type={f.type || 'text'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
              value={String(form[f.key as keyof Eleve])}
              onChange={e => set(f.key as keyof Eleve, e.target.value)}
            />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Classe</label>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.classe} onChange={e => set('classe', e.target.value)}>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs font-medium text-gray-500">Adresse</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.adresse} onChange={e => set('adresse', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 justify-between mt-5 pt-4 border-t border-gray-100">
        <button onClick={() => onDelete(eleve.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg">Supprimer</button>
        <div className="flex gap-2">
          <button onClick={() => onSave(form)} className="text-xs bg-[#2d6a2d] text-white hover:bg-[#4a8c4a] px-4 py-2 rounded-lg">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}