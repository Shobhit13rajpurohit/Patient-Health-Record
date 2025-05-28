import React from 'react';
import { Patient, Visit } from '../types';
import PatientListItem from './PatientListItem';
import { PatientService } from '../services/patientService';


interface PatientListProps {
  patients: Patient[];
  visits: Visit[]; // All visits, to be filtered by PatientListItem
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visitId: string) => void;
  patientService: PatientService;
}

const PatientList: React.FC<PatientListProps> = ({ patients, visits, onEditVisit, onDeleteVisit, patientService }) => {
  if (patients.length === 0) {
    return null; // Message for no patients is handled in App.tsx
  }

  return (
    <div className="space-y-6">
      {patients.map((patient) => (
        <PatientListItem
          key={patient.id}
          patient={patient}
          patientVisits={visits.filter(v => v.patientId === patient.id)}
          onEditVisit={onEditVisit}
          onDeleteVisit={onDeleteVisit}
          patientService={patientService}
        />
      ))}
    </div>
  );
};

export default PatientList;
