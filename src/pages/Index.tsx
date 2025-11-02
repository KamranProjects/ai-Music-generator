
import React from 'react';
import PianoRollCanvas from '@/components/PianoRollCanvas';
import PatternRack from '@/components/PatternRack';
import DocumentationPanel from '@/components/DocumentationPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PianoRollCanvas />
        <PatternRack />
        <DocumentationPanel />
      </div>
    </div>
  );
};

export default Index;
