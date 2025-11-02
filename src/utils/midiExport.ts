
import { Midi } from '@tonejs/midi';

interface Note {
  note: string;
  octave: number;
  time: number;
  duration: number;
  track: number;
  velocity?: number;
}

interface MidiExportOptions {
  tempo?: number;
  ticksPerQuarter?: number;
}

export const exportToMidi = (notes: Note[], options: MidiExportOptions = {}) => {
  const { tempo = 120 } = options;
  
  console.log('Starting MIDI export with notes:', notes);
  console.log('Export options:', { tempo });
  
  if (!notes || notes.length === 0) {
    console.error('No notes provided for MIDI export');
    throw new Error('No notes to export');
  }
  
  try {
    // Create a new MIDI file - the constructor handles ppq internally
    const midi = new Midi();
    
    // Set tempo using the tempos array (this is the correct way)
    midi.header.tempos = [{ 
      ticks: 0, 
      bpm: tempo,
      time: 0
    }];
    
    console.log('MIDI header initialized with tempo:', tempo);
    
    // Group notes by track
    const trackGroups: { [key: number]: Note[] } = {};
    let maxTrack = 0;
    
    notes.forEach(note => {
      const trackNum = Math.max(0, Math.floor(note.track));
      maxTrack = Math.max(maxTrack, trackNum);
      
      if (!trackGroups[trackNum]) {
        trackGroups[trackNum] = [];
      }
      trackGroups[trackNum].push(note);
    });
    
    console.log(`Creating ${maxTrack + 1} tracks:`, Object.keys(trackGroups));
    
    // Create tracks and add notes
    for (let trackIndex = 0; trackIndex <= maxTrack; trackIndex++) {
      const track = midi.addTrack();
      track.name = `Track ${trackIndex + 1}`;
      
      // Set instrument (piano by default)
      track.instrument.number = 0; // Acoustic Grand Piano
      
      const trackNotes = trackGroups[trackIndex] || [];
      console.log(`Processing track ${trackIndex} with ${trackNotes.length} notes`);
      
      trackNotes.forEach((note, noteIndex) => {
        try {
          const midiNote = noteToMidi(note.note, note.octave);
          
          if (midiNote < 0 || midiNote > 127) {
            console.warn(`Invalid MIDI note: ${note.note}${note.octave} -> ${midiNote}`);
            return;
          }
          
          // Convert time units to seconds (assuming 1 time unit = 1 quarter note)
          const timeInSeconds = Math.max(0, (note.time * 60) / tempo);
          const durationInSeconds = Math.max(0.1, (note.duration * 60) / tempo);
          const velocity = Math.max(0.1, Math.min(1.0, (note.velocity || 80) / 127));
          
          console.log(`Adding note ${noteIndex + 1}:`, {
            note: `${note.note}${note.octave}`,
            midi: midiNote,
            time: timeInSeconds,
            duration: durationInSeconds,
            velocity
          });
          
          track.addNote({
            midi: midiNote,
            time: timeInSeconds,
            duration: durationInSeconds,
            velocity: velocity
          });
          
        } catch (noteError) {
          console.error(`Error processing note ${noteIndex}:`, noteError);
        }
      });
    }
    
    console.log('MIDI file creation completed successfully');
    console.log('Final MIDI stats:', {
      tracks: midi.tracks.length,
      totalNotes: midi.tracks.reduce((sum, track) => sum + track.notes.length, 0),
      duration: midi.duration
    });
    
    return midi;
    
  } catch (error) {
    console.error('Critical error in MIDI creation:', error);
    throw new Error(`MIDI creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const noteToMidi = (note: string, octave: number): number => {
  // Enhanced note mapping with proper sharp/flat support
  const noteMap: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'CS': 1, 'DB': 1, 'Db': 1, 'db': 1,
    'D': 2, 'D#': 3, 'DS': 3, 'EB': 3, 'Eb': 3, 'eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'FS': 6, 'GB': 6, 'Gb': 6, 'gb': 6,
    'G': 7, 'G#': 8, 'GS': 8, 'AB': 8, 'Ab': 8, 'ab': 8,
    'A': 9, 'A#': 10, 'AS': 10, 'BB': 10, 'Bb': 10, 'bb': 10,
    'B': 11
  };
  
  // Handle both F# and F#5 formats
  let normalizedNote = note.toUpperCase();
  if (normalizedNote.includes('#')) {
    normalizedNote = normalizedNote.replace('#', '#');
  } else if (normalizedNote.includes('S')) {
    normalizedNote = normalizedNote.replace('S', '#');
  }
  
  const noteValue = noteMap[normalizedNote];
  
  if (noteValue === undefined) {
    console.warn(`Unknown note: ${note} (normalized: ${normalizedNote})`);
    return -1;
  }
  
  // Clamp octave to valid range
  const clampedOctave = Math.max(-1, Math.min(9, octave));
  const midiNumber = (clampedOctave + 1) * 12 + noteValue;
  
  console.log(`Note conversion: ${note}${octave} -> MIDI ${midiNumber}`);
  return midiNumber;
};

export const downloadMidiFile = async (midi: Midi, filename: string = 'piano-roll-export.mid') => {
  try {
    console.log('Starting MIDI file download process...');
    
    if (!midi || !midi.tracks || midi.tracks.length === 0) {
      throw new Error('Invalid MIDI object - no tracks found');
    }
    
    // Convert MIDI to array buffer
    const arrayBuffer = midi.toArray();
    
    if (!arrayBuffer || arrayBuffer.length === 0) {
      throw new Error('Failed to generate MIDI data');
    }
    
    console.log('MIDI array buffer generated:', {
      size: arrayBuffer.length,
      type: typeof arrayBuffer
    });
    
    // Create blob with proper MIME type - convert to regular Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = new Blob([uint8Array], { 
      type: 'audio/midi'
    });
    
    if (blob.size === 0) {
      throw new Error('Generated MIDI file is empty');
    }
    
    console.log('MIDI blob created:', {
      size: blob.size,
      type: blob.type
    });
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    console.log('Object URL created:', url);
    
    // Create and configure download link
    const downloadLink = document.createElement('a') as HTMLAnchorElement;
    downloadLink.href = url;
    downloadLink.download = filename.endsWith('.mid') ? filename : `${filename}.mid`;
    downloadLink.style.setProperty('display', 'none');
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    
    try {
      downloadLink.click();
      console.log('Download triggered successfully');
    } catch (clickError) {
      console.error('Click error:', clickError);
      throw new Error('Failed to trigger download');
    } finally {
      // Clean up DOM
      document.body.removeChild(downloadLink);
    }
    
    // Clean up URL after delay
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
        console.log('Object URL cleaned up');
      } catch (cleanupError) {
        console.warn('URL cleanup error:', cleanupError);
      }
    }, 2000);
    
    return true;
    
  } catch (error) {
    console.error('MIDI download error:', error);
    throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
