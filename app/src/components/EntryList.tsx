import type { TimeEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Calendar, MapPin, Clock, PoundSterling } from 'lucide-react';
import { format } from '@/lib/utils';

interface EntryListProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
  periodLabel: string;
}

export function EntryList({ entries, onDeleteEntry, periodLabel }: EntryListProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);

  if (entries.length === 0) {
    return (
      <Card className="w-full glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold tracking-tight">Current Period Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No entries for {periodLabel}</p>
            <p className="text-xs mt-1 opacity-60">Add your first entry above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between font-semibold tracking-tight">
          <span>Current Period Entries</span>
          <span className="text-sm font-normal text-muted-foreground">
            {periodLabel}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-secondary/30 rounded-xl p-4 space-y-2 border border-border/30 card-glow animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3 h-3 text-vermillion" />
                  </div>
                  <span>{format(new Date(entry.date), 'EEE, dd MMM')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-vermillion/70" />
                  <span className="truncate">{entry.location}</span>
                </div>
                <p className="text-sm mt-2 line-clamp-2 text-foreground/90">{entry.tasks}</p>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {entry.startTime} - {entry.endTime}
                  </span>
                  <span className="text-muted-foreground">{entry.hours.toFixed(2)} hrs</span>
                  <span className="flex items-center gap-1 font-medium text-gold">
                    <PoundSterling className="w-3 h-3" />
                    {entry.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={() => onDeleteEntry(entry.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-t border-border/50 pt-4 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Hours:</span>
            <span className="font-medium">{totalHours.toFixed(2)} hrs</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-gold">£{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
