import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Patient, Visit, VisitFormData } from './types';
import { PatientService } from './services/patientService';
import PatientFormModal from './components/PatientFormModal';
import PatientList from './components/PatientList';
import SearchBar from './components/SearchBar';
import { PlusIcon, DocumentTextIcon } from './components/icons';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const patientService = useMemo(() => new PatientService(), []);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setPatients(patientService.getAllPatients());
    setVisits(patientService.getAllVisits());
    setIsLoading(false);
  }, [patientService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (visit?: Visit) => {
    setEditingVisit(visit || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVisit(null);
  };

  const handleSaveVisit = (formData: VisitFormData) => {
    if (editingVisit) {
      patientService.updateVisit(editingVisit.id, formData);
    } else {
      patientService.addVisit(formData);
    }
    loadData();
    handleCloseModal();
  };

  const handleDeleteVisit = (visitId: string) => {
    if (window.confirm('Are you sure you want to delete this visit? This action cannot be undone.')) {
      patientService.deleteVisit(visitId);
      loadData();
    }
  };
  
  const filteredPatients = useMemo(() => {
    if (!searchTerm) {
      return patients;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(lowerSearchTerm) ||
        patient.contact.toLowerCase().includes(lowerSearchTerm)
    );
  }, [patients, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="ml-4 text-lg font-semibold text-textPrimary">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-teal-100 p-4 md:p-8 font-sans">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
           <DocumentTextIcon className="h-10 w-10 text-primary" />
           <h1 className="text-4xl font-bold text-primary">Patient Visit Tracker</h1>
        </div>
        <p className="text-lg text-textSecondary">Manage your patient records efficiently.</p>
      </header>

      <div className="max-w-5xl mx-auto bg-card shadow-2xl rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 w-full md:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Visit
          </button>
        </div>

        {filteredPatients.length === 0 && !searchTerm && (
           <div className="text-center py-10">
             <DocumentTextIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
             <p className="text-xl text-textSecondary font-semibold">No patient records yet.</p>
             <p className="text-gray-500">Click "Add New Visit" to get started.</p>
           </div>
         )}

        {filteredPatients.length === 0 && searchTerm && (
          <div className="text-center py-10">
            <p className="text-xl text-textSecondary font-semibold">No patients found matching "{searchTerm}".</p>
            <p className="text-gray-500">Try a different search term or clear the search.</p>
          </div>
        )}

        {filteredPatients.length > 0 && (
            <PatientList
              patients={filteredPatients}
              visits={visits}
              onEditVisit={handleOpenModal}
              onDeleteVisit={handleDeleteVisit}
              patientService={patientService}
            />
        )}
      </div>

      {isModalOpen && (
        <PatientFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveVisit}
          initialData={editingVisit ? patientService.getVisitFormData(editingVisit) : undefined}
          patients={patients}
        />
      )}
      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Patient Visit Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
