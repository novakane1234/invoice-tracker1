import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Clock, MapPin, FileText, Timer } from 'lucide-react';

interface TimerTrackerProps {
  isRunning: boolean;
  startTime: string | null;
  onStart: () => void;
  onStop: (location: string, tasks: string) => void;
  onCancel: () => void;
  accentHue: string;
}

export function TimerTracker({ isRunning, startTime, onStart, onStop, onCancel, accentHue }: TimerTrackerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [location, setLocation] = useState('');
  const [tasks, setTasks] = useState('');
  const [showEndForm, setShowEndForm] = useState(false);

  // Update elapsed time every second when running
  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const hours = (new Date().getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60);
      setElapsed(hours);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatElapsed = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    if (!location.trim() || !tasks.trim()) {
      setShowEndForm(true);
      return;
    }
    onStop(location, tasks);
    setLocation('');
    setTasks('');
    setShowEndForm(false);
  };

  const handleSubmitEnd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !tasks.trim()) return;
    onStop(location, tasks);
    setLocation('');
    setTasks('');
    setShowEndForm(false);
  };

  if (isRunning && showEndForm) {
    return (
      <Card className="w-full glass-card card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}>
              <Square className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            <span className="font-semibold tracking-tight">End Work Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitEnd} className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground mb-1">Time Worked</p>
              <p className="text-3xl font-mono font-bold" style={{ color: `hsl(${accentHue} 90% 58%)` }}>
                {formatElapsed(elapsed)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-location" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
                Location
              </Label>
              <Input
                id="end-location"
                type="text"
                placeholder="e.g., Heathrow property"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-secondary/50 border-border/50 focus:border-primary"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-tasks" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
                Tasks Completed
              </Label>
              <Textarea
                id="end-tasks"
                placeholder="e.g., Painting & decorating snag work"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                className="w-full min-h-[80px] resize-none bg-secondary/50 border-border/50 focus:border-primary"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 btn-glow"
                style={{ background: `linear-gradient(to right, hsl(${accentHue} 90% 58%), hsl(${accentHue} 90% 48%))` }}
              >
                <Square className="w-4 h-4 mr-2" />
                Stop & Save
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-border/50"
                onClick={() => setShowEndForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card className="w-full glass-card card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center timer-pulse" style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}>
              <Timer className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            <span className="font-semibold tracking-tight">Work Session Active</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-2">Tracking Time</p>
            <p className="text-5xl font-mono font-bold timer-pulse" style={{ color: `hsl(${accentHue} 90% 58%)` }}>
              {formatElapsed(elapsed)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Started at {new Date(startTime!).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <Button 
            onClick={handleStop}
            className="w-full btn-glow"
            style={{ background: `linear-gradient(to right, hsl(${accentHue} 90% 58%), hsl(${accentHue} 90% 48%))` }}
            size="lg"
          >
            <Square className="w-4 h-4 mr-2" />
            End Session
          </Button>

          <Button 
            onClick={onCancel}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-destructive"
            size="sm"
          >
            Cancel Session
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Keep this page open while working
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card card-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}>
            <Clock className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
          </div>
          <span className="font-semibold tracking-tight">Start Work Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Click start when you begin work
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You&apos;ll add location and tasks when you finish
          </p>
        </div>

        <Button 
          onClick={onStart}
          className="w-full btn-glow"
          style={{ background: `linear-gradient(to right, hsl(${accentHue} 90% 58%), hsl(${accentHue} 90% 48%))` }}
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Timer
        </Button>
      </CardContent>
    </Card>
  );
}
