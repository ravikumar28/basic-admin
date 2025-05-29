import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (dateString, formatString = 'MMM dd, yyyy HH:mm') => {
  return formatDate(dateString, formatString);
};