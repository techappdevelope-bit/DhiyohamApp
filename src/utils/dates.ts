import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

// Format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return format(dateObj, 'MMM d, yyyy');
};

// Format time
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
};

// Format date and time
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

// Get days until date
export const getDaysUntil = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return differenceInDays(dateObj, new Date());
};

// Check if date is in the past
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

// Check if date is today
export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isToday(dateObj);
};
