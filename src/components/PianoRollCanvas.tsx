import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Download, Grid3x3, AlertCircle } from 'lucide-react';
import { exportToMidi, downloadMidiFile } from '@/utils/midiExport';
import TempoKeySelector from '@/components/TempoKeySelector';
import PresetSelector from '@/components/PresetSelector';
import { useToast } from '@/hooks/use-toast';

interface Note {
  note: string;
  octave: number;
  time: number;
  duration: number;
  track: number;
  velocity?: number;
}

interface ParsedData {
  notes: Note[];
  totalTime: number;
  tracks: number;
}

const PianoRollCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputText, setInputText] = useState(`Track 1: C5-4 G4-2 E5-3 A4-2
Track 2: F4-8 D5-4 B4-6
Track 3: C4-2 E4-2 G4-2 C5-4
Track 4: F#5-0.25 F#5-0.25 G5-0.25 F#5-0.25 F#5-0.5 F#5-0.25 G5-0.125 G5-0.125 F#5-0.25`);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [cellWidth, setCellWidth] = useState(40);
  const [cellHeight, setCellHeight] = useState(20);
  const [tempo, setTempo] = useState(120);
  const [musicKey, setMusicKey] = useState("C");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { toast } = useToast();

  // Enhanced note mapping for piano roll with sharp/flat support
  const noteMap = {
    'C': 0, 'C#': 1, 'CS': 1, 'DB': 1, 'Db': 1, 'D': 2, 'D#': 3, 'DS': 3, 'EB': 3, 'Eb': 3, 'E': 4,
    'F': 5, 'F#': 6, 'FS': 6, 'GB': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'GS': 8, 'AB': 8, 'Ab': 8, 'A': 9,
    'A#': 10, 'AS': 10, 'BB': 10, 'Bb': 10, 'B': 11
  };

  const trackColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];

  const parseInput = (text: string): ParsedData => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const notes: Note[] = [];
    let currentTime = 0;
    let maxTime = 0;
    let trackCount = 0;

    lines.forEach((line, trackIndex) => {
      trackCount = Math.max(trackCount, trackIndex + 1);
      currentTime = 0;
      
      // Remove track prefix and split by spaces
      const cleanLine = line.replace(/^Track\s*\d+:\s*/i, '');
      const noteEntries = cleanLine.split(/\s+/).filter(entry => entry.trim());
      
      noteEntries.forEach(entry => {
        // Enhanced regex to handle sharp/flat notes: F#5-0.25, Bb4-2, etc.
        const match = entry.match(/^([A-G][#b]?)(\d+)-([\d.]+)$/);
        if (match) {
          const [, noteName, octave, duration] = match;
          notes.push({
            note: noteName,
            octave: parseInt(octave),
            time: currentTime,
            duration: parseFloat(duration),
            track: trackIndex,
            velocity: 80
          });
          currentTime += parseFloat(duration);
        }
      });
      
      maxTime = Math.max(maxTime, currentTime);
    });

    return { notes, totalTime: maxTime, tracks: trackCount };
  };

  const getMidiNoteNumber = (note: string, octave: number): number => {
    const normalizedNote = note.toUpperCase();
    const baseNote = noteMap[normalizedNote as keyof typeof noteMap];
    if (baseNote === undefined) {
      console.warn(`Unknown note: ${note}`);
      return -1;
    }
    return (octave * 12) + baseNote;
  };

  const drawPianoRoll = () => {
    const canvas = canvasRef.current;
    if (!canvas || !parsedData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Extended range to show more octaves (C1 to C9 for full coverage)
    const startOctave = 1;
    const endOctave = 9;
    const totalKeys = (endOctave - startOctave) * 12;

    // Canvas dimensions with better spacing
    const width = Math.max(1000, parsedData.totalTime * cellWidth + 300);
    const height = Math.max(700, totalKeys * cellHeight + 150);
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with modern dark background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid if enabled with subtle lines
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      
      // Vertical lines (time) with emphasis on beat divisions
      for (let i = 0; i <= parsedData.totalTime * 4; i++) {
        const x = 180 + (i * cellWidth / 4);
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines (notes) with emphasis on octaves
      for (let i = 0; i <= totalKeys; i++) {
        const y = 50 + i * cellHeight;
        const noteIndex = i % 12;
        ctx.strokeStyle = noteIndex === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw modern piano keys sidebar
    const sidebarGradient = ctx.createLinearGradient(0, 0, 180, 0);
    sidebarGradient.addColorStop(0, 'rgba(30, 30, 50, 0.95)');
    sidebarGradient.addColorStop(1, 'rgba(40, 40, 60, 0.95)');
    ctx.fillStyle = sidebarGradient;
    ctx.fillRect(0, 0, 180, height);
    
    // Add subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, height);
    ctx.stroke();
    
    for (let i = 0; i < totalKeys; i++) {
      const currentOctave = startOctave + Math.floor(i / 12);
      const noteIndex = i % 12;
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteName = noteNames[noteIndex];
      const y = 50 + (totalKeys - 1 - i) * cellHeight;
      
      // Modern key styling
      const isBlackKey = noteName.includes('#');
      const keyGradient = ctx.createLinearGradient(0, y, 180, y + cellHeight);
      
      if (isBlackKey) {
        keyGradient.addColorStop(0, 'rgba(20, 20, 30, 0.9)');
        keyGradient.addColorStop(1, 'rgba(15, 15, 25, 0.9)');
      } else {
        keyGradient.addColorStop(0, 'rgba(50, 50, 70, 0.9)');
        keyGradient.addColorStop(1, 'rgba(40, 40, 60, 0.9)');
      }
      
      ctx.fillStyle = keyGradient;
      ctx.fillRect(5, y, 170, cellHeight - 1);
      
      // Note labels with better typography
      ctx.fillStyle = isBlackKey ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${noteName}${currentOctave}`, 170, y + cellHeight / 2 + 4);
      
      // Subtle key separators
      if (noteIndex === 0) { // C notes get extra emphasis
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(180, y);
        ctx.stroke();
      }
    }

    // Draw notes with modern styling
    parsedData.notes.forEach((note, index) => {
      const midiNote = getMidiNoteNumber(note.note, note.octave);
      const noteRow = midiNote - (startOctave * 12);
      
      console.log(`Note ${note.note}${note.octave} -> MIDI ${midiNote} -> Row ${noteRow}`);
      
      if (noteRow >= 0 && noteRow < totalKeys) {
        const x = 180 + note.time * cellWidth;
        const y = 50 + (totalKeys - 1 - noteRow) * cellHeight;
        const noteWidth = Math.max(note.duration * cellWidth - 3, 8);
        const noteHeight = cellHeight - 3;
        
        // Modern note styling with shadows and gradients
        const baseColor = trackColors[note.track % trackColors.length];
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x + 2, y + 2, noteWidth, noteHeight);
        
        // Note gradient
        const noteGradient = ctx.createLinearGradient(x, y, x, y + noteHeight);
        noteGradient.addColorStop(0, baseColor);
        noteGradient.addColorStop(0.7, baseColor + 'CC');
        noteGradient.addColorStop(1, baseColor + '99');
        
        ctx.fillStyle = noteGradient;
        ctx.fillRect(x, y, noteWidth, noteHeight);
        
        // Modern border
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, noteWidth, noteHeight);
        
        // Inner highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, noteWidth - 2, noteHeight - 2);
        
        // Note text with better readability
        if (noteWidth > 35) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 2;
          ctx.fillText(
            `${note.note}${note.octave}`,
            x + 6,
            y + cellHeight / 2 + 3
          );
          ctx.shadowBlur = 0;
        }
      }
    });

    // Modern time markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= parsedData.totalTime; i += 4) {
      const x = 180 + i * cellWidth;
      ctx.fillText(i.toString(), x, height - 20);
    }
  };

  const handleGenerate = () => {
    try {
      const parsed = parseInput(inputText);
      setParsedData(parsed);
      console.log('Parsed data:', parsed);
      
      // Clear any previous export errors
      setExportError(null);
    } catch (error) {
      console.error('Error parsing input:', error);
      toast({
        title: "Parse Error",
        description: "Error parsing your notes. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const handleExportMidi = async () => {
    if (!parsedData || parsedData.notes.length === 0) {
      toast({
        title: "No Notes Available",
        description: "Please generate a piano roll with notes first",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setExportError(null);
    
    try {
      console.log('=== MIDI Export Process Started ===');
      
      // Validate notes before export
      const validNotes = parsedData.notes.filter(note => {
        const isValid = note.note && 
                       typeof note.octave === 'number' && 
                       note.octave >= 0 && note.octave <= 9 &&
                       typeof note.time === 'number' && 
                       note.time >= 0 &&
                       typeof note.duration === 'number' && 
                       note.duration > 0 &&
                       typeof note.track === 'number' && 
                       note.track >= 0;
        
        if (!isValid) {
          console.warn('Invalid note filtered out:', note);
        }
        return isValid;
      });

      if (validNotes.length === 0) {
        throw new Error('No valid notes found for export');
      }

      console.log(`Exporting ${validNotes.length} valid notes`);

      // Create MIDI file
      const midi = exportToMidi(validNotes, { tempo: tempo });

      if (!midi) {
        throw new Error('Failed to create MIDI file');
      }

      // Generate filename with timestamp
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .substring(0, 19);
      
      const filename = `piano-roll-${timestamp}.mid`;

      // Download file
      const downloadSuccess = await downloadMidiFile(midi, filename);
      
      if (downloadSuccess) {
        toast({
          title: "MIDI Export Successful! 🎵",
          description: `${filename} has been downloaded successfully!`,
        });
        
        console.log('=== MIDI Export Completed Successfully ===');
      } else {
        throw new Error('Download process failed');
      }
      
    } catch (error) {
      console.error('=== MIDI Export Failed ===');
      console.error('Error details:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setExportError(errorMessage);
      
      toast({
        title: "MIDI Export Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePresetGenerate = (presetText: string) => {
    setInputText(presetText);
    toast({
      title: "Preset Generated!",
      description: "Your preset has been loaded. Click 'Generate Piano Roll' to see it.",
    });
  };

  const handleHumanize = (humanizedText: string) => {
    setInputText(humanizedText);
    toast({
      title: "Notes Humanized!",
      description: "Your notes have been randomly adjusted for a more natural feel.",
    });
  };

  useEffect(() => {
    if (parsedData) {
      drawPianoRoll();
    }
  }, [parsedData, showGrid, cellWidth, cellHeight]);

  useEffect(() => {
    // Generate initial piano roll
    handleGenerate();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Apple-like styling */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Piano Roll Painter
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Convert text-based notes into visual piano roll patterns
        </p>
      </div>

      {/* Tempo and Key Selector */}
      <TempoKeySelector
        tempo={tempo}
        onTempoChange={setTempo}
        musicKey={musicKey}
        onKeyChange={setMusicKey}
      />

      {/* Preset Generator */}
      <PresetSelector
        onPresetGenerate={handlePresetGenerate}
        onHumanize={handleHumanize}
        inputText={inputText}
      />

      {/* Input Section with modern card design */}
      <Card className="p-6 bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Music className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Note Input</h2>
          </div>
          
          <Textarea
            placeholder="Enter your notes here... (e.g., Track 1: C5-4 F#5-0.25 G5-2)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] font-mono text-sm bg-white/50 dark:bg-slate-800/50 border-0 shadow-inner resize-none focus:ring-2 focus:ring-blue-500/20"
          />
          
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGenerate} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
              <Play className="w-4 h-4 mr-2" />
              Generate Piano Roll
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowGrid(!showGrid)}
              className={`shadow-md ${showGrid ? "bg-green-50 border-green-300 text-green-700" : ""}`}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              {showGrid ? "Hide Grid" : "Show Grid"}
            </Button>
            <Button 
              onClick={handleExportMidi}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
              disabled={!parsedData || parsedData.notes.length === 0 || isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export MIDI"}
            </Button>
          </div>

          {/* Export Error Display */}
          {exportError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{exportError}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Stats with modern badges */}
      {parsedData && (
        <div className="flex gap-3 justify-center flex-wrap">
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-blue-100 text-blue-700 border-0">
            {parsedData.notes.length} Notes
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-700 border-0">
            {parsedData.tracks} Tracks
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-orange-100 text-orange-700 border-0">
            {parsedData.totalTime} Time Units
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-100 text-purple-700 border-0">
            {tempo} BPM
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-pink-100 text-pink-700 border-0">
            {musicKey} Key
          </Badge>
        </div>
      )}

      {/* Canvas with modern container */}
      <Card className="p-4 bg-gradient-to-br from-slate-100/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm border-0 shadow-xl">
        <div className="overflow-x-auto rounded-xl">
          <canvas
            ref={canvasRef}
            className="border-0 rounded-xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default PianoRollCanvas;
