
interface PresetNote {
  note: string;
  octave: number;
  duration: number;
}

interface Preset {
  name: string;
  tracks: PresetNote[][];
  tempo: number;
  description: string;
}

const presets: Preset[] = [
  {
    name: "Sad Melody",
    tracks: [
      [
        { note: "A", octave: 4, duration: 4 },
        { note: "F", octave: 4, duration: 4 },
        { note: "C", octave: 4, duration: 4 },
        { note: "G", octave: 4, duration: 4 }
      ],
      [
        { note: "A", octave: 3, duration: 8 },
        { note: "F", octave: 3, duration: 8 }
      ]
    ],
    tempo: 80,
    description: "Melancholic melody in A minor"
  },
  {
    name: "Trap Arp",
    tracks: [
      [
        { note: "C", octave: 5, duration: 1 },
        { note: "E", octave: 5, duration: 1 },
        { note: "G", octave: 5, duration: 1 },
        { note: "C", octave: 6, duration: 1 },
        { note: "G", octave: 5, duration: 1 },
        { note: "E", octave: 5, duration: 1 },
        { note: "C", octave: 5, duration: 1 },
        { note: "G", octave: 4, duration: 1 }
      ]
    ],
    tempo: 140,
    description: "Fast arpeggiated pattern for trap beats"
  },
  {
    name: "Happy Chord Progression",
    tracks: [
      [
        { note: "C", octave: 4, duration: 4 },
        { note: "G", octave: 4, duration: 4 },
        { note: "A", octave: 4, duration: 4 },
        { note: "F", octave: 4, duration: 4 }
      ],
      [
        { note: "C", octave: 3, duration: 4 },
        { note: "G", octave: 3, duration: 4 },
        { note: "A", octave: 3, duration: 4 },
        { note: "F", octave: 3, duration: 4 }
      ]
    ],
    tempo: 120,
    description: "Uplifting chord progression in C major"
  },
  {
    name: "Ambient Pad",
    tracks: [
      [
        { note: "C", octave: 4, duration: 8 },
        { note: "E", octave: 4, duration: 8 },
        { note: "G", octave: 4, duration: 8 },
        { note: "B", octave: 4, duration: 8 }
      ]
    ],
    tempo: 60,
    description: "Slow, atmospheric pad sounds"
  }
];

export const generatePreset = (presetName: string): string => {
  const preset = presets.find(p => p.name === presetName);
  if (!preset) return "";
  
  let output = "";
  preset.tracks.forEach((track, trackIndex) => {
    const trackLine = `Track ${trackIndex + 1}: `;
    const notes = track.map(note => `${note.note}${note.octave}-${note.duration}`).join(' ');
    output += trackLine + notes + "\n";
  });
  
  return output.trim();
};

export const getPresetList = () => presets.map(p => ({ name: p.name, description: p.description, tempo: p.tempo }));

export const randomizeNotes = (inputText: string, humanizeAmount: number = 0.1): string => {
  const lines = inputText.split('\n');
  
  return lines.map(line => {
    if (!line.includes('Track')) return line;
    
    const [trackPrefix, ...noteParts] = line.split(': ');
    const noteString = noteParts.join(': ');
    const notes = noteString.split(' ').filter(n => n.trim());
    
    const humanizedNotes = notes.map(note => {
      const match = note.match(/^([A-G][#b]?)(\d+)-(\d+)$/);
      if (!match) return note;
      
      const [, noteName, octave, duration] = match;
      const originalDuration = parseInt(duration);
      
      // Randomly adjust duration slightly
      const variation = (Math.random() - 0.5) * 2 * humanizeAmount;
      const newDuration = Math.max(1, Math.round(originalDuration * (1 + variation)));
      
      return `${noteName}${octave}-${newDuration}`;
    });
    
    return `${trackPrefix}: ${humanizedNotes.join(' ')}`;
  }).join('\n');
};
