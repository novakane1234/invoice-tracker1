import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from '@/lib/utils';

interface PeriodInfoProps {
  periodType: 'weekly' | 'bi-weekly';
  startDate: Date;
  endDate: Date;
}

export function PeriodInfo({ periodType, startDate, endDate }: PeriodInfoProps) {
  const periodLabel = periodType === 'weekly' ? 'Weekly Period' : 'Bi-weekly Period';
  const daysRemaining = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="w-full glass-card border-primary/20 card-glow">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-vermillion" />
            </div>
            <span className="text-sm font-medium">{periodLabel}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ends today'}
          </div>
        </div>
        <div className="mt-3 text-sm flex items-center">
          <span className="text-muted-foreground">{format(startDate, 'dd MMM')}</span>
          <span className="mx-3 text-vermillion/50">→</span>
          <span className="font-medium text-gold">{format(endDate, 'dd MMM yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
