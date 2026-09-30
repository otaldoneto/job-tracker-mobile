import { Application } from './api';

export const STATUSES: Application['status'][] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

export const STATUS_LABELS: Record<Application['status'], string> = {
  APPLIED: 'Aplicado',
  INTERVIEW: 'Entrevista',
  OFFER: 'Oferta',
  REJECTED: 'Recusado',
};
