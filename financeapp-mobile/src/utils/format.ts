import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const parseDateInput = (value: string): Date | null => {
  // Espera formato YYYY-MM-DD para input de data
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};
