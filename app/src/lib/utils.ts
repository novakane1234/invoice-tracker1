import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function format(date: Date, formatStr: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const yy = y.toString().slice(-2);
  const MMM = months[date.getMonth()];
  const EEE = days[date.getDay()];
  
  return formatStr
    .replace('dd', d)
    .replace('MM', m)
    .replace('yyyy', y.toString())
    .replace('yy', yy)
    .replace('MMM', MMM)
    .replace('EEE', EEE);
}
