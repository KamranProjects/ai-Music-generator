# 🎹 AI-Powered Text to Music Generator

So basically... I was too lazy to learn full music theory 😂
I wanted to make melodies, drums, and stuff without wasting hours figuring out where each note goes — so I made this AI MIDI Generator.

You just type something like:

“Make a chill lofi beat with a sad vibe”

…and boom — it gives you ready notes for melody, bass, and chords. You can drop that straight into a piano roll, edit anything, and even export to FL Studio as a MIDI.

Most AI tools make random music you can’t control — this one gives you everything in your hands.
The UI and features were built half with vibe-coding and half by me fixing and adding stuff until it felt smooth.

It’s like your lazy shortcut to creating music — but still with full control 🎹🔥

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)

A modern, intuitive web application for generating MIDI compositions using AI-powered text input and visual piano roll editing. Built with React, TypeScript, and ToneJS, this tool bridges the gap between AI music generation and traditional MIDI workflows.

---

## ✨ Key Features

### 🎼 **Piano Roll Editor**
- **Visual MIDI Editing**: Interactive canvas displaying notes across 4+ octaves (C4-G7+)
- **Sharp/Flat Support**: Full chromatic scale with both sharp (#) and flat (b) notation
- **Real-time Preview**: Instant visual feedback for all note inputs
- **Track Management**: Multi-track composition with independent track controls
- **Responsive Design**: Apple-inspired UI with smooth animations and gradients

### 🥁 **Pattern Rack (Drum Sequencer)**
- **16-Step Sequencer**: FL Studio-style step sequencer for drum programming
- **Multiple Instruments**: Add custom drum sounds (Kick, Snare, Hi-Hat, Clap, 808, etc.)
- **Visual Feedback**: Active/inactive states with clear color-coded UI
- **Quick Patterns**: Click to toggle steps, instant pattern creation

### 🤖 **AI Integration Ready**
- **Text-to-MIDI Parsing**: Natural language input format compatible with AI models (ChatGPT, Claude, etc.)
- **Structured Format**: Simple, human-readable note format that AI can easily generate
- **Preset System**: Pre-configured musical patterns and chord progressions
- **Export to DAW**: One-click MIDI file export for use in any DAW

### 🎨 **Modern UI/UX**
- **Dark/Light Mode**: Seamless theme switching with semantic design tokens
- **Gradient Aesthetics**: Apple-inspired gradients and shadows
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile
- **Accessible**: ARIA labels and keyboard navigation support

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Input Format**: Enter notes in the text area using this format:
   ```
   Track 1: C5-0.25 D5-0.25 E5-0.5 F5-1
   Track 2: C4-1 G4-0.5 C4-0.5
   ```

2. **Generate Piano Roll**: Click "Generate" to visualize your composition

3. **Pattern Rack**: Add drum instruments and click steps to create rhythms

4. **Export MIDI**: Download your composition as a standard MIDI file

---

## 📖 Note Format Specification

### Basic Syntax
```
Track [Number]: [Note1-Duration] [Note2-Duration] ...
```

### Note Components

| Component | Format | Example | Description |
|-----------|--------|---------|-------------|
| **Note Name** | `C`, `C#`, `Db`, etc. | `F#`, `Bb` | Any chromatic note (supports # and b) |
| **Octave** | `4-7` | `5` | Octave number (4=low, 7=high) |
| **Duration** | `0.125-8` | `0.25` | Note length in beats |

### Examples

```
# Simple melody
Track 1: C5-1 E5-1 G5-1 C6-1

# Chord progression with bass
Track 1: C5-0.5 E5-0.5 G5-0.5 C6-0.5
Track 2: C4-2 F4-2

# Complex rhythm with sharps
Track 1: F#5-0.25 F#5-0.25 G5-0.25 F#5-0.25 F#5-0.5
Track 2: C#4-1 F#4-1
```

---

## 🎯 AI Prompt Engineering

### Using with ChatGPT/Claude

**Prompt Template:**
```
Generate piano roll notes for a [GENRE] song with [MOOD] feeling.

Format: NoteName+Octave-Duration (e.g., C5-0.5)
Available notes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
Octaves: 4-7
Duration: 0.125 to 8 beats

Create 3 tracks:
Track 1: [melody]
Track 2: [bass line]
Track 3: [harmony/chords]

Make it sound [DESCRIPTION].
```

**Example Requests:**

```
🎸 "Create an upbeat pop melody in C major with catchy hooks"

🎹 "Generate a melancholic piano ballad with descending lines"

🎵 "Make an energetic EDM drop with arpeggiated synths"

🎼 "Compose a jazz progression with walking bass"
```

### AI Integration Benefits

- ✅ **No Music Theory Required**: Let AI handle chord progressions and harmonies
- ✅ **Rapid Prototyping**: Generate multiple variations in seconds
- ✅ **Genre Exploration**: Experiment with styles you're unfamiliar with
- ✅ **Learning Tool**: Analyze AI-generated patterns to learn music theory

---

## 🏗️ Architecture

### Tech Stack

```
Frontend Framework:   React 18.3.1 + TypeScript
Build Tool:           Vite 5.x
Styling:              Tailwind CSS + shadcn/ui
MIDI Engine:          ToneJS (@tonejs/midi)
State Management:     React Hooks
Routing:              React Router DOM
```

### Project Structure

```
src/
├── components/
│   ├── PianoRollCanvas.tsx      # Main piano roll editor
│   ├── PatternRack.tsx          # Drum sequencer component
│   ├── DocumentationPanel.tsx   # In-app user guide
│   ├── PresetSelector.tsx       # Preset pattern selector
│   └── ui/                      # shadcn UI components
├── utils/
│   ├── midiExport.ts            # MIDI file generation
│   └── presetGenerator.ts       # Preset pattern library
├── pages/
│   └── Index.tsx                # Main application page
└── styles/
    └── index.css                # Design system tokens
```

### Key Components

#### **PianoRollCanvas** (`src/components/PianoRollCanvas.tsx`)
- Parses text input into structured note data
- Renders interactive canvas with notes and grid
- Handles note range from C4 to G7+
- Converts between sharp/flat notations
- Exports MIDI files via ToneJS

#### **PatternRack** (`src/components/PatternRack.tsx`)
- 16-step sequencer for drum programming
- Dynamic instrument management
- Visual step activation/deactivation
- Color-coded UI for active states

#### **MIDI Export** (`src/utils/midiExport.ts`)
- Converts internal format to standard MIDI
- Configurable tempo (default 120 BPM)
- Multi-track support with automatic MIDI channel assignment
- Error handling for invalid note data

---

## 🎨 Design System

### Color Palette (HSL-based)

The application uses semantic design tokens for consistent theming:

```css
/* Primary Colors */
--primary: 270 60% 50%        /* Purple */
--primary-glow: 280 70% 65%   /* Light purple */

/* Gradients */
--gradient-primary: linear-gradient(135deg, hsl(270 60% 50%), hsl(280 70% 65%))
--gradient-subtle: linear-gradient(180deg, slate-50, blue-50)

/* Shadows */
--shadow-elegant: 0 10px 30px -10px hsl(270 60% 50% / 0.3)
--shadow-glow: 0 0 40px hsl(280 70% 65% / 0.4)
```

### Typography

- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, ...`)
- **Headings**: Bold, gradient text effects
- **Code Blocks**: Monospace with syntax highlighting

---

## 🔧 Advanced Features

### Tempo & Key Selection
Customize musical parameters:
- Tempo range: 60-200 BPM
- Key signatures: All major and minor keys
- Real-time preview updates

### Preset Library
Pre-built patterns for quick start:
- Chord progressions (I-IV-V-I, ii-V-I)
- Rhythmic patterns (Syncopated, Steady)
- Genre-specific templates (Pop, Jazz, EDM)

### Export Options
- **MIDI File**: Standard .mid format for DAWs
- **Copy to Clipboard**: Quick sharing of note patterns
- **JSON Export**: Structured data for custom workflows

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup

No environment variables required for basic usage. All processing happens client-side.

### Building for Production

```bash
npm run build
# Output: dist/
```

Deploy the `dist/` folder to any static hosting service (Vercel, Netlify, GitHub Pages).

---

## 🎓 Use Cases

### For Producers
- **Rapid Prototyping**: Sketch ideas quickly with AI assistance
- **MIDI Mockups**: Create reference tracks for clients
- **Learning Tool**: Study chord progressions and melodies

### For Developers
- **API Integration**: Connect to AI music generation services
- **Custom Workflows**: Extend with additional MIDI processing
- **Educational Apps**: Build music theory learning tools

### For Educators
- **Teaching Music Theory**: Visual representation of musical concepts
- **Composition Assignments**: Students create and export compositions
- **AI Exploration**: Demonstrate AI applications in creative fields

---

## 📊 Performance

- **Bundle Size**: ~300KB (gzipped)
- **First Load**: <1s on modern browsers
- **Canvas Rendering**: 60fps smooth animations
- **MIDI Export**: Instant (<100ms for typical compositions)

---

## 🤝 Contributing

We welcome contributions! Areas for improvement:

- [ ] Add more preset patterns
- [ ] Implement real-time audio playback
- [ ] Expand octave range (C0-C8)
- [ ] Add velocity/dynamics control
- [ ] Multi-file MIDI project export
- [ ] Undo/redo functionality
- [ ] Collaborative editing

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful React components
- **ToneJS** - MIDI processing library
- **Lucide Icons** - Icon system
- **Tailwind CSS** - Utility-first styling

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check the [in-app documentation](#) for usage guides
- Review the [AI prompt examples](#ai-prompt-engineering) for integration help

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
