import { format } from 'date-fns';

export function getLocalDateKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}

export function getTodayParts(locale: string, date = new Date()) {
  return {
    day: format(date, 'dd'),
    month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).toUpperCase(),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
    dateKey: getLocalDateKey(date),
  };
}
