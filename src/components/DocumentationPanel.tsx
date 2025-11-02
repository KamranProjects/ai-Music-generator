
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Copy, Check, Bot, Music2, Lightbulb } from 'lucide-react';

const DocumentationPanel: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const aiPromptTemplate = `Generate MIDI notes for a [GENRE] track with [MOOD] vibe.

📝 Format: NoteName+Octave-Duration
Example: C5-0.25 means C note, 5th octave, 0.25 beats

🎵 Available Notes: C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B
🎹 Octave Range: 4 (low) to 7 (high)
⏱️ Duration: 0.125 to 8 beats (0.125 = sixteenth note, 0.25 = eighth, 0.5 = quarter, 1 = whole)

Structure:
Track 1: [melody line - catchy main theme]
Track 2: [bass line - rhythmic foundation]
Track 3: [harmony/chords - supporting progression]

✨ Example Output:
Track 1: F#5-0.25 G5-0.25 A5-0.5 F#5-0.25 E5-0.75
Track 2: D4-1 A4-0.5 D4-0.5
Track 3: D5-0.5 F#5-0.5 A5-1

Make it [DESCRIPTION - e.g., "energetic and uplifting", "dark and moody", "minimal and spacious"]`;

  const examples = [
    {
      title: "🎸 Pop Hook",
      code: `Track 1: C5-0.5 E5-0.5 G5-0.25 E5-0.25 C5-1
Track 2: C4-2 G4-1 C4-1
Track 3: E4-0.5 G4-0.5 C5-1`,
      description: "Catchy pop melody with simple chord backing",
      genre: "Pop"
    },
    {
      title: "🎹 Piano Ballad",
      code: `Track 1: F#5-0.25 F#5-0.25 G5-0.25 F#5-0.25 F#5-0.5 F#5-0.25 G5-0.125 G5-0.125 F#5-0.25
Track 2: D4-1 A4-0.5 D4-0.5
Track 3: D5-0.5 F#5-0.5 A5-1`,
      description: "Emotional melody with varied rhythms and harmonies",
      genre: "Ballad"
    },
    {
      title: "🎵 EDM Arpeggio",
      code: `Track 1: C5-0.25 E5-0.25 G5-0.25 C6-0.25 G5-0.25 E5-0.25 C5-0.5
Track 2: C4-2 F4-2
Track 3: E4-0.25 G4-0.25 C5-0.25 E5-0.25`,
      description: "Fast arpeggiated pattern perfect for electronic music",
      genre: "EDM"
    },
    {
      title: "🎼 Jazz Progression",
      code: `Track 1: D5-0.75 F5-0.25 A5-0.5 G5-0.5
Track 2: D4-1 G4-0.5 D4-0.5
Track 3: F#4-0.5 A4-0.5 C5-0.5 E5-0.5`,
      description: "Smooth jazz feel with walking bass implications",
      genre: "Jazz"
    },
    {
      title: "🥁 Trap Hi-Hats",
      code: `Track 1: G#5-0.125 G#5-0.125 G#5-0.25 G#5-0.125 G#5-0.125 G#5-0.25
Track 2: C4-1 C4-1
Track 3: E4-0.5 E4-0.5`,
      description: "Fast hi-hat pattern typical in trap/hip-hop",
      genre: "Trap"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Documentation & AI Guide
          </h2>
        </div>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">Format Guide</TabsTrigger>
            <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="grid gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Music2 className="w-5 h-5 text-blue-500" />
                  Quick Start Format
                </h3>
                <div className="space-y-3">
                  <code className="block bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg text-sm font-mono border border-blue-200 dark:border-blue-800">
                    Track 1: C5-0.5 E5-0.5 G5-1
                  </code>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Track 1:</span>
                      <p className="text-muted-foreground mt-1">Track identifier</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded">
                      <span className="font-semibold text-green-600 dark:text-green-400">C5</span>
                      <p className="text-muted-foreground mt-1">Note + Octave</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">0.5</span>
                      <p className="text-muted-foreground mt-1">Duration (beats)</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/50 dark:bg-white/5">
                <h3 className="font-semibold mb-3">📏 Duration Guide</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">0.125</Badge>
                    <span className="text-sm">Sixteenth note (♬)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">0.25</Badge>
                    <span className="text-sm">Eighth note (♪)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">0.5</Badge>
                    <span className="text-sm">Quarter note (♩)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">1.0</Badge>
                    <span className="text-sm">Half note (𝅗𝅥)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">2.0</Badge>
                    <span className="text-sm">Whole note (𝅝)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Badge variant="outline" className="font-mono">0.75</Badge>
                    <span className="text-sm">Dotted quarter (♩.)</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/50 dark:bg-white/5">
                <h3 className="font-semibold mb-3">🎼 Available Notes</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-2">
                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                      <Badge key={note} variant="secondary" className="text-center py-2 font-mono">
                        {note}
                      </Badge>
                    ))}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                    <p className="text-xs text-muted-foreground">
                      Use sharps (#) or flats (b) interchangeably - C# = Db, F# = Gb, etc.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/50 dark:bg-white/5">
                <h3 className="font-semibold mb-3">🎹 Octave Range</h3>
                <div className="space-y-3">
                  <div className="flex gap-2 justify-center">
                    {[
                      { octave: 4, label: 'Low', color: 'bg-blue-100 dark:bg-blue-900/30' },
                      { octave: 5, label: 'Mid', color: 'bg-green-100 dark:bg-green-900/30' },
                      { octave: 6, label: 'High', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
                      { octave: 7, label: 'Very High', color: 'bg-red-100 dark:bg-red-900/30' }
                    ].map(({ octave, label, color }) => (
                      <div key={octave} className={`${color} px-4 py-2 rounded-lg text-center flex-1`}>
                        <div className="font-bold text-lg">{octave}</div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Most melodies use octaves 5-6. Bass lines use 4. High leads use 7.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-prompt" className="space-y-4">
            <Card className="p-4 bg-white/50 dark:bg-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">AI Chatbot Prompt Template</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Copy this template and customize it for your AI chatbot:
                </p>
                <div className="relative">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {aiPromptTemplate}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(aiPromptTemplate, 'ai-prompt')}
                  >
                    {copiedSection === 'ai-prompt' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/50 dark:bg-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Example AI Requests</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded">
                  <p className="text-sm font-medium">For a happy pop song:</p>
                  <p className="text-sm text-muted-foreground">
                    "Create a happy pop melody in C major with a simple bass line and harmonies"
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded">
                  <p className="text-sm font-medium">For a sad ballad:</p>
                  <p className="text-sm text-muted-foreground">
                    "Generate a melancholic piano ballad with descending melodies and minor chords"
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded">
                  <p className="text-sm font-medium">For electronic music:</p>
                  <p className="text-sm text-muted-foreground">
                    "Create an energetic electronic dance track with arpeggiated synths and a driving bassline"
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            {examples.map((example, index) => (
              <Card key={index} className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{example.title}</h3>
                    <Badge variant="outline" className="text-xs">{example.genre}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(example.code, `example-${index}`)}
                    className="hover:bg-green-50 dark:hover:bg-green-950/30"
                  >
                    {copiedSection === `example-${index}` ? (
                      <>
                        <Check className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">{example.description}</p>
                <pre className="bg-slate-900 dark:bg-black p-4 rounded-lg text-sm overflow-x-auto font-mono text-green-400 border border-slate-700">
                  {example.code}
                </pre>
              </Card>
            ))}
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Want More Examples?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Use the AI Prompt tab to generate unlimited custom patterns tailored to your needs!
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Ask ChatGPT</Badge>
                <Badge variant="secondary">Ask Claude</Badge>
                <Badge variant="secondary">Ask any AI</Badge>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default DocumentationPanel;
