import { Patient, Visit, VisitFormData } from '../types';
import { LOCAL_STORAGE_PATIENTS_KEY, LOCAL_STORAGE_VISITS_KEY } from '../constants';

export class PatientService {
  private generateId(): string {
    return crypto.randomUUID();
  }

  private getPatientsFromStorage(): Patient[] {
    const patientsJson = localStorage.getItem(LOCAL_STORAGE_PATIENTS_KEY);
    return patientsJson ? JSON.parse(patientsJson) : [];
  }

  private savePatientsToStorage(patients: Patient[]): void {
    localStorage.setItem(LOCAL_STORAGE_PATIENTS_KEY, JSON.stringify(patients));
  }

  private getVisitsFromStorage(): Visit[] {
    const visitsJson = localStorage.getItem(LOCAL_STORAGE_VISITS_KEY);
    return visitsJson ? JSON.parse(visitsJson) : [];
  }

  private saveVisitsToStorage(visits: Visit[]): void {
    localStorage.setItem(LOCAL_STORAGE_VISITS_KEY, JSON.stringify(visits));
  }

  public getAllPatients(): Patient[] {
    return this.getPatientsFromStorage().sort((a, b) => a.name.localeCompare(b.name));
  }

  public getPatientById(patientId: string): Patient | undefined {
    const patients = this.getPatientsFromStorage();
    return patients.find(p => p.id === patientId);
  }
  
  public getAllVisits(): Visit[] {
    return this.getVisitsFromStorage().sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  }

  public getVisitsByPatientId(patientId: string): Visit[] {
    const allVisits = this.getAllVisits();
    return allVisits.filter(visit => visit.patientId === patientId);
  }
  
  public addVisit(formData: VisitFormData): void {
    let patients = this.getPatientsFromStorage();
    let visits = this.getVisitsFromStorage();

    let patient = patients.find(p => p.name.toLowerCase() === formData.patientName.toLowerCase() && p.contact === formData.patientContact);

    if (!patient) {
      patient = {
        id: this.generateId(),
        name: formData.patientName,
        contact: formData.patientContact,
      };
      patients.push(patient);
      this.savePatientsToStorage(patients);
    }

    const newVisit: Visit = {
      id: this.generateId(),
      patientId: patient.id,
      bp: formData.bp,
      sugarBeforeFood: formData.sugarBeforeFood ? parseFloat(formData.sugarBeforeFood) : undefined,
      sugarAfterFood: formData.sugarAfterFood ? parseFloat(formData.sugarAfterFood) : undefined,
      prescription: formData.prescription,
      visitDate: new Date().toISOString(),
    };

    visits.push(newVisit);
    this.saveVisitsToStorage(visits);
  }

  public updateVisit(visitId: string, formData: VisitFormData): void {
    let visits = this.getVisitsFromStorage();
    const visitIndex = visits.findIndex(v => v.id === visitId);

    if (visitIndex === -1) {
      console.error("Visit not found for update:", visitId);
      return;
    }
    
    const existingVisit = visits[visitIndex];

    const updatedVisit: Visit = {
      ...existingVisit,
      bp: formData.bp,
      sugarBeforeFood: formData.sugarBeforeFood ? parseFloat(formData.sugarBeforeFood) : undefined,
      sugarAfterFood: formData.sugarAfterFood ? parseFloat(formData.sugarAfterFood) : undefined,
      prescription: formData.prescription,
    };
    
    visits[visitIndex] = updatedVisit;
    this.saveVisitsToStorage(visits);

    let patients = this.getPatientsFromStorage();
    const patientIndex = patients.findIndex(p => p.id === existingVisit.patientId);
    if (patientIndex !== -1) {
        const patientToUpdate = patients[patientIndex];
        if (patientToUpdate.name !== formData.patientName || patientToUpdate.contact !== formData.patientContact) {
            patients[patientIndex] = { ...patientToUpdate, name: formData.patientName, contact: formData.patientContact };
            this.savePatientsToStorage(patients);
        }
    }
  }

  public deleteVisit(visitId: string): void {
    let allVisits = this.getVisitsFromStorage();
    const visitToDelete = allVisits.find(v => v.id === visitId);

    // Always remove the visit if found or not (filter will just not remove anything if not found)
    const updatedVisits = allVisits.filter(v => v.id !== visitId);
    
    // Only save visits if the list actually changed
    if (allVisits.length !== updatedVisits.length || !visitToDelete) { // The !visitToDelete ensures save even if ID was bad but filter did nothing
        this.saveVisitsToStorage(updatedVisits);
    }


    // If the visit was found and thus actually deleted, check if its patient needs to be removed
    if (visitToDelete) {
      const patientIdOfDeletedVisit = visitToDelete.patientId;
      const remainingVisitsForPatient = updatedVisits.filter(v => v.patientId === patientIdOfDeletedVisit);

      if (remainingVisitsForPatient.length === 0) {
        let allPatients = this.getPatientsFromStorage();
        const originalPatientCount = allPatients.length;
        const updatedPatients = allPatients.filter(p => p.id !== patientIdOfDeletedVisit);
        
        // Only save patients if the list actually changed
        if (originalPatientCount !== updatedPatients.length) {
          this.savePatientsToStorage(updatedPatients);
        }
      }
    }
  }

  public getVisitFormData(visit: Visit): VisitFormData {
    const patient = this.getPatientById(visit.patientId);
    return {
      patientName: patient?.name || 'Unknown Patient',
      patientContact: patient?.contact || 'Unknown Contact',
      bp: visit.bp,
      sugarBeforeFood: visit.sugarBeforeFood?.toString(),
      sugarAfterFood: visit.sugarAfterFood?.toString(),
      prescription: visit.prescription,
    };
  }
}