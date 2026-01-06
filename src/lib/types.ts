export type Patient = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  allergies: string[];
  medicalHistory: string[];
  notes: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientAvatar: string;
  dateTime: Date;
  treatment: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
};

export type Treatment = {
  id: string;
  tooth: number;
  procedure: string;
  date: string;
  notes: string;
  cost: number;
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  maxStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type TreatmentPlan = {
  id: string;
  title: string;
  date: string;
  status: 'Proposed' | 'Accepted' | 'In Progress' | 'Completed';
  totalCost: number;
  treatments: Pick<Treatment, 'procedure' | 'tooth' | 'cost'>[];
};