import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';
import { accentColors } from '@/types';

interface ColorPickerProps {
  currentHue: string;
  onChange: (hue: string) => void;
}

export function ColorPicker({ currentHue, onChange }: ColorPickerProps) {
  const [customHue, setCustomHue] = useState(parseInt(currentHue));
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    setCustomHue(hue);
    onChange(hue.toString());
  };

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-semibold tracking-tight">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `hsl(${currentHue} 90% 58% / 0.2)` }}
          >
            <Palette className="w-4 h-4" style={{ color: `hsl(${currentHue} 90% 58%)` }} />
          </div>
          Theme Color
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset colors */}
        <div className="grid grid-cols-6 gap-2">
          {accentColors.map((color) => (
            <button
              key={color.hue}
              onClick={() => {
                onChange(color.hue);
                setCustomHue(parseInt(color.hue));
              }}
              className="relative w-10 h-10 rounded-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
              style={{ 
                backgroundColor: color.color,
                boxShadow: currentHue === color.hue ? `0 0 0 2px white, 0 0 0 4px ${color.color}` : 'none'
              }}
              title={color.name}
            >
              {currentHue === color.hue && (
                <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Custom color slider */}
        <div className="pt-2 border-t border-border/50">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCustom ? 'Hide custom color' : 'Custom color'}
          </button>
          
          {showCustom && (
            <div className="mt-3 space-y-3">
              <input
                type="range"
                min="0"
                max="360"
                value={customHue}
                onChange={handleCustomChange}
                className="color-slider"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Hue: {customHue}°</span>
                <div 
                  className="w-8 h-8 rounded-lg"
                  style={{ background: `hsl(${customHue} 90% 58%)` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div 
          className="p-3 rounded-xl text-center text-sm font-medium"
          style={{ 
            background: `hsl(${currentHue} 90% 58% / 0.15)`,
            color: `hsl(${currentHue} 90% 58%)`
          }}
        >
          Preview: This is your accent color
        </div>
      </CardContent>
    </Card>
  );
}
