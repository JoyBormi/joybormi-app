export interface IExperience {
  id: string;
  workerId: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExperiencePayload {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface UpdateExperiencePayload {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
}
