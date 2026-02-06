import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, MapPin, FileText } from 'lucide-react';

interface EntryFormProps {
  onAddEntry: (entry: {
    date: string;
    location: string;
    tasks: string;
    startTime: string;
    endTime: string;
  }) => void;
}

export function EntryForm({ onAddEntry }: EntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [tasks, setTasks] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !tasks.trim()) return;

    onAddEntry({
      date,
      location: location.trim(),
      tasks: tasks.trim(),
      startTime,
      endTime,
    });

    // Reset form but keep date
    setLocation('');
    setTasks('');
    setStartTime('08:00');
    setEndTime('16:00');
  };

  return (
    <Card className="w-full glass-card card-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-vermillion" />
          </div>
          <span className="font-semibold tracking-tight">Add Daily Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-muted-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-secondary/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-vermillion" />
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Heathrow property"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-secondary/50 border-border/50 focus:border-primary placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasks" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4 text-vermillion" />
              Tasks
            </Label>
            <Textarea
              id="tasks"
              placeholder="e.g., Painting & decorating snag work"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              className="w-full min-h-[80px] resize-none bg-secondary/50 border-border/50 focus:border-primary placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-vermillion" />
                Start
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-secondary/50 border-border/50 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-vermillion" />
                End
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-secondary/50 border-border/50 focus:border-primary"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-glow bg-gradient-to-r from-primary to-primary/80" 
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
