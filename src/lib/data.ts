import type { Patient, Appointment, Treatment, Invoice, InventoryItem, TreatmentPlan } from '@/lib/types';

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Fatima Zahra',
    avatar: 'https://picsum.photos/seed/1/100/100',
    email: 'fatima.zahra@email.com',
    phone: '+212 6 01 23 45 67',
    dateOfBirth: '1985-05-15',
    address: '123 Rue Al Amal, Casablanca, Maroc',
    allergies: ['Pénicilline'],
    medicalHistory: ['Hypertension'],
    notes: 'Patiente un peu anxieuse, rassurer avant les soins.',
  },
  {
    id: '2',
    name: 'Youssef El Amrani',
    avatar: 'https://picsum.photos/seed/2/100/100',
    email: 'youssef.elamrani@email.com',
    phone: '+212 6 12 34 56 78',
    dateOfBirth: '1992-09-20',
    address: '456 Avenue des FAR, Rabat, Maroc',
    allergies: [],
    medicalHistory: [],
    notes: 'Vient pour un contrôle annuel.',
  },
  {
    id: '3',
    name: 'Amina Benjelloun',
    avatar: 'https://picsum.photos/seed/3/100/100',
    email: 'amina.benjelloun@email.com',
    phone: '+212 6 23 45 67 89',
    dateOfBirth: '1978-12-10',
    address: '789 Boulevard Mohammed V, Marrakech, Maroc',
    allergies: ['Latex'],
    medicalHistory: ['Diabète de type 2'],
    notes: 'Nécessite des gants sans latex.',
  },
  {
    id: '4',
    name: 'Karim Alaoui',
    avatar: 'https://picsum.photos/seed/4/100/100',
    email: 'karim.alaoui@email.com',
    phone: '+212 6 34 56 78 90',
    dateOfBirth: '2001-03-30',
    address: '101 Rue de la Liberté, Fès, Maroc',
    allergies: [],
    medicalHistory: ['Orthodontie en cours'],
    notes: 'Suivi orthodontique régulier.',
  },
  {
    id: '5',
    name: 'Nadia Saidi',
    avatar: 'https://picsum.photos/seed/5/100/100',
    email: 'nadia.saidi@email.com',
    phone: '+212 6 45 67 89 01',
    dateOfBirth: '1995-07-25',
    address: '212 Avenue Hassan II, Agadir, Maroc',
    allergies: [],
    medicalHistory: [],
    notes: 'Demande un blanchiment dentaire.',
  },
];

export const appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Fatima Zahra',
    patientAvatar: 'https://picsum.photos/seed/1/100/100',
    dateTime: new Date(new Date().setHours(9, 30, 0, 0)),
    treatment: 'Détartrage',
    status: 'Confirmed',
  },
  {
    id: '2',
    patientName: 'Youssef El Amrani',
    patientAvatar: 'https://picsum.photos/seed/2/100/100',
    dateTime: new Date(new Date().setHours(11, 0, 0, 0)),
    treatment: 'Contrôle annuel',
    status: 'Confirmed',
  },
  {
    id: '3',
    patientName: 'Karim Alaoui',
    patientAvatar: 'https://picsum.photos/seed/4/100/100',
    dateTime: new Date(new Date().setHours(14, 0, 0, 0)),
    treatment: 'Suivi orthodontique',
    status: 'Confirmed',
  },
  {
    id: '4',
    patientName: 'Nadia Saidi',
    patientAvatar: 'https://picsum.photos/seed/5/100/100',
    dateTime: new Date(new Date().setHours(15, 30, 0, 0)),
    treatment: 'Consultation Blanchiment',
    status: 'Confirmed',
  },
];

export const treatments: Treatment[] = [
    { id: '1', tooth: 18, procedure: 'Carie - Composite', date: '2023-11-20', notes: 'Obturation simple.', cost: 500 },
    { id: '2', tooth: 36, procedure: 'Couronne', date: '2023-09-05', notes: 'Couronne céramique posée.', cost: 3500 },
    { id: '3', tooth: 25, procedure: 'Détartrage', date: '2024-01-15', notes: 'Détartrage supra-gingival.', cost: 400 },
];

export const invoices: Invoice[] = [
    { id: 'INV-001', date: '2024-01-15', description: 'Détartrage', amount: 400, paidAmount: 400, status: 'Paid' },
    { id: 'INV-002', date: '2023-09-05', description: 'Couronne (Dent 36) - Acompte', amount: 3500, paidAmount: 1500, status: 'Partial' },
    { id: 'INV-003', date: '2023-09-20', description: 'Soin Carie (Dent 18)', amount: 500, paidAmount: 0, status: 'Unpaid' },
];

export const inventory: InventoryItem[] = [
    { id: '1', name: 'Gants en latex (boîte de 100)', stock: 25, maxStock: 50, status: 'In Stock' },
    { id: '2', name: 'Anesthésie locale (cartouche)', stock: 8, maxStock: 100, status: 'Low Stock' },
    { id: '3', name: 'Masques chirurgicaux (boîte de 50)', stock: 45, maxStock: 50, status: 'In Stock' },
    { id: '4', name: 'Composites de restauration (seringue)', stock: 15, maxStock: 30, status: 'In Stock' },
    { id: '5', name: 'Fraises dentaires (unité)', stock: 0, maxStock: 200, status: 'Out of Stock' },
    { id: '6', name: 'Ciment verre ionomère', stock: 5, maxStock: 20, status: 'Low Stock' },
];

export const treatmentPlans: TreatmentPlan[] = [
    {
        id: 'PLAN-001',
        title: 'Plan de restauration complet',
        date: '2024-05-10',
        status: 'Accepted',
        totalCost: 8500,
        treatments: [
            { tooth: 15, procedure: 'Couronne Céramique', cost: 3500 },
            { tooth: 26, procedure: 'Inlay-core + Couronne', cost: 4500 },
            { tooth: 46, procedure: 'Soin Carie', cost: 500 },
        ],
    },
    {
        id: 'PLAN-002',
        title: 'Plan esthétique',
        date: '2024-06-20',
        status: 'Proposed',
        totalCost: 6000,
        treatments: [
            { tooth: 11, procedure: 'Blanchiment interne', cost: 2000 },
            { tooth: 21, procedure: 'Facette céramique', cost: 4000 },
        ],
    },
];
