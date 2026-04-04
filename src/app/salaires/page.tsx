export default function SalairesPage() {
  const equipe = [
    { nom: 'Oumar Diallo', poste: 'Directeur', base: 500000, bonus: 50000, verse: true },
    { nom: 'Dir. Opérationnel', poste: 'Dir. Opérationnel', base: 380000, bonus: 57000, verse: true },
    { nom: 'Ndéye Fatou Sarr', poste: 'Resp. École', base: 220000, bonus: 26400, verse: true },
    { nom: 'Serigne Omar Diop', poste: 'Resp. Daara', base: 200000, bonus: 24000, verse: true },
    { nom: 'Astou Cissé', poste: 'Resp. Admin', base: 180000, bonus: 18000, verse: false },
    { nom: 'Ibrahima Diallo', poste: 'Enseignant', base: 135000, bonus: 10800, verse: false },
    { nom: 'Moussa Ndiaye', poste: 'Enseignant', base: 135000, bonus: 5400, verse: false },
    { nom: 'Fatou Mbaye', poste: 'Enseignant', base: 135000, bonus: 10800, verse: false },
    { nom: 'Boubacar Diallo', poste: 'Logistique', base: 95000, bonus: 4750, verse: false },
  ]

  const totalBase = equipe.reduce((s, e) => s + e.base, 0)
  const totalBonus = equipe.reduce((s, e) => s + e.bonus, 0)
  const totalNet = equipe.reduce((s, e) => s + e.base + e.bonus, 0)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Salaires & Bonus</h1>
        <p className="text-sm text-gray-400 mt-1">Juillet 2025</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Masse salariale base</div>
          <div className="text-2xl font-bold" style={{fontFamily:'Georgia,serif'}}>{totalBase.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total bonus</div>
          <div className="text-2xl font-bold text-[#c8961a]" style={{fontFamily:'Georgia,serif'}}>{totalBonus.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total net à verser</div>
          <div className="text-2xl font-bold text-[#2d6a2d]" style={{fontFamily:'Georgia,serif'}}>{totalNet.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">FCFA</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium">Équipe — {equipe.length} personnes</span>
          <button className="text-xs bg-[#2d6a2d] text-white px-3 py-1.5 rounded-lg hover:bg-[#4a8c4a]">
            Générer fiches de paie PDF
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Employé</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Poste</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Salaire base</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Bonus</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Total net</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium uppercase tracking-wide">Versé ?</th>
            </tr>
          </thead>
          <tbody>
            {equipe.map((e, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{e.nom}</td>
                <td className="px-4 py-3 text-gray-600">{e.poste}</td>
                <td className="px-4 py-3 text-gray-600">{e.base.toLocaleString()} F</td>
                <td className="px-4 py-3 text-[#c8961a] font-medium">+{e.bonus.toLocaleString()} F</td>
                <td className="px-4 py-3 font-bold">{(e.base + e.bonus).toLocaleString()} F</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${e.verse ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {e.verse ? '✓ Versé' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td className="px-4 py-3 font-bold" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 font-bold">{totalBase.toLocaleString()} F</td>
              <td className="px-4 py-3 font-bold text-[#c8961a]">+{totalBonus.toLocaleString()} F</td>
              <td className="px-4 py-3 font-bold text-[#2d6a2d]">{totalNet.toLocaleString()} F</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}