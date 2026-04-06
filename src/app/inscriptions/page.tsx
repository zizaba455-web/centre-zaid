'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CLASSES, POLES, getInitiales, AV_COLORS } from '@/lib/data'

interface Eleve {
  id: number
  prenom: string
  nom: string
  dob: string
  sexe: string
  pole: string
  classe: string
  tuteur: string
  tel: string
  adresse: string
  inscription: number
  inscription_date: string
  mensualite: number
  status: string
  enrolled_at: string
  archived: boolean
  montant_du: number
  montant_paye: number
  montant_restant: number
  type_paiement: string
}

interface Paiement {
  id: number
  eleve_id: number
  type: string
  montant_du: number
  montant_paye: number
  montant_restant: number
  mode: string
  mois: string
  annee: number
  date_paiement: string
}

const fmt = (n: number) => (n || 0).toLocaleString('fr-FR') + ' F'
const deadline15 = () => `15 ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
const getMoisAnnee = () => ({ mois: new Date().toLocaleDateString('fr-FR', { month: 'long' }), annee: new Date().getFullYear() })

export default function InscriptionsPage() {
  const [eleves, setEleves] = useState<Eleve[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPole, setFilterPole] = useState('')
  const [filterClasse, setFilterClasse] = useState('')
  const [filterSexe, setFilterSexe] = useState('')
  const [showArchives, setShowArchives] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showProfile, setShowProfile] = useState<Eleve | null>(null)
  const [profilePaiements, setProfilePaiements] = useState<Paiement[]>([])
  const [filterMois, setFilterMois] = useState('')
  const [filterAnnee, setFilterAnnee] = useState('')
  const [showEdit, setShowEdit] = useState<Eleve | null>(null)
  const [editMode, setEditMode] = useState('Espèces')
  const [editMontantDu, setEditMontantDu] = useState('')
  const [editMontantPaye, setEditMontantPaye] = useState('')
  const [editType, setEditType] = useState('inscription')
  const [confirmDelete, setConfirmDelete] = useState<Eleve | null>(null)
  const [form, setForm] = useState({
    prenom:'', nom:'', dob:'', sexe:'M', pole:'École', classe:'CE1',
    tuteur:'', tel:'', adresse:'', mode:'Espèces',
    montant_du:'', montant_paye:'', type_paiement:'inscription'
  })

  useEffect(() => { loadEleves() }, [showArchives])

  async function loadEleves() {
    setLoading(true)
    const { data } = await supabase.from('eleves').select('*')
      .eq('archived', showArchives).order('id', { ascending: true })
    setEleves(data || [])
    setLoading(false)
  }

  async function loadPaiements(id: number) {
    const { data } = await supabase.from('paiements').select('*')
      .eq('eleve_id', id).order('date_paiement', { ascending: false })
    setProfilePaiements(data || [])
  }

  const filtered = eleves.filter(e => {
    const name = `${e.prenom} ${e.nom}`.toLowerCase()
    return (
      (!search || name.includes(search.toLowerCase())) &&
      (!filterPole || e.pole === filterPole) &&
      (!filterClasse || e.classe === filterClasse) &&
      (!filterSexe || e.sexe === filterSexe)
    )
  })

  const calcRestant = (du: string, paye: string) => Math.max(0, (parseInt(du)||0) - (parseInt(paye)||0))

  async function addEleve() {
    if (!form.prenom || !form.nom) { alert('Prénom et nom requis'); return }
    if (!form.montant_du) { alert('Montant à payer requis'); return }
    const du = parseInt(form.montant_du)
    const paye = parseInt(form.montant_paye) || 0
    const restant = Math.max(0, du - paye)
    const status = restant === 0 && paye > 0 ? 'paid' : paye > 0 ? 'partial' : 'unpaid'
    const { data } = await supabase.from('eleves').insert([{
      prenom: form.prenom, nom: form.nom, dob: form.dob, sexe: form.sexe,
      pole: form.pole, classe: form.pole === 'Daara' ? '' : form.classe,
      tuteur: form.tuteur, tel: form.tel, adresse: form.adresse,
      inscription: du, mensualite: 0,
      inscription_date: new Date().toISOString().split('T')[0],
      status, archived: false, enrolled_at: new Date().toISOString(),
      montant_du: du, montant_paye: paye, montant_restant: restant,
      type_paiement: form.type_paiement
    }]).select().single()
    if (data && paye > 0) {
      const { mois, annee } = getMoisAnnee()
      await supabase.from('paiements').insert([{
        eleve_id: data.id, eleve_nom: `${form.prenom} ${form.nom}`,
        type: form.type_paiement, montant_du: du, montant_paye: paye,
        montant_restant: restant, mode: form.mode, mois, annee,
        date_paiement: new Date().toISOString()
      }])
      printRecu({...data, montant_du: du, montant_paye: paye, montant_restant: restant, type_paiement: form.type_paiement}, form.mode)
    }
    setShowAdd(false)
    setForm({ prenom:'', nom:'', dob:'', sexe:'M', pole:'École', classe:'CE1', tuteur:'', tel:'', adresse:'', mode:'Espèces', montant_du:'', montant_paye:'', type_paiement:'inscription' })
    loadEleves()
  }

  async function saveEdit() {
    if (!showEdit) return
    const du = parseInt(editMontantDu) || showEdit.montant_du || 0
    const paye = parseInt(editMontantPaye) || 0
    const restant = Math.max(0, du - paye)
    const status = restant === 0 && paye > 0 ? 'paid' : paye > 0 ? 'partial' : 'unpaid'
    await supabase.from('eleves').update({
      prenom: showEdit.prenom, nom: showEdit.nom, pole: showEdit.pole,
      classe: showEdit.pole === 'Daara' ? '' : showEdit.classe,
      tuteur: showEdit.tuteur, tel: showEdit.tel, adresse: showEdit.adresse,
      status, montant_du: du, montant_paye: paye, montant_restant: restant,
      type_paiement: editType,
    }).eq('id', showEdit.id)
    if (paye > 0) {
      const { mois, annee } = getMoisAnnee()
      await supabase.from('paiements').insert([{
        eleve_id: showEdit.id, eleve_nom: `${showEdit.prenom} ${showEdit.nom}`,
        type: editType, montant_du: du, montant_paye: paye,
        montant_restant: restant, mode: editMode, mois, annee,
        date_paiement: new Date().toISOString()
      }])
      printRecu({...showEdit, montant_du: du, montant_paye: paye, montant_restant: restant, type_paiement: editType, status}, editMode)
    }
    setShowEdit(null); setEditMontantDu(''); setEditMontantPaye('')
    loadEleves()
  }

  async function archiveEleve() {
    if (!confirmDelete) return
    await supabase.from('eleves').update({ archived: true, archive_date: new Date().toISOString() }).eq('id', confirmDelete.id)
    setConfirmDelete(null); loadEleves()
  }

  async function deleteDefinitif() {
    if (!confirmDelete) return
    if (!confirm(`Supprimer définitivement ${confirmDelete.prenom} ${confirmDelete.nom} ?`)) return
    await supabase.from('eleves').delete().eq('id', confirmDelete.id)
    setConfirmDelete(null); loadEleves()
  }

  async function restoreEleve(id: number) {
    await supabase.from('eleves').update({ archived: false }).eq('id', id)
    loadEleves()
  }

  function printRecu(eleve: Eleve, mode: string) {
    const win = window.open('', '_blank')
    if (!win) return
    const date = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
    const heure = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
    const solde = (eleve.montant_restant || 0) === 0
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recu #${eleve.id}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Georgia,serif;background:#fff;color:#1a2818;padding:40px;max-width:440px;margin:0 auto}
      .logo{text-align:center;font-size:20px;font-weight:bold;color:#2d6a2d;margin-bottom:3px}
      .subtitle{text-align:center;font-size:11px;color:#888;margin-bottom:5px}
      h1{text-align:center;font-size:15px;color:#1a2818;border-bottom:2px solid #2d6a2d;padding-bottom:12px;margin:16px 0}
      .section-title{font-size:10px;font-weight:700;color:#2d6a2d;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;margin-top:14px}
      .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f3f4f6}
      .row:last-child{border:none}
      .label{color:#666}.value{font-weight:600}
      .amount-box{background:#f9fafb;border-radius:10px;padding:16px;margin:16px 0;border:1px solid #e5e7eb}
      .amount-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #e5e7eb}
      .amount-row:last-child{border:none;padding-top:10px;font-size:15px;font-weight:700}
      .badge-paid{background:#f0fdf4;border:2px solid #16a34a;border-radius:10px;text-align:center;padding:14px;margin:16px 0;color:#16a34a;font-size:15px;font-weight:700}
      .badge-partial{background:#fffbeb;border:2px solid #d97706;border-radius:10px;text-align:center;padding:14px;margin:16px 0;color:#d97706;font-size:14px;font-weight:700}
      .deadline{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px;text-align:center;font-size:12px;color:#c2410c;margin-top:8px}
      .footer{text-align:center;font-size:10px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb}
      .receipt-no{font-size:10px;color:#d1d5db;text-align:right;margin-bottom:12px}
    </style></head><body>
    <div class="receipt-no">N° ${Date.now()}</div>
    <div class="logo">Centre Zaïd Ibn Thabit</div>
    <div class="subtitle">École Franco-Arabe — UCED — Dakar, Sénégal</div>
    <h1>REÇU DE PAIEMENT</h1>
    <div class="section-title">Élève</div>
    <div class="row"><span class="label">Nom complet</span><span class="value">${eleve.prenom} ${eleve.nom}</span></div>
    <div class="row"><span class="label">Référence</span><span class="value">#${eleve.id}</span></div>
    <div class="row"><span class="label">Pôle</span><span class="value">${eleve.pole}${eleve.classe ? ' — ' + eleve.classe : ''}</span></div>
    <div class="row"><span class="label">Tuteur</span><span class="value">${eleve.tuteur || '—'}</span></div>
    <div class="section-title">Paiement</div>
    <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Heure</span><span class="value">${heure}</span></div>
    <div class="row"><span class="label">Type</span><span class="value">${eleve.type_paiement === 'inscription' ? 'Inscription annuelle' : 'Mensualité'}</span></div>
    <div class="row"><span class="label">Mode</span><span class="value">${mode}</span></div>
    <div class="amount-box">
      <div class="amount-row"><span style="color:#666">Montant à payer</span><span>${(eleve.montant_du||0).toLocaleString('fr-FR')} F</span></div>
      <div class="amount-row"><span style="color:#666">Montant versé</span><span style="color:#16a34a;font-weight:600">${(eleve.montant_paye||0).toLocaleString('fr-FR')} F</span></div>
      <div class="amount-row"><span>Restant</span><span style="color:${solde ? '#16a34a' : '#dc2626'}">${(eleve.montant_restant||0).toLocaleString('fr-FR')} F</span></div>
    </div>
    ${solde
      ? `<div class="badge-paid">Payé en intégralité — Merci !</div>`
      : `<div class="badge-partial">Paiement partiel — Reste ${(eleve.montant_restant||0).toLocaleString('fr-FR')} F</div>
         <div class="deadline">Solde attendu avant le ${deadline15()}</div>`
    }
    <div class="footer">Ce reçu fait foi de paiement officiel<br>Centre Zaïd Ibn Thabit — Conservez ce document</div>
    </body></html>`)
    win.document.close(); win.print()
  }

  const poleBadge = (pole: string) => {
    if (pole === 'École') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">École</span>
    if (pole === 'Daara') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700">Daara</span>
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-700">Daara + École</span>
  }

  const statusBadge = (s: string) => {
    if (s === 'paid') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700">Payé</span>
    if (s === 'unpaid') return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700">Impayé</span>
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-700">Partiel</span>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Inscriptions</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} élève(s) — {showArchives ? 'Archives' : 'Actifs'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowArchives(!showArchives)}
            className="text-xs px-4 py-2 rounded-lg border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 shadow-sm">
            {showArchives ? '← Retour aux actifs' : 'Archives'}
          </button>
          {!showArchives && (
            <button onClick={() => setShowAdd(true)}
              className="text-xs bg-[#2d6a2d] text-white px-4 py-2 rounded-lg hover:bg-[#4a8c4a] font-medium shadow-sm">
              + Nouvelle inscription
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total', value: filtered.length, color:'text-[#1a2818]' },
          { label:'Payés', value: filtered.filter(e=>e.status==='paid').length, color:'text-green-600' },
          { label:'Partiels', value: filtered.filter(e=>e.status==='partial').length, color:'text-yellow-600' },
          { label:'Impayés', value: filtered.filter(e=>e.status==='unpaid').length, color:'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{s.label}</div>
            <div className={`text-3xl font-bold ${s.color}`} style={{fontFamily:'Georgia,serif'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-[#2d6a2d] bg-white shadow-sm"
          placeholder="Rechercher par nom, prénom..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d] bg-white shadow-sm"
          value={filterPole} onChange={e => setFilterPole(e.target.value)}>
          <option value="">Tous les pôles</option>
          <option>École</option><option>Daara</option><option>Daara + École</option>
        </select>
        {filterPole !== 'Daara' && (
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d] bg-white shadow-sm"
            value={filterClasse} onChange={e => setFilterClasse(e.target.value)}>
            <option value="">Toutes les classes</option>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
        )}
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d] bg-white shadow-sm"
          value={filterSexe} onChange={e => setFilterSexe(e.target.value)}>
          <option value="">Masculin / Féminin</option>
          <option value="M">Masculin</option><option value="F">Féminin</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['ID','Élève','Pôle','Classe','Tuteur','Montant dû','Restant','Statut','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">Aucun élève trouvé</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e.id} className="hover:bg-[#f7fdf7] cursor-pointer transition-colors"
                  onClick={() => { setShowProfile(e); loadPaiements(e.id) }}>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] bg-green-50 text-[#2d6a2d] px-2 py-0.5 rounded font-semibold">#{e.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{background: AV_COLORS[i % AV_COLORS.length]}}>
                        {getInitiales(e.prenom, e.nom)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a2818]">{e.prenom} {e.nom}</div>
                        <div className="text-gray-400">{e.sexe === 'M' ? 'Masculin' : 'Féminin'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">{poleBadge(e.pole)}</td>
                  <td className="px-5 py-3 text-gray-600">{e.pole === 'Daara' ? '—' : e.classe}</td>
                  <td className="px-5 py-3 text-gray-600">{e.tuteur}</td>
                  <td className="px-5 py-3 font-medium text-[#1a2818]">{e.montant_du ? fmt(e.montant_du) : '—'}</td>
                  <td className="px-5 py-3">
                    {e.montant_restant > 0 ? <span className="font-semibold text-red-600">{fmt(e.montant_restant)}</span>
                      : e.montant_paye > 0 ? <span className="font-semibold text-green-600">Soldé</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3">{statusBadge(e.status)}</td>
                  <td className="px-5 py-3" onClick={ev => ev.stopPropagation()}>
                    <div className="flex gap-1">
                      {showArchives ? (
                        <button onClick={() => restoreEleve(e.id)} className="text-[10px] bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Restaurer</button>
                      ) : (
                        <>
                          <button onClick={() => { setShowEdit({...e}); setEditMode('Espèces'); setEditMontantDu(String(e.montant_du||'')); setEditMontantPaye(''); setEditType(e.type_paiement||'inscription') }}
                            className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">✏</button>
                          <button onClick={() => setConfirmDelete(e)} className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded">✕</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PROFIL */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowProfile(null)}>
          <div className="bg-white rounded-xl shadow-xl overflow-y-auto" style={{width:'600px', height:'600px'}} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2d6a2d] flex items-center justify-center text-white font-bold text-sm">
                  {getInitiales(showProfile.prenom, showProfile.nom)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1a2818]">{showProfile.prenom} {showProfile.nom}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] bg-green-50 text-[#2d6a2d] px-2 py-0.5 rounded font-semibold">#{showProfile.id}</span>
                    {poleBadge(showProfile.pole)}
                    {statusBadge(showProfile.status)}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowProfile(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                {[
                  { label:'Pôle', value: showProfile.pole },
                  { label:'Classe', value: showProfile.pole === 'Daara' ? '—' : showProfile.classe },
                  { label:'Tuteur', value: showProfile.tuteur },
                  { label:'Téléphone', value: showProfile.tel },
                  { label:'Adresse', value: showProfile.adresse },
                  { label:'Inscrit le', value: showProfile.inscription_date },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                    <div className="text-gray-400 mb-0.5">{f.label}</div>
                    <div className="font-semibold text-[#1a2818]">{f.value || '—'}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Situation financière</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant à payer</span>
                    <span className="font-semibold">{fmt(showProfile.montant_du||0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant versé</span>
                    <span className="font-semibold text-green-600">{fmt(showProfile.montant_paye||0)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold">Restant dû</span>
                    <span className={`font-bold ${showProfile.montant_restant > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {showProfile.montant_restant > 0 ? fmt(showProfile.montant_restant) : 'Soldé'}
                    </span>
                  </div>
                  {showProfile.montant_restant > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-700 font-medium text-center">
                      A régler avant le {deadline15()}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Historique paiements</div>
                  <div className="flex gap-1.5">
                    <select value={filterMois} onChange={e => setFilterMois(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none bg-white">
                      <option value="">Tous les mois</option>
                      {['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'].map(m => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <select value={filterAnnee} onChange={e => setFilterAnnee(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none bg-white">
                      <option value="">Toutes</option>
                      {[2024,2025,2026,2027].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                {profilePaiements.filter(p =>
                  (!filterMois || p.mois === filterMois) &&
                  (!filterAnnee || String(p.annee) === filterAnnee)
                ).length === 0 ? (
                  <div className="text-center py-5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400">
                    Aucun paiement enregistré
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {profilePaiements.filter(p =>
                      (!filterMois || p.mois === filterMois) &&
                      (!filterAnnee || String(p.annee) === filterAnnee)
                    ).map(p => (
                      <div key={p.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className={`w-1 h-8 rounded-full flex-shrink-0 ${p.montant_restant === 0 ? 'bg-green-500' : 'bg-yellow-400'}`}/>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-[#1a2818]">
                            {p.type === 'inscription' ? 'Inscription' : 'Mensualité'} — {p.mois} {p.annee}
                          </div>
                          <div className="text-[10px] text-gray-400">{p.mode} · {new Date(p.date_paiement).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-green-600">+{(p.montant_paye||0).toLocaleString('fr-FR')} F</div>
                          {p.montant_restant > 0 && <div className="text-[10px] text-red-500">Reste {(p.montant_restant||0).toLocaleString('fr-FR')} F</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => {
                  setShowEdit({...showProfile}); setEditMode('Espèces')
                  setEditMontantDu(String(showProfile.montant_du||''))
                  setEditMontantPaye(''); setEditType(showProfile.type_paiement||'inscription')
                  setShowProfile(null)
                }} className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">
                  Modifier / Encaisser
                </button>
                <button onClick={() => setShowProfile(null)} className="py-2 px-4 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1a2818]">Nouvelle inscription</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
              {[
                { label:'Prénom', key:'prenom', placeholder:'Abdoulaye' },
                { label:'Nom', key:'nom', placeholder:'Diallo' },
                { label:'Date de naissance', key:'dob', type:'date' },
                { label:'Tuteur / Père', key:'tuteur', placeholder:'Mamadou Diallo' },
                { label:'Téléphone', key:'tel', placeholder:'77 123 45 67' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input type={f.type||'text'} placeholder={f.placeholder}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))} />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Sexe</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.sexe} onChange={e => setForm(prev => ({...prev, sexe: e.target.value}))}>
                  <option value="M">Masculin</option><option value="F">Féminin</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Pôle</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.pole} onChange={e => setForm(prev => ({...prev, pole: e.target.value}))}>
                  {POLES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {form.pole !== 'Daara' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Classe</label>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={form.classe} onChange={e => setForm(prev => ({...prev, classe: e.target.value}))}>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Type paiement</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.type_paiement} onChange={e => setForm(prev => ({...prev, type_paiement: e.target.value}))}>
                  <option value="inscription">Inscription annuelle</option>
                  <option value="mensualite">Mensualité</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Mode paiement</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.mode} onChange={e => setForm(prev => ({...prev, mode: e.target.value}))}>
                  {['Espèces','Wave','Orange Money','Virement'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-medium text-gray-500">Adresse</label>
                <input placeholder="Quartier, Ville" className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.adresse} onChange={e => setForm(prev => ({...prev, adresse: e.target.value}))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Montant à payer (F) *</label>
                <input type="number" placeholder="15000" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                  value={form.montant_du} onChange={e => setForm(prev => ({...prev, montant_du: e.target.value}))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Montant versé (F)</label>
                <input type="number" placeholder="0" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                  value={form.montant_paye} onChange={e => setForm(prev => ({...prev, montant_paye: e.target.value}))} />
              </div>
              {form.montant_du && (
                <div className="col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-100 text-xs">
                  <div className="flex justify-between py-1"><span className="text-gray-500">À payer</span><span className="font-semibold">{(parseInt(form.montant_du)||0).toLocaleString('fr-FR')} F</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Versé</span><span className="font-semibold text-green-600">{(parseInt(form.montant_paye)||0).toLocaleString('fr-FR')} F</span></div>
                  <div className="flex justify-between py-1 border-t border-gray-200 mt-1">
                    <span className="font-semibold">Restant</span>
                    <span className={`font-bold ${calcRestant(form.montant_du, form.montant_paye) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {calcRestant(form.montant_du, form.montant_paye).toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  {calcRestant(form.montant_du, form.montant_paye) > 0 && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-700 text-center">
                      A régler avant le {deadline15()}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={addEleve} className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">Inscrire</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#1a2818]">Modifier / Encaisser</h2>
                <span className="font-mono text-[10px] bg-green-50 text-[#2d6a2d] px-2 py-0.5 rounded font-semibold">ID #{showEdit.id} — permanent</span>
              </div>
              <button onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
              {[
                { label:'Prénom', key:'prenom' },
                { label:'Nom', key:'nom' },
                { label:'Tuteur', key:'tuteur' },
                { label:'Téléphone', key:'tel' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                    value={showEdit[f.key as keyof Eleve] as string}
                    onChange={e => setShowEdit(prev => prev ? {...prev, [f.key]: e.target.value} : null)} />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Pôle</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={showEdit.pole} onChange={e => setShowEdit(prev => prev ? {...prev, pole: e.target.value} : null)}>
                  {POLES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {showEdit.pole !== 'Daara' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Classe</label>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={showEdit.classe} onChange={e => setShowEdit(prev => prev ? {...prev, classe: e.target.value} : null)}>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Type paiement</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={editType} onChange={e => setEditType(e.target.value)}>
                  <option value="inscription">Inscription annuelle</option>
                  <option value="mensualite">Mensualité</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Mode paiement</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={editMode} onChange={e => setEditMode(e.target.value)}>
                  {['Espèces','Wave','Orange Money','Virement'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Montant à payer (F)</label>
                <input type="number" placeholder={String(showEdit.montant_du||'')}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                  value={editMontantDu} onChange={e => setEditMontantDu(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Montant versé (F)</label>
                <input type="number" placeholder="0"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                  value={editMontantPaye} onChange={e => setEditMontantPaye(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-medium text-gray-500">Adresse</label>
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={showEdit.adresse}
                  onChange={e => setShowEdit(prev => prev ? {...prev, adresse: e.target.value} : null)} />
              </div>
              {editMontantDu && (
                <div className="col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-100 text-xs">
                  <div className="flex justify-between py-1"><span className="text-gray-500">À payer</span><span className="font-semibold">{(parseInt(editMontantDu)||0).toLocaleString('fr-FR')} F</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Versé</span><span className="font-semibold text-green-600">{(parseInt(editMontantPaye)||0).toLocaleString('fr-FR')} F</span></div>
                  <div className="flex justify-between py-1 border-t border-gray-200 mt-1">
                    <span className="font-semibold">Restant</span>
                    <span className={`font-bold ${calcRestant(editMontantDu, editMontantPaye) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {calcRestant(editMontantDu, editMontantPaye).toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  {calcRestant(editMontantDu, editMontantPaye) > 0 && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-700 text-center">
                      A régler avant le {deadline15()}
                    </div>
                  )}
                </div>
              )}
              {parseInt(editMontantPaye||'0') > 0 && (
                <div className="col-span-2 bg-green-50 border border-green-200 rounded-lg p-2.5 text-green-700 text-xs font-medium text-center">
                  Un reçu sera généré automatiquement
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-2">
              <button onClick={() => setShowEdit(null)} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={saveEdit} className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMATION */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <span className="text-red-500 font-bold">!</span>
            </div>
            <h2 className="text-base font-bold text-[#1a2818] mb-1">Que faire ?</h2>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{confirmDelete.prenom} {confirmDelete.nom}</strong>
              <span className="block mt-1 font-mono text-xs text-gray-400">ID #{confirmDelete.id}</span>
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={archiveEleve}
                className="w-full py-2.5 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 font-medium">
                Archiver — dossier conservé, restaurable
              </button>
              <button onClick={deleteDefinitif}
                className="w-full py-2.5 text-xs bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 font-medium">
                Supprimer définitivement — irréversible
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="w-full py-2.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}