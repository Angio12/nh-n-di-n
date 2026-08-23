import { useState } from 'react';
import { Header } from './components/Header';
import { ResultDashboard } from './components/ResultDashboard';
import { CameraScanner } from './components/CameraScanner';
import { classifyRGB } from './utils/knn';
import { ClassificationResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'result' | 'camera'>('result');

  // Initial state: fresh sample (Experiment 1, 0h Group A: R=200, G=176, B=178)
  const [classificationResult, setClassificationResult] = useState<ClassificationResult>(() => {
    return classifyRGB(200, 176, 178, 3);
  });

  // Handle capture from camera or image upload
  const handleCaptureResult = (data: {
    r: number;
    g: number;
    b: number;
    imageUrl: string;
    roiCenter: { x: number; y: number };
    roiRadius: number;
  }) => {
    const evaluated = classifyRGB(
      data.r,
      data.g,
      data.b,
      3,
      data.imageUrl,
      data.roiCenter,
      data.roiRadius
    );
    setClassificationResult(evaluated);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-[#121214] text-[#f3f4f6] flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col justify-start">
        {activeTab === 'result' && (
          <ResultDashboard
            result={classificationResult}
            onOpenScanner={() => setActiveTab('camera')}
          />
        )}

        {activeTab === 'camera' && (
          <CameraScanner
            onCapture={handleCaptureResult}
            onCancel={() => setActiveTab('result')}
          />
        )}
      </main>
    </div>
  );
}
