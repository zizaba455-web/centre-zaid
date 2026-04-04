'use client'
import { useState } from 'react'

const conversations = [
  { id: 1, nom: 'Ndéye Fatou Sarr', role: 'Resp. École', initiales: 'NF', color: '#1a4fa0', messages: [
    { from: 'them', text: 'Bonjour, rapport semaine remis. Présence 91%. 0 incident grave.', time: 'Ven 16h42' },
    { from: 'me', text: 'Bien reçu. Score 7,4/10. Point lundi sur CM1.', time: 'Ven 18h05' },
    { from: 'them', text: 'Ousmane Traoré sera là à 7h30 pour le rattrapage.', time: 'Ven 18h12' },
  ]},
  { id: 2, nom: 'Serigne Omar Diop', role: 'Resp. Daara', initiales: 'SO', color: '#2d6a2d', messages: [
    { from: 'them', text: 'Cérémonie hizb confirmée vendredi. 3 élèves passent.', time: 'Jeu 14h20' },
    { from: 'me', text: 'Très bien. Je serai présent.', time: 'Jeu 15h00' },
  ]},
  { id: 3, nom: 'Astou Cissé', role: 'Resp. Admin', initiales: 'AC', color: '#c8961a', messages: [
    { from: 'them', text: '15 familles impayées. Relance envoyée à 12 d\'entre elles.', time: 'Mer 10h30' },
    { from: 'me', text: 'Bien. Convoquer les 3 restantes lundi matin.', time: 'Mer 11h00' },
  ]},
  { id: 4, nom: 'Boubacar Diallo', role: 'Resp. Logistique', initiales: 'BD', color: '#7b4099', messages: [
    { from: 'them', text: 'Plombier confirme intervention lundi 9h pour les sanitaires.', time: 'Ven 09h15' },
  ]},
]

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0])
  const [newMsg, setNewMsg] = useState('')
  const [msgs, setMsgs] = useState(conversations[0].messages)
  const [smsDest, setSmsDest] = useState('Tous les parents')
  const [smsText, setSmsText] = useState('')
  const [smsSent, setSmsSent] = useState(false)

  function selectConv(conv: typeof conversations[0]) {
    setActiveConv(conv)
    setMsgs(conv.messages)
  }

  function sendMsg() {
    if (!newMsg.trim()) return
    const now = new Date()
    const time = `${now.getHours()}h${String(now.getMinutes()).padStart(2,'0')}`
    setMsgs(prev => [...prev, { from: 'me', text: newMsg, time }])
    setNewMsg('')
  }

  function sendSms() {
    if (!smsText.trim()) return
    setSmsSent(true)
    setTimeout(() => setSmsSent(false), 3000)
    setSmsText('')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a2818]" style={{fontFamily:'Georgia,serif'}}>Messages</h1>
        <p className="text-sm text-gray-400 mt-1">Messagerie interne & SMS parents</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Messagerie équipe */}
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{height: '500px'}}>
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">Messagerie équipe</span>
          </div>

          {/* Liste conversations */}
          <div className="flex border-b border-gray-100">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => selectConv(conv)}
                className={`flex-1 flex flex-col items-center py-2 px-1 text-[10px] transition-all border-b-2 ${activeConv.id === conv.id ? 'border-[#2d6a2d] text-[#2d6a2d]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-semibold mb-1"
                  style={{background: conv.color}}>
                  {conv.initiales}
                </div>
                <span className="font-medium leading-tight text-center">{conv.nom.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex flex-col max-w-[80%] ${m.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${m.from === 'me' ? 'bg-[#2d6a2d] text-white' : 'bg-gray-100 text-[#1a2818]'}`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a2d]"
              placeholder="Écrire un message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
            />
            <button onClick={sendMsg} className="bg-[#2d6a2d] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#4a8c4a]">
              ➤
            </button>
          </div>
        </div>

        {/* SMS Parents */}
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{height: '500px'}}>
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">SMS aux parents</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Destinataires</label>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d]"
                value={smsDest}
                onChange={e => setSmsDest(e.target.value)}>
                <option>Tous les parents</option>
                <option>Parents élèves impayés</option>
                <option>Parents École uniquement</option>
                <option>Parents Daara uniquement</option>
                <option>Parents Daara + École</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Message</label>
              <textarea
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a2d] resize-none"
                rows={6}
                placeholder="Assalamu alaikum. Message aux parents..."
                value={smsText}
                onChange={e => setSmsText(e.target.value)}
              />
              <div className="text-[10px] text-gray-400 text-right">{smsText.length} caractères</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
              <div className="flex justify-between mb-1">
                <span>Destinataires disponibles</span>
                <span className="font-medium text-[#2d6a2d]">237 numéros</span>
              </div>
              <div className="flex justify-between">
                <span>Sans numéro enregistré</span>
                <span className="font-medium text-red-500">15 parents</span>
              </div>
            </div>

            {smsSent && (
              <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg font-medium text-center">
                ✓ SMS envoyé à {smsDest} !
              </div>
            )}

            <div className="flex gap-2 mt-auto">
              <button onClick={() => setSmsText('')} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                Effacer
              </button>
              <button onClick={sendSms} className="flex-1 py-2 text-xs bg-[#2d6a2d] text-white rounded-lg hover:bg-[#4a8c4a] font-medium">
                Envoyer SMS ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}