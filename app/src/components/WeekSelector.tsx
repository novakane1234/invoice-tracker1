import type { WeekPeriod } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Merge, CalendarDays, PoundSterling, Clock } from 'lucide-react';
import { format } from '@/lib/utils';

interface WeekSelectorProps {
  weeks: WeekPeriod[];
  selectedWeeks: string[];
  onToggleWeek: (weekId: string) => void;
  onMergeWeeks: () => void;
  onUnmergeWeeks: () => void;
  accentHue: string;
}

export function WeekSelector({ 
  weeks, 
  selectedWeeks, 
  onToggleWeek, 
  onMergeWeeks, 
  onUnmergeWeeks,
  accentHue 
}: WeekSelectorProps) {
  const availableWeeks = weeks.filter(w => w.entries.length > 0);

  if (availableWeeks.length === 0) {
    return (
      <Card className="w-full glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 font-semibold tracking-tight">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}
            >
              <Calendar className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            Select Weeks for Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No completed weeks yet</p>
            <p className="text-xs mt-1">Complete work sessions to see weeks here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between font-semibold tracking-tight">
          <span className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}
            >
              <Calendar className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            Select Weeks for Invoice
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {selectedWeeks.length} selected
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Merge controls */}
        {selectedWeeks.length >= 2 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border/50"
              onClick={onMergeWeeks}
            >
              <Merge className="w-4 h-4 mr-2" />
              Merge Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border/50"
              onClick={onUnmergeWeeks}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Unmerge All
            </Button>
          </div>
        )}

        {/* Week cards */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableWeeks.map((week) => {
            const isSelected = selectedWeeks.includes(week.id);
            const totalHours = week.entries.reduce((sum, e) => sum + e.hours, 0);
            const totalAmount = week.entries.reduce((sum, e) => sum + e.amount, 0);
            const { start, end } = {
              start: new Date(week.startDate),
              end: new Date(week.endDate)
            };

            return (
              <div
                key={week.id}
                onClick={() => onToggleWeek(week.id)}
                className={`week-card p-3 rounded-xl border transition-all ${
                  isSelected 
                    ? 'selected' 
                    : 'border-border/30 bg-secondary/20'
                } ${week.isMerged ? 'merged' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={{ 
                          background: isSelected ? `hsl(${accentHue} 90% 58%)` : 'transparent',
                          border: isSelected ? 'none' : `1px solid hsl(${accentHue} 90% 58% / 0.5)`
                        }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium">
                        {format(start, 'dd MMM')} - {format(end, 'dd MMM')}
                      </span>
                      {week.isMerged && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Merged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalHours.toFixed(2)} hrs
                      </span>
                      <span className="flex items-center gap-1" style={{ color: `hsl(45 80% 55%)` }}>
                        <PoundSterling className="w-3 h-3" />
                        {totalAmount.toFixed(2)}
                      </span>
                      <span>{week.entries.length} entries</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedWeeks.length > 0 && (
          <div 
            className="p-3 rounded-xl text-center text-sm"
            style={{ 
              background: `hsl(${accentHue} 90% 58% / 0.15)`,
              color: `hsl(${accentHue} 90% 58%)`
            }}
          >
            {selectedWeeks.length === 1 
              ? 'Weekly invoice will be generated'
              : `Bi-weekly invoice (${selectedWeeks.length} weeks) will be generated`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
