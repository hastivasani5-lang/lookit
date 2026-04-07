export interface ProfessionalNotification {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  summary: string;
  details: string;
  changedFields: string[];
  createdAt: string;
}