export interface TimeEntry {
  id: string;
  date: string;
  location: string;
  tasks: string;
  startTime: string;
  endTime: string;
  hours: number;
  amount: number;
  weekId: string; // Track which week this entry belongs to
}

export interface TimerSession {
  isRunning: boolean;
  startTime: string | null;
  date: string;
}

export interface WeekPeriod {
  id: string;
  startDate: string;
  endDate: string;
  entries: TimeEntry[];
  isMerged: boolean;
  mergedWith?: string; // ID of the week this is merged with
}

export interface InvoiceSettings {
  contractorName: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorEmail: string;
  utrNumber: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  hourlyRate: number;
  cisRate: number;
  periodType: 'weekly' | 'bi-weekly';
  bankAccountName: string;
  sortCode: string;
  accountNumber: string;
  accentColor: string; // HSL hue value (0-360)
}

export interface InvoiceData {
  invoiceNumber: string;
  startDate: string;
  endDate: string;
  entries: TimeEntry[];
  subtotal: number;
  cisDeduction: number;
  totalPayable: number;
  totalHours: number;
  periodLabel: string;
}

export const defaultSettings: InvoiceSettings = {
  contractorName: 'Kayne Capillaire',
  contractorAddress: '29 Grimsdyke, HP16 0LN',
  contractorPhone: '07599 548389',
  contractorEmail: '',
  utrNumber: '6290551437',
  clientName: 'Fourwalls Property Management Ltd',
  clientAddress: '',
  clientContact: '',
  hourlyRate: 20,
  cisRate: 20,
  periodType: 'weekly',
  bankAccountName: 'Mr. Kayne R. Capillaire',
  sortCode: '30-97-13',
  accountNumber: '83952468',
  accentColor: '4', // Vermillion red (default)
};

// Preset accent colors
export const accentColors = [
  { name: 'Vermillion', hue: '4', color: '#E53935' },
  { name: 'Crimson', hue: '350', color: '#D32F2F' },
  { name: 'Orange', hue: '25', color: '#F57C00' },
  { name: 'Amber', hue: '45', color: '#FFA000' },
  { name: 'Green', hue: '145', color: '#388E3C' },
  { name: 'Teal', hue: '175', color: '#00796B' },
  { name: 'Blue', hue: '210', color: '#1976D2' },
  { name: 'Indigo', hue: '235', color: '#303F9F' },
  { name: 'Purple', hue: '270', color: '#7B1FA2' },
  { name: 'Pink', hue: '320', color: '#C2185B' },
  { name: 'Slate', hue: '215', color: '#607D8B' },
  { name: 'Gold', hue: '43', color: '#FFD700' },
];
