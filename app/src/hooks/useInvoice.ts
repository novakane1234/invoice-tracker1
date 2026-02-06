import { useState, useEffect, useCallback } from 'react';
import type { TimeEntry, InvoiceSettings, InvoiceData, TimerSession, WeekPeriod } from '@/types';
import { defaultSettings } from '@/types';

const STORAGE_KEY_ENTRIES = 'invoice_entries';
const STORAGE_KEY_SETTINGS = 'invoice_settings';
const STORAGE_KEY_INVOICE_NUM = 'invoice_number';
const STORAGE_KEY_TIMER = 'invoice_timer';
const STORAGE_KEY_WEEKS = 'invoice_weeks';

export function useInvoice() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
  const [timer, setTimer] = useState<TimerSession>({ isRunning: false, startTime: null, date: '' });
  const [weeks, setWeeks] = useState<WeekPeriod[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY_ENTRIES);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const savedInvoiceNum = localStorage.getItem(STORAGE_KEY_INVOICE_NUM);
    const savedTimer = localStorage.getItem(STORAGE_KEY_TIMER);
    const savedWeeks = localStorage.getItem(STORAGE_KEY_WEEKS);

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
    if (savedInvoiceNum) {
      setInvoiceNumber(parseInt(savedInvoiceNum, 10));
    }
    if (savedTimer) {
      setTimer(JSON.parse(savedTimer));
    }
    if (savedWeeks) {
      setWeeks(JSON.parse(savedWeeks));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_INVOICE_NUM, invoiceNumber.toString());
    }
  }, [invoiceNumber, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_TIMER, JSON.stringify(timer));
    }
  }, [timer, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_WEEKS, JSON.stringify(weeks));
    }
  }, [weeks, isLoaded]);

  // Get current week ID
  const getCurrentWeekId = useCallback((): string => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
  }, []);

  // Get week dates
  const getWeekDates = useCallback((weekId: string): { start: Date; end: Date } => {
    const start = new Date(weekId);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    const now = new Date();
    setTimer({
      isRunning: true,
      startTime: now.toISOString(),
      date: now.toISOString().split('T')[0],
    });
  }, []);

  // Stop timer and create entry
  const stopTimer = useCallback((location: string, tasks: string): TimeEntry | null => {
    if (!timer.isRunning || !timer.startTime) return null;

    const endTime = new Date();
    const startTime = new Date(timer.startTime);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    const weekId = getCurrentWeekId();
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: timer.date,
      location: location.trim(),
      tasks: tasks.trim(),
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      hours: Math.round(hours * 100) / 100,
      amount: Math.round(hours * settings.hourlyRate * 100) / 100,
      weekId,
    };

    setEntries((prev) => [...prev, newEntry]);
    setTimer({ isRunning: false, startTime: null, date: '' });

    // Update weeks
    setWeeks((prev) => {
      const existingWeek = prev.find(w => w.id === weekId);
      if (existingWeek) {
        return prev.map(w => 
          w.id === weekId 
            ? { ...w, entries: [...w.entries, newEntry] }
            : w
        );
      }
      const { end } = getWeekDates(weekId);
      return [...prev, {
        id: weekId,
        startDate: weekId,
        endDate: end.toISOString().split('T')[0],
        entries: [newEntry],
        isMerged: false,
      }];
    });

    return newEntry;
  }, [timer, settings.hourlyRate, getCurrentWeekId, getWeekDates]);

  // Cancel timer without creating entry
  const cancelTimer = useCallback(() => {
    setTimer({ isRunning: false, startTime: null, date: '' });
  }, []);

  // Delete entry
  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setWeeks((prev) => prev.map(w => ({
      ...w,
      entries: w.entries.filter(e => e.id !== id)
    })));
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<InvoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Update accent color
  const updateAccentColor = useCallback((hue: string) => {
    setSettings((prev) => ({ ...prev, accentColor: hue }));
  }, []);

  // Get available weeks (unmerged)
  const getAvailableWeeks = useCallback((): WeekPeriod[] => {
    return weeks.filter(w => !w.isMerged && w.entries.length > 0);
  }, [weeks]);

  // Merge weeks
  const mergeWeeks = useCallback((weekIds: string[]) => {
    if (weekIds.length < 2) return;
    
    const primaryWeekId = weekIds[0];
    setWeeks((prev) => prev.map(w => {
      if (weekIds.includes(w.id) && w.id !== primaryWeekId) {
        return { ...w, isMerged: true, mergedWith: primaryWeekId };
      }
      return w;
    }));
  }, []);

  // Unmerge weeks
  const unmergeWeeks = useCallback((weekId: string) => {
    setWeeks((prev) => prev.map(w => {
      if (w.mergedWith === weekId) {
        return { ...w, isMerged: false, mergedWith: undefined };
      }
      return w;
    }));
  }, []);

  // Generate invoice for selected weeks
  const generateInvoice = useCallback((selectedWeekIds: string[]): InvoiceData => {
    const selectedEntries = entries.filter(e => selectedWeekIds.includes(e.weekId));
    
    // Sort by date
    selectedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const startDate = selectedEntries.length > 0 ? selectedEntries[0].date : new Date().toISOString().split('T')[0];
    const endDate = selectedEntries.length > 0 
      ? selectedEntries[selectedEntries.length - 1].date 
      : new Date().toISOString().split('T')[0];

    const subtotal = selectedEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalHours = selectedEntries.reduce((sum, e) => sum + e.hours, 0);
    const cisDeduction = Math.round(subtotal * (settings.cisRate / 100) * 100) / 100;
    const totalPayable = Math.round((subtotal - cisDeduction) * 100) / 100;

    const periodLabel = selectedWeekIds.length === 1 
      ? 'Weekly' 
      : `Bi-weekly (${selectedWeekIds.length} weeks)`;

    return {
      invoiceNumber: String(invoiceNumber).padStart(3, '0'),
      startDate,
      endDate,
      entries: selectedEntries,
      subtotal,
      cisDeduction,
      totalPayable,
      totalHours,
      periodLabel,
    };
  }, [entries, settings.cisRate, invoiceNumber]);

  // Increment invoice number
  const incrementInvoiceNumber = useCallback(() => {
    setInvoiceNumber((prev) => prev + 1);
  }, []);

  // Set invoice number directly
  const setInvoiceNumberDirect = useCallback((num: number) => {
    setInvoiceNumber(num);
  }, []);

  // Clear entries for completed invoice
  const clearCompletedEntries = useCallback((weekIds: string[]) => {
    setEntries((prev) => prev.filter(e => !weekIds.includes(e.weekId)));
    setWeeks((prev) => prev.filter(w => !weekIds.includes(w.id)));
  }, []);

  // Get elapsed time for running timer
  const getElapsedTime = useCallback((): number => {
    if (!timer.isRunning || !timer.startTime) return 0;
    return (new Date().getTime() - new Date(timer.startTime).getTime()) / (1000 * 60 * 60);
  }, [timer]);

  return {
    entries,
    settings,
    invoiceNumber,
    timer,
    weeks,
    isLoaded,
    startTimer,
    stopTimer,
    cancelTimer,
    deleteEntry,
    updateSettings,
    updateAccentColor,
    getAvailableWeeks,
    mergeWeeks,
    unmergeWeeks,
    generateInvoice,
    incrementInvoiceNumber,
    setInvoiceNumberDirect,
    clearCompletedEntries,
    getElapsedTime,
    getCurrentWeekId,
  };
}
