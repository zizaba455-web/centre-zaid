import { Eleve, Enseignant, Paiement } from '@/types'

export const CLASSES = [
  "Jardin d'enfants", 'CI', 'CP', 'CE1', 'CE2',
  'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème',
  '2nde', '1ère', 'Terminale'
]

export const POLES = ['École', 'Daara', 'Daara + École']

export let eleves: Eleve[] = [
  { id: 1, prenom: 'Abdoulaye', nom: 'Diallo', dob: '2015-03-12', sexe: 'M', pole: 'École', classe: 'CE1', tuteur: 'Mamadou Diallo', tel: '775001234', adresse: 'Médina, Dakar', inscription: 15000, inscription_date: '2024-09-01', mensualite: 15000, status: 'paid', enrolledAt: '2024-09-01' },
  { id: 2, prenom: 'Mariama', nom: 'Sow', dob: '2014-07-22', sexe: 'F', pole: 'École', classe: 'CE2', tuteur: 'Ibou Sow', tel: '776002345', adresse: 'Plateau, Dakar', inscription: 15000, inscription_date: '2024-09-01', mensualite: 15000, status: 'unpaid', enrolledAt: '2024-09-01' },
  { id: 3, prenom: 'Ousmane', nom: 'Traoré', dob: '2013-11-05', sexe: 'M', pole: 'Daara', classe: 'Daara Niv.2', tuteur: 'Sékou Traoré', tel: '771003456', adresse: 'Pikine', inscription: 30000, inscription_date: '2024-09-01', mensualite: 25000, status: 'paid', enrolledAt: '2024-09-01' },
  { id: 4, prenom: 'Khadija', nom: 'Ndiaye', dob: '2016-01-18', sexe: 'F', pole: 'École', classe: 'CP', tuteur: 'Omar Ndiaye', tel: '770004567', adresse: 'Guédiawaye', inscription: 15000, inscription_date: '2024-09-01', mensualite: 15000, status: 'partial', enrolledAt: '2024-09-01' },
  { id: 5, prenom: 'Cheikh', nom: 'Fall', dob: '2012-05-30', sexe: 'M', pole: 'École', classe: 'CM1', tuteur: 'Pape Fall', tel: '778005678', adresse: 'Yoff, Dakar', inscription: 15000, inscription_date: '2024-09-01', mensualite: 15000, status: 'paid', enrolledAt: '2024-09-01' },
  { id: 6, prenom: 'Fatou', nom: 'Ba', dob: '2017-09-14', sexe: 'F', pole: 'École', classe: "Jardin d'enfants", tuteur: 'Alioune Ba', tel: '772006789', adresse: 'Rufisque', inscription: 12000, inscription_date: '2025-07-01', mensualite: 12000, status: 'unpaid', enrolledAt: '2025-07-01' },
  { id: 7, prenom: 'Lamine', nom: 'Kouyaté', dob: '2011-04-03', sexe: 'M', pole: 'Daara + École', classe: '6ème', tuteur: 'Boubacar Kouyaté', tel: '773007890', adresse: 'Thiès', inscription: 40000, inscription_date: '2024-09-01', mensualite: 35000, status: 'paid', enrolledAt: '2024-09-01' },
  { id: 8, prenom: 'Aïssatou', nom: 'Baldé', dob: '2015-12-20', sexe: 'F', pole: 'École', classe: 'CI', tuteur: 'Mamadou Baldé', tel: '774008901', adresse: 'Ziguinchor', inscription: 15000, inscription_date: '2025-07-01', mensualite: 15000, status: 'paid', enrolledAt: '2025-07-01' },
]

export let enseignants: Enseignant[] = [
  { id: 1, prenom: 'Ibrahima', nom: 'Diallo', matiere: 'Français / Histoire', classes: ['CE1', 'CE2'], tel: '775100001', status: 'present', signIn: '07h28', signOut: null },
  { id: 2, prenom: 'Moussa', nom: 'Ndiaye', matiere: 'Mathématiques', classes: ['CM1', 'CM2'], tel: '776100002', status: 'absent', signIn: null, signOut: null },
  { id: 3, prenom: 'Fatou', nom: 'Mbaye', matiere: 'Sciences / Anglais', classes: ['6ème', '5ème'], tel: '771100003', status: 'present', signIn: '07h35', signOut: null },
  { id: 4, prenom: 'Aissatou', nom: 'Baldé', matiere: 'Arabe classique', classes: ['CE1', 'CE2', 'CM1'], tel: '770100004', status: 'present', signIn: '07h30', signOut: null },
  { id: 5, prenom: 'Cheikh', nom: 'Fall Diop', matiere: 'Éducation islamique', classes: ['Toutes'], tel: '778100005', status: 'present', signIn: '07h15', signOut: null },
]

export let paiements: Paiement[] = [
  { id: 1, studentId: 1, type: 'mensualite', montant: 15000, date: '2025-07-01', payeur: 'Mamadou Diallo', signature: 'MD', mode: 'Espèces', receiptNo: 534, mois: 'Juillet 2025' },
  { id: 2, studentId: 3, type: 'mensualite', montant: 25000, date: '2025-07-01', payeur: 'Sékou Traoré', signature: 'ST', mode: 'Wave', receiptNo: 533, mois: 'Juillet 2025' },
  { id: 3, studentId: 5, type: 'mensualite', montant: 15000, date: '2025-07-02', payeur: 'Pape Fall', signature: 'PF', mode: 'Orange Money', receiptNo: 532, mois: 'Juillet 2025' },
  { id: 4, studentId: 7, type: 'inscription', montant: 40000, date: '2024-09-01', payeur: 'Boubacar Kouyaté', signature: 'BK', mode: 'Espèces', receiptNo: 531 },
]

export function isNouvel(enrolledAt: string): boolean {
  const diff = (new Date().getTime() - new Date(enrolledAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  return diff < 2
}

export function getMontant(pole: string, type: 'inscription' | 'mensualite'): number {
  if (pole === 'Daara') return type === 'inscription' ? 30000 : 25000
  if (pole === 'Daara + École') return type === 'inscription' ? 40000 : 35000
  return type === 'inscription' ? 15000 : 15000
}

export function getInitiales(prenom: string, nom: string): string {
  return (prenom[0] + (nom[0] || '')).toUpperCase()
}

export const AV_COLORS = [
  '#2d6a2d', '#c8961a', '#1a4fa0', '#7b4099',
  '#2d7a5a', '#8b3a3a', '#4a6a2d', '#2d4a8b'
]