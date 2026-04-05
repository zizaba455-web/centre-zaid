import { getEleves, getEnseignants, getPaiements } from '@/lib/data'

export default async function Dashboard() {
  const eleves = await getEleves()
  const enseignants = await getEnseignants()
  const paiements = await getPaiements()

  const totalEcole = eleves.filter(e => e.pole === 'École' || e.pole === 'Daara + École').length
  const totalDaara = eleves.filter(e => e.pole === 'Daara' || e.pole === 'Daara + École').length
  const totalEncaisse = paiements.reduce((sum, p) => sum + p.montant, 0)
  const impayes = eleves.filter(e => e.status === 'unpaid').length
  const profsPresents = enseignants.filter(e => e.status === 'present').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>
          Tableau de bord
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Centre Zaïd Ibn Thabit — {new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2d6a2d] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Élèves école</div>
          <div className="text-3xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>{totalEcole}</div>
          <div className="text-xs text-gray-400 mt-1">inscrits actifs</div>
          <div className="text-xs text-[#2d6a2d] font-medium mt-2">▲ Supabase ✓</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8961a] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Élèves daara</div>
          <div className="text-3xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>{totalDaara}</div>
          <div className="text-xs text-gray-400 mt-1">résidents</div>
          <div className="text-xs text-[#c8961a] font-medium mt-2">▲ Supabase ✓</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a4fa0] rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Encaissé</div>
          <div className="text-3xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>
            {totalEncaisse > 0 ? `${(totalEncaisse/1000).toFixed(0)}k` : '0'}
          </div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
          <div className="text-xs text-[#1a4fa0] font-medium mt-2">▲ Temps réel</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"/>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Familles impayées</div>
          <div className="text-3xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>{impayes}</div>
          <div className="text-xs text-gray-400 mt-1">à relancer</div>
          <div className="text-xs text-red-500 font-medium mt-2">↓ Action requise</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Alertes */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-[#1a2818]">Alertes à traiter</span>
            <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">3 urgentes</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className="flex gap-2 items-start bg-red-50 text-red-800 text-xs p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"/>
              <span><strong>Sanitaires garçons</strong> — Fuite non résolue depuis 2 jours</span>
            </div>
            <div className="flex gap-2 items-start bg-red-50 text-red-800 text-xs p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"/>
              <span><strong>{impayes} familles impayées</strong> — Relance requise</span>
            </div>
            <div className="flex gap-2 items-start bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1 flex-shrink-0"/>
              <span><strong>CM1</strong> — Retard programme 1 semaine</span>
            </div>
            <div className="flex gap-2 items-start bg-green-50 text-green-800 text-xs p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0"/>
              <span><strong>Daara</strong> — 0 incident cette semaine ✓</span>
            </div>
          </div>
        </div>

        {/* Enseignants */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-[#1a2818]">Enseignants aujourd'hui</span>
            <span className="text-xs text-gray-400">{profsPresents}/{enseignants.length} présents</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {enseignants.map(prof => (
              <div key={prof.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#2d6a2d] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                  {prof.prenom[0]}{prof.nom[0]}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium">{prof.prenom} {prof.nom}</div>
                  <div className="text-[10px] text-gray-400">{prof.matiere}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  prof.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {prof.status === 'present' ? `✓ ${prof.signIn}` : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Élèves */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-[#1a2818]">
            Élèves — données en direct depuis Supabase ✓
          </span>
          <a href="/eleves" className="text-xs text-[#2d6a2d] font-medium hover:underline">Voir tous →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Élève</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Classe</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Pôle</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody>
              {eleves.slice(0, 6).map(e => (
                <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{e.prenom} {e.nom}</td>
                  <td className="px-4 py-3 text-gray-600">{e.classe}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${
                      e.pole === 'École' ? 'bg-blue-50 text-blue-700' :
                      e.pole === 'Daara' ? 'bg-green-50 text-green-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>{e.pole}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${
                      e.status === 'paid' ? 'bg-green-50 text-green-700' :
                      e.status === 'unpaid' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {e.status === 'paid' ? '✓ Payé' : e.status === 'unpaid' ? '✗ Impayé' : '◑ Partiel'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}