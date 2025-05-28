export interface Patient {
  id: string;
  name: string;
  contact: string; 
}

export interface Visit {
  id: string;
  patientId: string;
  bp?: string; // Blood Pressure
  sugarBeforeFood?: number;
  sugarAfterFood?: number;
  prescription: string;
  visitDate: string; // ISO string date
}

export interface VisitFormData {
  patientName: string;
  patientContact: string;
  bp?: string;
  sugarBeforeFood?: string; // String for form input, converted to number on save
  sugarAfterFood?: string; // String for form input, converted to number on save
  prescription: string;
}
