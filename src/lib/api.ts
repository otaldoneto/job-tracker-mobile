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

export async function createApplication(data: {
  company: string;
  role: string;
  url?: string | null;
}): Promise<Application> {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateApplication(
  id: string,
  data: Partial<Pick<Application, 'company' | 'role' | 'url' | 'notes' | 'status'>>,
): Promise<Application> {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteApplication(id: string): Promise<void> {
  await fetch(`${API_BASE_URL}/applications/${id}`, { method: 'DELETE' });
}
