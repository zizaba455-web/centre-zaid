import { supabase } from './supabase'
import { Eleve, Enseignant, Paiement } from '@/types'

export const CLASSES = [
  "Jardin d'enfants", 'CI', 'CP', 'CE1', 'CE2',
  'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème',
  '2nde', '1ère', 'Terminale'
]

export const POLES = ['École', 'Daara', 'Daara + École']

// ── ÉLÈVES ──────────────────────────────────────────────
export async function getEleves(): Promise<Eleve[]> {
  const { data, error } = await supabase
    .from('eleves')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data.map(e => ({
    id: e.id,
    prenom: e.prenom,
    nom: e.nom,
    dob: e.dob,
    sexe: e.sexe,
    pole: e.pole,
    classe: e.classe,
    tuteur: e.tuteur,
    tel: e.tel,
    adresse: e.adresse,
    inscription: e.inscription,
    inscription_date: e.inscription_date,
    mensualite: e.mensualite,
    status: e.status,
    enrolledAt: e.enrolled_at,
  }))
}

export async function addEleve(eleve: Omit<Eleve, 'id'>): Promise<Eleve | null> {
  const { data, error } = await supabase
    .from('eleves')
    .insert([{
      prenom: eleve.prenom,
      nom: eleve.nom,
      dob: eleve.dob,
      sexe: eleve.sexe,
      pole: eleve.pole,
      classe: eleve.classe,
      tuteur: eleve.tuteur,
      tel: eleve.tel,
      adresse: eleve.adresse,
      inscription: eleve.inscription,
      inscription_date: eleve.inscription_date,
      mensualite: eleve.mensualite,
      status: eleve.status,
      enrolled_at: eleve.enrolledAt,
    }])
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function updateEleve(id: number, updates: Partial<Eleve>): Promise<void> {
  const { error } = await supabase
    .from('eleves')
    .update(updates)
    .eq('id', id)
  if (error) console.error(error)
}

export async function deleteEleve(id: number): Promise<void> {
  const { error } = await supabase
    .from('eleves')
    .delete()
    .eq('id', id)
  if (error) console.error(error)
}

export async function updateEleveStatus(id: number, status: string): Promise<void> {
  const { error } = await supabase
    .from('eleves')
    .update({ status })
    .eq('id', id)
  if (error) console.error(error)
}

// ── ENSEIGNANTS ──────────────────────────────────────────
export async function getEnseignants(): Promise<Enseignant[]> {
  const { data, error } = await supabase
    .from('enseignants')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error(error); return [] }
  return data.map(e => ({
    id: e.id,
    prenom: e.prenom,
    nom: e.nom,
    matiere: e.matiere,
    classes: e.classes || [],
    tel: e.tel,
    status: e.status,
    signIn: e.sign_in,
    signOut: e.sign_out,
  }))
}

export async function updateEnseignantPointage(id: number, signIn?: string, signOut?: string): Promise<void> {
  const updates: Record<string, string> = {}
  if (signIn) updates.sign_in = signIn
  if (signOut) updates.sign_out = signOut
  const { error } = await supabase
    .from('enseignants')
    .update(updates)
    .eq('id', id)
  if (error) console.error(error)
}

// ── PAIEMENTS ────────────────────────────────────────────
export async function getPaiements(): Promise<Paiement[]> {
  const { data, error } = await supabase
    .from('paiements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data.map(p => ({
    id: p.id,
    studentId: p.student_id,
    type: p.type,
    montant: p.montant,
    date: p.date,
    payeur: p.payeur,
    signature: p.signature,
    mode: p.mode,
    receiptNo: p.receipt_no,
    mois: p.mois,
  }))
}

export async function addPaiement(p: Omit<Paiement, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('paiements')
    .insert([{
      student_id: p.studentId,
      type: p.type,
      montant: p.montant,
      date: p.date,
      payeur: p.payeur,
      signature: p.signature,
      mode: p.mode,
      receipt_no: p.receiptNo,
      mois: p.mois,
    }])
  if (error) console.error(error)
}

// ── HELPERS ───────────────────────────────────────────────
export function isNouvel(enrolledAt: string): boolean {
  const diff = (new Date().getTime() - new Date(enrolledAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  return diff < 2
}

export function getMontant(pole: string, type: 'inscription' | 'mensualite'): number {
  if (pole === 'Daara') return type === 'inscription' ? 30000 : 25000
  if (pole === 'Daara + École') return type === 'inscription' ? 40000 : 35000
  return 15000
}

export function getInitiales(prenom: string, nom: string): string {
  return (prenom[0] + (nom[0] || '')).toUpperCase()
}

export const AV_COLORS = [
  '#2d6a2d', '#c8961a', '#1a4fa0', '#7b4099',
  '#2d7a5a', '#8b3a3a', '#4a6a2d', '#2d4a8b'
]

// données mock pour compatibilité (sera supprimé après migration complète)
export const eleves: Eleve[] = []
export const enseignants: Enseignant[] = []
export const paiements: Paiement[] = []