import React, { useState } from 'react';
import { Patient, Visit } from '../types';
import VisitListItem from './VisitListItem';
import { ChevronDownIcon, ChevronUpIcon, UserIcon, PhoneIcon } from './icons';
import { PatientService } from '../services/patientService';


interface PatientListItemProps {
  patient: Patient;
  patientVisits: Visit[];
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visitId: string) => void;
  patientService: PatientService;
}

const PatientListItem: React.FC<PatientListItemProps> = ({ patient, patientVisits, onEditVisit, onDeleteVisit, patientService }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedVisits = patientVisits.sort((a,b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      <div
        className="flex items-center justify-between p-5 cursor-pointer bg-slate-50 hover:bg-slate-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary rounded-full">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary">{patient.name}</h3>
            <div className="flex items-center text-sm text-textSecondary mt-1">
                <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
                {patient.contact}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {patientVisits.length} visit{patientVisits.length === 1 ? '' : 's'}
            </span>
            {isExpanded ? <ChevronUpIcon className="h-6 w-6 text-gray-500" /> : <ChevronDownIcon className="h-6 w-6 text-gray-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-gray-200 bg-gray-50/50">
          {sortedVisits.length > 0 ? (
            <div className="space-y-4">
              {sortedVisits.map((visit) => (
                <VisitListItem
                  key={visit.id}
                  visit={visit}
                  onEditVisit={onEditVisit}
                  onDeleteVisit={onDeleteVisit}
                  patientService={patientService}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-textSecondary text-center py-4">No visits recorded for this patient.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientListItem;
