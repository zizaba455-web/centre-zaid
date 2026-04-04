'use client'
import { useState } from 'react'
import { eleves, paiements, getMontant, CLASSES, POLES } from '@/lib/data'

export default function FinancePage() {
  const [tab, setTab] = useState<'inscription'|'impayes'|'depenses'>('inscription')
  const [type, setType] = useState<'inscription'|'mensualite'>('inscription')
  const [pole, setPole] = useState('École')
  const [signed, setSigned] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [form, setForm] = useState({
    prenom:'', nom:'', dob:'', sexe:'M', classe:'CE1',
    tuteur:'', tel:'', adresse:'', payeur:'', mode:'Espèces'
  })

  const montant = getMontant(pole, type)
  const totalEncaisse = paiements.reduce((s, p) => s + p.montant, 0)
  const totalDepense = 1508000
  const solde = totalEncaisse - totalDepense
  const impayes = eleves.filter(e => e.status === 'unpaid')

  function set(k: string, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function submit() {
    if (!form.prenom || !form.nom) { alert('Prénom et nom requis'); return }
    setShowReceipt(true)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Finance & caisse</h1>
        <p className="text-sm text-gray-400 mt-1">Juillet 2025</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2d6a2d] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total encaissé</div>
          <div className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>{totalEncaisse.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total dépensé</div>
          <div className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>{totalDepense.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a4fa0] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Solde disponible</div>
          <div className="text-3xl font-bold text-[#2d6a2d]" style={{fontFamily:'Georgia,serif'}}>{solde.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {[
          { key: 'inscription', label: 'Nouvelle inscription / paiement' },
          { key: 'impayes', label: `Impayés (${impayes.length})` },
          { key: 'depenses', label: 'Dépenses' },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab === t.key ? 'border-[#2d6a2d] text-[#2d6a2d]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Inscription */}
      {tab === 'inscription' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type de transaction</div>
            <div className="flex gap-2">
              <button onClick={() => setType('inscription')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${type === 'inscription' ? 'bg-[#2d6a2d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Inscription annuelle
              </button>
              <button onClick={() => setType('mensualite')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${type === 'mensualite' ? 'bg-[#2d6a2d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Mensualité
              </button>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Informations élève</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Prénom', key: 'prenom', placeholder: 'Abdoulaye' },
              { label: 'Nom de famille', key: 'nom', placeholder: 'Diallo' },
              { label: 'Date de naissance', key: 'dob', type: 'date' },
              { label: 'Tuteur / Père', key: 'tuteur', placeholder: 'Mamadou Diallo' },
              { label: 'Téléphone parent', key: 'tel', placeholder: '77 123 45 67' },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                  value={form[f.key as keyof typeof form]}
                  onChange={e => set(f.key, e.target.value)}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Sexe</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.sexe} onChange={e => set('sexe', e.target.value)}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Pôle</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={pole} onChange={e => setPole(e.target.value)}>
                {POLES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Classe</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.classe} onChange={e => set('classe', e.target.value)}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-gray-500">Adresse</label>
              <input placeholder="Quartier, Ville" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.adresse} onChange={e => set('adresse', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Nom du payeur</label>
              <input placeholder="Mamadou Diallo (père)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.payeur} onChange={e => set('payeur', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Mode de paiement</label>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.mode} onChange={e => set('mode', e.target.value)}>
                {['Espèces','Wave','Orange Money','Virement'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Montant auto */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-green-700 font-medium">Montant calculé automatiquement</span>
            <span className="text-xl font-bold text-green-700">{montant.toLocaleString()} FCFA</span>
          </div>

          {/* Signature */}
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-xs font-medium text-gray-500">Signature du payeur</label>
            <div
              onClick={() => setSigned(!signed)}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer text-sm transition-all ${signed ? 'border-green-400 bg-green-50 text-green-700 font-medium' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
              {signed ? '✓ Signature apposée — ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}) : 'Cliquer pour apposer la signature'}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setForm({prenom:'',nom:'',dob:'',sexe:'M',classe:'CE1',tuteur:'',tel:'',adresse:'',payeur:'',mode:'Espèces'})} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={submit} className="px-6 py-2 text-sm bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">Inscrire & Générer reçu ✓</button>
          </div>
        </div>
      )}

      {/* Tab: Impayés */}
      {tab === 'impayes' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium">Familles impayées</span>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{impayes.length} familles</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Élève</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Classe</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Pôle</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Montant dû</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Tuteur</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Téléphone</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {impayes.map(e => (
                <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{e.prenom} {e.nom}</td>
                  <td className="px-4 py-3 text-gray-600">{e.classe}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{e.pole}</span></td>
                  <td className="px-4 py-3 font-medium text-red-600">{e.mensualite.toLocaleString()} F</td>
                  <td className="px-4 py-3 text-gray-600">{e.tuteur}</td>
                  <td className="px-4 py-3 text-gray-600">{e.tel}</td>
                  <td className="px-4 py-3">
                    <button className="text-[10px] bg-[#2d6a2d] text-white px-3 py-1 rounded-lg hover:bg-[#4a8c4a]">SMS relance</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Dépenses */}
      {tab === 'depenses' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium">Dépenses du mois</span>
            <button className="text-xs bg-[#2d6a2d] text-white px-3 py-1.5 rounded-lg hover:bg-[#4a8c4a]">+ Nouvelle dépense</button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Catégorie</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Description</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Montant</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Bon signé</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Salaires', desc: 'Profs + Admin — Juillet', montant: 1350000, date: '01/07' },
                { cat: 'Entretien', desc: 'Plombier sanitaires', montant: 45000, date: '22/07' },
                { cat: 'Fournitures', desc: 'Craies + cahiers', montant: 18000, date: '23/07' },
                { cat: 'Alimentation', desc: 'Daara — semaine', montant: 95000, date: '25/07' },
              ].map((d, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.cat}</td>
                  <td className="px-4 py-3 text-gray-600">{d.desc}</td>
                  <td className="px-4 py-3 font-medium text-red-600">{d.montant.toLocaleString()} F</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">✓ Signé</span></td>
                  <td className="px-4 py-3 text-gray-600">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal reçu */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{fontFamily:'Georgia,serif'}}>Reçu de paiement</h2>
              <button onClick={() => setShowReceipt(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 text-xs">
              <div className="text-center border-b border-dashed border-gray-200 pb-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-[#2d6a2d] flex items-center justify-center text-[#2d6a2d] font-bold text-sm mx-auto mb-2">ZT</div>
                <div className="font-bold text-sm text-[#2d6a2d]">Centre Zaïd Ibn Thabit</div>
                <div className="text-gray-400 text-[10px] mt-1">UCED — الجمعية الخيرية للتربية والتنمية</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Reçu N° {535 + paiements.length} — {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-500">Élève</span><span className="font-medium">{form.prenom} {form.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Classe</span><span>{form.classe}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pôle</span><span>{pole}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{type === 'inscription' ? 'Inscription annuelle' : 'Mensualité'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Mode</span><span>{form.mode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payeur</span><span>{form.payeur || form.tuteur}</span></div>
                {signed && <div className="flex justify-between"><span className="text-gray-500">Signature</span><span className="font-medium text-green-600">✓ Apposée</span></div>}
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-bold">TOTAL PAYÉ</span>
                  <span className="font-bold text-[#2d6a2d] text-sm">{montant.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="text-center text-gray-400 text-[10px] border-t border-dashed border-gray-200 pt-3 mt-3">
                Paiement confirmé ✓<br/>علم وعمل السلف الصالح
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowReceipt(false)} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Fermer</button>
              <button onClick={() => window.print()} className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">Imprimer PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}