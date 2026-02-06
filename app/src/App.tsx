import { useState, useEffect } from 'react';
import { useInvoice } from '@/hooks/useInvoice';
import { TimerTracker } from '@/components/TimerTracker';
import { WeekSelector } from '@/components/WeekSelector';
import { InvoiceView } from '@/components/InvoiceView';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Timer, FileText, Settings, Calendar, Edit2, Check, X, Clock } from 'lucide-react';
import './App.css';

function App() {
  const {
    entries,
    settings,
    invoiceNumber,
    timer,
    weeks,
    isLoaded,
    startTimer,
    stopTimer,
    cancelTimer,
    updateSettings,
    getAvailableWeeks,
    mergeWeeks,
    unmergeWeeks,
    generateInvoice,
    incrementInvoiceNumber,
    setInvoiceNumberDirect,
    clearCompletedEntries,
  } = useInvoice();

  const [isEditingInvoiceNum, setIsEditingInvoiceNum] = useState(false);
  const [tempInvoiceNum, setTempInvoiceNum] = useState(invoiceNumber.toString());
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  // Update CSS accent color when settings change
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-hue', settings.accentColor);
  }, [settings.accentColor]);

  // Auto-select first week if none selected
  useEffect(() => {
    const available = getAvailableWeeks();
    if (selectedWeeks.length === 0 && available.length > 0) {
      setSelectedWeeks([available[0].id]);
    }
  }, [weeks, getAvailableWeeks, selectedWeeks.length]);

  const handleStartTimer = () => {
    startTimer();
    toast.success('Timer started!');
  };

  const handleStopTimer = (location: string, tasks: string) => {
    const entry = stopTimer(location, tasks);
    if (entry) {
      toast.success(`Session saved: ${entry.hours.toFixed(2)} hours`);
    }
  };

  const handleCancelTimer = () => {
    cancelTimer();
    toast.info('Session cancelled');
  };

  const handleToggleWeek = (weekId: string) => {
    setSelectedWeeks((prev) => {
      if (prev.includes(weekId)) {
        return prev.filter((id) => id !== weekId);
      }
      return [...prev, weekId];
    });
  };

  const handleMergeWeeks = () => {
    if (selectedWeeks.length >= 2) {
      mergeWeeks(selectedWeeks);
      toast.success('Weeks merged for bi-weekly invoice');
    }
  };

  const handleUnmergeWeeks = () => {
    unmergeWeeks(selectedWeeks[0]);
    toast.success('Weeks unmerged');
  };

  const handleSaveInvoiceNum = () => {
    const num = parseInt(tempInvoiceNum, 10);
    if (num > 0) {
      setInvoiceNumberDirect(num);
      setIsEditingInvoiceNum(false);
      toast.success(`Invoice number updated to #${String(num).padStart(3, '0')}`);
    }
  };

  const handleCancelEdit = () => {
    setTempInvoiceNum(invoiceNumber.toString());
    setIsEditingInvoiceNum(false);
  };

  const handleCompletePeriod = () => {
    incrementInvoiceNumber();
    clearCompletedEntries(selectedWeeks);
    setSelectedWeeks([]);
    toast.success('Invoice completed and entries cleared');
  };

  const invoice = generateInvoice(selectedWeeks);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative z-10">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 safe-top">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, hsl(${settings.accentColor} 90% 58%), hsl(${settings.accentColor} 90% 48%))`,
                  boxShadow: `0 4px 20px hsl(${settings.accentColor} 90% 58% / 0.3)`
                }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight">Invoice Tracker</h1>
                <p className="text-xs text-muted-foreground">{settings.contractorName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Invoice #</p>
              {isEditingInvoiceNum ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tempInvoiceNum}
                    onChange={(e) => setTempInvoiceNum(e.target.value)}
                    className="w-16 h-7 text-sm px-2 py-0"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleSaveInvoiceNum}
                  >
                    <Check className="w-3 h-3" style={{ color: `hsl(${settings.accentColor} 90% 58%)` }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCancelEdit}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => setIsEditingInvoiceNum(true)}
                >
                  <span className="font-mono font-bold text-lg text-gold">
                    {String(invoiceNumber).padStart(3, '0')}
                  </span>
                  <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-5 pb-28">
        <Tabs defaultValue="timer" className="mt-2">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger 
              value="timer" 
              className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
            >
              <Timer className="w-4 h-4" />
              <span className="text-sm">Timer</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invoice" 
              className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Invoice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="mt-5 space-y-4 animate-fade-in-up">
            <TimerTracker
              isRunning={timer.isRunning}
              startTime={timer.startTime}
              onStart={handleStartTimer}
              onStop={handleStopTimer}
              onCancel={handleCancelTimer}
              accentHue={settings.accentColor}
            />

            {/* Recent Entries */}
            <Card className="w-full glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 font-semibold tracking-tight">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(${settings.accentColor} 90% 58% / 0.2)` }}
                  >
                    <Clock className="w-4 h-4" style={{ color: `hsl(${settings.accentColor} 90% 58%)` }} />
                  </div>
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No sessions yet</p>
                    <p className="text-xs mt-1 opacity-60">Start a timer to track your work</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...entries].reverse().slice(0, 5).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between text-sm p-3 bg-secondary/30 rounded-lg border border-border/30"
                      >
                        <div>
                          <p className="font-medium">{entry.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.date} • {entry.startTime}-{entry.endTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gold">£{entry.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{entry.hours.toFixed(2)}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="mt-5 space-y-4 animate-fade-in-up">
            <WeekSelector
              weeks={weeks}
              selectedWeeks={selectedWeeks}
              onToggleWeek={handleToggleWeek}
              onMergeWeeks={handleMergeWeeks}
              onUnmergeWeeks={handleUnmergeWeeks}
              accentHue={settings.accentColor}
            />
            <InvoiceView
              invoice={invoice}
              settings={settings}
              onCompletePeriod={handleCompletePeriod}
              accentHue={settings.accentColor}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-5 space-y-4 animate-fade-in-up">
            <SettingsPanel 
              settings={settings} 
              onUpdateSettings={updateSettings}
              invoiceNumber={invoiceNumber}
              onUpdateInvoiceNumber={setInvoiceNumberDirect}
            />
            
            {/* All Entries History */}
            <Card className="w-full glass-card">
              <CardContent className="pt-4">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3 text-gold">
                  <Calendar className="w-4 h-4" />
                  All Sessions History
                </h4>
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sessions yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between text-sm p-3 bg-secondary/30 rounded-lg border border-border/30"
                      >
                        <div>
                          <p className="font-medium">{entry.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.date} • {entry.hours} hrs
                          </p>
                        </div>
                        <span className="font-medium text-gold">£{entry.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 py-3 px-4 safe-bottom z-50">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            £{settings.hourlyRate}/hr <span style={{ color: `hsl(${settings.accentColor} 90% 58%)` }}>•</span> {settings.cisRate}% CIS
          </span>
          <span className="text-muted-foreground">
            {entries.length} sessions
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
