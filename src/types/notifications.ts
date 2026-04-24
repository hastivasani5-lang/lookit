export interface StudentNotification {
  id: string;
  studentId: string;
  type: "purchase_confirmation" | "new_content" | "announcement" | "certificate";
  message: string;
  read: boolean;
  createdAt: string;
  certificateId?: string;
  professionalName?: string;
}

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