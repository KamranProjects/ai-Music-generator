
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Play, Download, RotateCcw, Music2, Sparkles } from 'lucide-react';

interface PatternStep {
  active: boolean;
  velocity: number;
}

interface DrumPattern {
  [instrument: string]: PatternStep[];
}

const PatternRack: React.FC = () => {
  const [pattern, setPattern] = useState<DrumPattern>({
    'Kick': new Array(16).fill(null).map(() => ({ active: false, velocity: 80 })),
    'Snare': new Array(16).fill(null).map(() => ({ active: false, velocity: 80 })),
    'Hi-Hat': new Array(16).fill(null).map(() => ({ active: false, velocity: 60 })),
    'Clap': new Array(16).fill(null).map(() => ({ active: false, velocity: 70 })),
    'Crash': new Array(16).fill(null).map(() => ({ active: false, velocity: 90 })),
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textPattern, setTextPattern] = useState('');

  const drumPresets = {
    'Trap': {
      'Kick': [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
      'Snare': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      'Hi-Hat': [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    'Drill': {
      'Kick': [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
      'Snare': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      'Hi-Hat': [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
    },
    'House': {
      'Kick': [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      'Snare': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      'Hi-Hat': [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    }
  };

  const instrumentColors = {
    'Kick': { 
      active: '#EF4444', 
      inactive: '#FEF2F2', 
      hover: '#FCA5A5',
      gradient: 'from-red-400 to-red-500'
    },
    'Snare': { 
      active: '#3B82F6', 
      inactive: '#EFF6FF', 
      hover: '#93C5FD',
      gradient: 'from-blue-400 to-blue-500'
    },
    'Hi-Hat': { 
      active: '#10B981', 
      inactive: '#F0FDF4', 
      hover: '#6EE7B7',
      gradient: 'from-emerald-400 to-emerald-500'
    },
    'Clap': { 
      active: '#F59E0B', 
      inactive: '#FFFBEB', 
      hover: '#FCD34D',
      gradient: 'from-amber-400 to-amber-500'
    },
    'Crash': { 
      active: '#8B5CF6', 
      inactive: '#FAF5FF', 
      hover: '#C4B5FD',
      gradient: 'from-violet-400 to-violet-500'
    },
  };

  const toggleStep = (instrument: string, step: number) => {
    setPattern(prev => ({
      ...prev,
      [instrument]: prev[instrument].map((s, i) => 
        i === step ? { ...s, active: !s.active } : s
      )
    }));
  };

  const clearPattern = () => {
    setPattern(prev => {
      const newPattern = { ...prev };
      Object.keys(newPattern).forEach(instrument => {
        newPattern[instrument] = newPattern[instrument].map(s => ({ ...s, active: false }));
      });
      return newPattern;
    });
  };

  const loadPreset = (presetName: string) => {
    const preset = drumPresets[presetName as keyof typeof drumPresets];
    if (preset) {
      setPattern(prev => {
        const newPattern = { ...prev };
        Object.keys(preset).forEach(instrument => {
          if (newPattern[instrument]) {
            newPattern[instrument] = preset[instrument].map((active, i) => ({
              active: active === 1,
              velocity: newPattern[instrument][i].velocity
            }));
          }
        });
        return newPattern;
      });
    }
  };

  const generateTextPattern = () => {
    let text = '';
    Object.keys(pattern).forEach(instrument => {
      const steps = pattern[instrument];
      const patternString = steps.map(step => step.active ? 'X' : '-').join('');
      text += `${instrument}: [${patternString}]\n`;
    });
    setTextPattern(text);
  };

  const parseTextPattern = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const newPattern = { ...pattern };
    
    lines.forEach(line => {
      const match = line.match(/^(\w+):\s*\[([X\-]+)\]/);
      if (match) {
        const [, instrument, patternStr] = match;
        if (newPattern[instrument]) {
          newPattern[instrument] = patternStr.split('').map((char, i) => ({
            active: char === 'X',
            velocity: newPattern[instrument][i]?.velocity || 80
          }));
        }
      }
    });
    
    setPattern(newPattern);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/20 dark:to-amber-900/20 backdrop-blur-sm border-0 shadow-xl">
      <div className="space-y-6">
        {/* Header with Apple-like styling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Music2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Pattern Rack
              </h2>
              <p className="text-sm text-muted-foreground">Create drum patterns with visual steps</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={clearPattern} variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={generateTextPattern} variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Text
            </Button>
          </div>
        </div>

        {/* Presets with modern cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Drum Presets</h3>
          <div className="flex gap-3 flex-wrap">
            {Object.keys(drumPresets).map(presetName => (
              <Button
                key={presetName}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(presetName)}
                className="bg-white/70 hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-200 border-0"
              >
                {presetName}
              </Button>
            ))}
          </div>
        </div>

        {/* Pattern Grid with modern styling */}
        <div className="space-y-4">
          {/* Step Numbers with better design */}
          <div className="flex items-center gap-1 ml-24">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className={`w-10 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all
                  ${i % 4 === 0 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-sm' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                  }
                  ${currentStep === i ? 'ring-2 ring-blue-500 ring-offset-1 scale-105' : ''}
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Instrument Rows with enhanced design */}
          {Object.keys(pattern).map(instrument => (
            <div key={instrument} className="flex items-center gap-2">
              <div className="w-20 text-sm font-bold text-right">
                <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${instrumentColors[instrument as keyof typeof instrumentColors].gradient} text-white shadow-md`}>
                  {instrument}
                </span>
              </div>
              <div className="flex gap-1">
                {pattern[instrument].map((step, stepIndex) => (
                  <button
                    key={stepIndex}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-sm font-bold transform hover:scale-105 active:scale-95
                      ${step.active 
                        ? `border-gray-700 text-white shadow-lg shadow-black/20` 
                        : `border-gray-300 text-gray-500 hover:border-gray-400 hover:shadow-md`
                      }`}
                    style={{
                      backgroundColor: step.active 
                        ? instrumentColors[instrument as keyof typeof instrumentColors].active
                        : instrumentColors[instrument as keyof typeof instrumentColors].inactive,
                      boxShadow: step.active 
                        ? `0 4px 12px ${instrumentColors[instrument as keyof typeof instrumentColors].active}40`
                        : undefined
                    }}
                    onClick={() => toggleStep(instrument, stepIndex)}
                    onMouseEnter={(e) => {
                      if (!step.active) {
                        e.currentTarget.style.backgroundColor = instrumentColors[instrument as keyof typeof instrumentColors].hover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!step.active) {
                        e.currentTarget.style.backgroundColor = instrumentColors[instrument as keyof typeof instrumentColors].inactive;
                      }
                    }}
                  >
                    {step.active ? '●' : '○'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Text Pattern Editor with modern design */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Text Pattern</h3>
          <Textarea
            placeholder="Kick: [X---X---X---X---]&#10;Snare: [----X-------X---]&#10;Hi-Hat: [X-X-X-X-X-X-X-X-]"
            value={textPattern}
            onChange={(e) => setTextPattern(e.target.value)}
            className="min-h-[100px] font-mono text-sm bg-white/70 border-0 shadow-inner rounded-xl resize-none focus:ring-2 focus:ring-orange-500/20"
          />
          <Button
            onClick={() => parseTextPattern(textPattern)}
            variant="outline"
            size="sm"
            disabled={!textPattern.trim()}
            className="shadow-md hover:shadow-lg transition-all bg-white/70 hover:bg-white/90 border-0"
          >
            Load Pattern
          </Button>
        </div>

        {/* Pattern Info with modern badges */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Badge className="text-sm px-4 py-2 bg-blue-100 text-blue-700 border-0">
            16 Steps
          </Badge>
          <Badge className="text-sm px-4 py-2 bg-green-100 text-green-700 border-0">
            {Object.keys(pattern).length} Instruments
          </Badge>
          <Badge className="text-sm px-4 py-2 bg-orange-100 text-orange-700 border-0">
            {Object.values(pattern).flat().filter(s => s.active).length} Active Steps
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default PatternRack;
