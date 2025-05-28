import React, { useState, useEffect } from 'react';
import { VisitFormData, Patient } from '../types';
import { XMarkIcon } from './icons';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VisitFormData) => void;
  initialData?: VisitFormData;
  patients: Patient[]; // To suggest existing patients
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  patients,
}) => {
  const [formData, setFormData] = useState<VisitFormData>({
    patientName: '',
    patientContact: '',
    bp: '',
    sugarBeforeFood: '',
    sugarAfterFood: '',
    prescription: '',
  });
  const [nameSuggestions, setNameSuggestions] = useState<Patient[]>([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientName: initialData.patientName || '',
        patientContact: initialData.patientContact || '',
        bp: initialData.bp || '',
        sugarBeforeFood: initialData.sugarBeforeFood?.toString() || '',
        sugarAfterFood: initialData.sugarAfterFood?.toString() || '',
        prescription: initialData.prescription || '',
      });
    } else {
      setFormData({
        patientName: '',
        patientContact: '',
        bp: '',
        sugarBeforeFood: '',
        sugarAfterFood: '',
        prescription: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'patientName') {
      if (value.trim() === '') {
        setNameSuggestions([]);
        setShowNameSuggestions(false);
      } else {
        const filtered = patients.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
        setNameSuggestions(filtered);
        setShowNameSuggestions(true);
      }
    }
  };
  
  const handleNameSuggestionClick = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientContact: patient.contact,
    }));
    setNameSuggestions([]);
    setShowNameSuggestions(false);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.patientContact.trim()) {
      alert("Patient Name and Contact are required.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h2 className="text-2xl font-semibold text-primary mb-6">
          {initialData ? 'Edit Visit Record' : 'Add New Visit Record'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-textSecondary mb-1">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patientName"
              id="patientName"
              value={formData.patientName}
              onChange={handleChange}
              onFocus={() => formData.patientName && setNameSuggestions(patients.filter(p => p.name.toLowerCase().includes(formData.patientName.toLowerCase())))}
              onBlur={() => setTimeout(() => setShowNameSuggestions(false), 100)} // Delay to allow click on suggestion
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow"
              required
            />
            {showNameSuggestions && nameSuggestions.length > 0 && (
              <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto bg-white shadow-lg absolute z-10 w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]">
                {nameSuggestions.map(p => (
                  <li 
                    key={p.id} 
                    className="p-2 hover:bg-primary hover:text-white cursor-pointer"
                    onMouseDown={() => handleNameSuggestionClick(p)} // use onMouseDown to fire before onBlur
                  >
                    {p.name} ({p.contact})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="patientContact" className="block text-sm font-medium text-textSecondary mb-1">
              Patient Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="patientContact"
              id="patientContact"
              value={formData.patientContact}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bp" className="block text-sm font-medium text-textSecondary mb-1">BP (e.g., 120/80)</label>
              <input
                type="text"
                name="bp"
                id="bp"
                value={formData.bp}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="sugarBeforeFood" className="block text-sm font-medium text-textSecondary mb-1">Sugar (Before Food)</label>
              <input
                type="number"
                name="sugarBeforeFood"
                id="sugarBeforeFood"
                value={formData.sugarBeforeFood}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="sugarAfterFood" className="block text-sm font-medium text-textSecondary mb-1">Sugar (After Food)</label>
              <input
                type="number"
                name="sugarAfterFood"
                id="sugarAfterFood"
                value={formData.sugarAfterFood}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prescription" className="block text-sm font-medium text-textSecondary mb-1">Prescription</label>
            <textarea
              name="prescription"
              id="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-textSecondary hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              {initialData ? 'Save Changes' : 'Add Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;
