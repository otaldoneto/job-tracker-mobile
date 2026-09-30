const API_BASE_URL = 'http://localhost:3000/api';

export type Application = {
  id: string;
  company: string;
  role: string;
  url: string | null;
  notes: string | null;
  status: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  position: number;
  createdAt: string;
  updatedAt: string;
};

export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch(`${API_BASE_URL}/applications`);
  return response.json();
}
