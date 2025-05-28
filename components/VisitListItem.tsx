import React from 'react';
import { Visit } from '../types';
import { PatientService } from '../services/patientService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this import is present for autoTable
import { CalendarDaysIcon, PencilIcon, TrashIcon,ArrowDownTrayIcon, ClipboardDocumentListIcon, HeartIcon, SunIcon, MoonIcon } from './icons';

interface VisitListItemProps {
  visit: Visit;
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visitId: string) => void;
  patientService: PatientService;
}

const VisitListItem: React.FC<VisitListItemProps> = ({ visit, onEditVisit, onDeleteVisit, patientService }) => {
  const patient = patientService.getPatientById(visit.patientId);

  const handleExportPDF = () => {
    if (!patient) return;

    const doc = new jsPDF();
    const visitDate = new Date(visit.visitDate).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});

    doc.setFontSize(18);
    doc.setTextColor('#0D9488'); // Primary color from theme
    doc.text('Patient Visit Record', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor('#1E293B'); // textPrimary from theme
    doc.text(`Patient: ${patient.name}`, 14, 32);
    doc.text(`Contact: ${patient.contact}`, 14, 39);
    doc.text(`Visit Date: ${visitDate}`, 14, 46);

    // Cast doc to any to inform TypeScript about the autoTable method
    (doc as any).autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Blood Pressure', visit.bp || 'N/A'],
        ['Sugar (Before Food)', visit.sugarBeforeFood?.toString() || 'N/A'],
        ['Sugar (After Food)', visit.sugarAfterFood?.toString() || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { fillColor: '#0D9488', textColor: '#FFFFFF' }, // primary color, white text
      styles: { font: 'Inter', cellPadding: 2.5, fontSize: 10}, // Use Inter font for PDF
      columnStyles: { 0: { fontStyle: 'bold' } },
    });

    const prescriptionY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor('#1E293B'); // textPrimary from theme
    doc.text('Prescription:', 14, prescriptionY);
    doc.setFontSize(10);
    
    const prescriptionLines = doc.splitTextToSize(visit.prescription || 'No prescription provided.', 180);
    // Ensure font is set for prescription text if different from table
    // doc.setFont('Inter'); // Already set in styles, if default is desired to be Inter
    doc.text(prescriptionLines, 14, prescriptionY + 7);
    
    doc.save(`Visit_${patient.name.replace(/\s/g, '_')}_${new Date(visit.visitDate).toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-sm text-primary font-semibold">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-secondary" />
          {new Date(visit.visitDate).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            title="Export to PDF"
            aria-label="Export visit details to PDF"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEditVisit(visit)}
            className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors"
            title="Edit Visit"
            aria-label="Edit visit details"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteVisit(visit.id)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
            title="Delete Visit"
            aria-label="Delete visit"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 text-sm mb-3">
        <div className="flex items-center">
          <HeartIcon className="h-4 w-4 mr-2 text-red-500" />
          <strong>BP:</strong>&nbsp;{visit.bp || <span className="text-gray-400">N/A</span>}
        </div>
        <div className="flex items-center">
          <SunIcon className="h-4 w-4 mr-2 text-yellow-500" />
          <strong>Sugar (Before):</strong>&nbsp;{visit.sugarBeforeFood?.toString() || <span className="text-gray-400">N/A</span>}
        </div>
        <div className="flex items-center">
          <MoonIcon className="h-4 w-4 mr-2 text-indigo-500" />
          <strong>Sugar (After):</strong>&nbsp;{visit.sugarAfterFood?.toString() || <span className="text-gray-400">N/A</span>}
        </div>
      </div>

      {visit.prescription && (
        <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-start text-sm text-textSecondary">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                    <strong className="text-textPrimary">Prescription:</strong>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{visit.prescription}</p>
                </div>
            </div>
        </div>
      )}
       {!visit.prescription && (
         <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-start text-sm text-textSecondary">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                    <strong className="text-textPrimary">Prescription:</strong>
                    <p className="text-gray-400 italic">No prescription provided.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default VisitListItem;