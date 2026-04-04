    export type Pole = 'École' | 'Daara' | 'Daara + École'
export type StatutPaiement = 'paid' | 'unpaid' | 'partial'
export type Sexe = 'M' | 'F'

export interface Eleve {
  id: number
  prenom: string
  nom: string
  dob: string
  sexe: Sexe
  pole: Pole
  classe: string
  tuteur: string
  tel: string
  adresse: string
  inscription: number
  inscription_date: string
  mensualite: number
  status: StatutPaiement
  enrolledAt: string
}

export interface Paiement {
  id: number
  studentId: number
  type: 'inscription' | 'mensualite'
  montant: number
  date: string
  payeur: string
  signature: string
  mode: string
  receiptNo: number
  mois?: string
}

export interface Enseignant {
  id: number
  prenom: string
  nom: string
  matiere: string
  classes: string[]
  tel: string
  status: 'present' | 'absent'
  signIn: string | null
  signOut: string | null
}