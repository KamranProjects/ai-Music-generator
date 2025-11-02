
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface TempoKeySelectorProps {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  musicKey: string;
  onKeyChange: (key: string) => void;
}

const tempoOptions = [
  { value: 60, label: "60 BPM - Slow" },
  { value: 80, label: "80 BPM - Ballad" },
  { value: 100, label: "100 BPM - Medium" },
  { value: 120, label: "120 BPM - Standard" },
  { value: 140, label: "140 BPM - Dance" },
  { value: 160, label: "160 BPM - Fast" },
  { value: 180, label: "180 BPM - Very Fast" }
];

const keyOptions = [
  { value: "C", label: "C Major" },
  { value: "Dm", label: "D Minor" },
  { value: "Em", label: "E Minor" },
  { value: "F", label: "F Major" },
  { value: "G", label: "G Major" },
  { value: "Am", label: "A Minor" },
  { value: "Bm", label: "B Minor" },
  { value: "Db", label: "D♭ Major" },
  { value: "Eb", label: "E♭ Major" },
  { value: "Fm", label: "F Minor" },
  { value: "Gm", label: "G Minor" },
  { value: "Bb", label: "B♭ Major" }
];

const TempoKeySelector: React.FC<TempoKeySelectorProps> = ({
  tempo,
  onTempoChange,
  musicKey,
  onKeyChange
}) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tempo-select">Tempo</Label>
          <Select 
            value={tempo.toString()} 
            onValueChange={(value) => onTempoChange(parseInt(value))}
          >
            <SelectTrigger id="tempo-select">
              <SelectValue placeholder="Select tempo" />
            </SelectTrigger>
            <SelectContent>
              {tempoOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="key-select">Key</Label>
          <Select value={musicKey} onValueChange={onKeyChange}>
            <SelectTrigger id="key-select">
              <SelectValue placeholder="Select key" />
            </SelectTrigger>
            <SelectContent>
              {keyOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default TempoKeySelector;
