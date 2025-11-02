
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Shuffle } from 'lucide-react';
import { getPresetList, generatePreset, randomizeNotes } from '@/utils/presetGenerator';

interface PresetSelectorProps {
  onPresetGenerate: (preset: string) => void;
  onHumanize: (text: string) => void;
  inputText: string;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  onPresetGenerate,
  onHumanize,
  inputText
}) => {
  const presets = getPresetList();

  const handlePresetClick = (presetName: string) => {
    const presetText = generatePreset(presetName);
    onPresetGenerate(presetText);
  };

  const handleHumanizeClick = () => {
    const humanizedText = randomizeNotes(inputText, 0.15);
    onHumanize(humanizedText);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Preset Generator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start gap-2"
              onClick={() => handlePresetClick(preset.name)}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{preset.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {preset.tempo} BPM
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {preset.description}
              </p>
            </Button>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleHumanizeClick}
            disabled={!inputText.trim()}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Humanize Notes
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Randomly adjusts timing and duration to make melodies sound more natural
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PresetSelector;
