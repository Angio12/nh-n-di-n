import { useState } from 'react';
import { Header } from './components/Header';
import { ResultDashboard } from './components/ResultDashboard';
import { CameraScanner } from './components/CameraScanner';
import { DatasetModal } from './components/DatasetModal';
import { classifyRGB } from './utils/knn';
import { ClassificationResult, MeatSample } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'result' | 'camera'>('result');
  const [isDatasetOpen, setIsDatasetOpen] = useState(false);

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

  // Handle sample selection from dataset or presets
  const handleSelectSample = (sample: MeatSample) => {
    const evaluated = classifyRGB(sample.r, sample.g, sample.b, 3);
    setClassificationResult(evaluated);
    setActiveTab('result');
  };

  // Handle manual RGB change if needed
  const handleManualRGBChange = (r: number, g: number, b: number) => {
    const evaluated = classifyRGB(r, g, b, 3);
    setClassificationResult(evaluated);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-[#f3f4f6] flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenDataset={() => setIsDatasetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col justify-start">
        {activeTab === 'result' && (
          <ResultDashboard
            result={classificationResult}
            onOpenScanner={() => setActiveTab('camera')}
            onOpenDataset={() => setIsDatasetOpen(true)}
            onSelectPreset={handleSelectSample}
            onManualRGBChange={handleManualRGBChange}
          />
        )}

        {activeTab === 'camera' && (
          <CameraScanner
            onCapture={handleCaptureResult}
            onCancel={() => setActiveTab('result')}
          />
        )}
      </main>

      {/* Dataset Modal Viewer */}
      <DatasetModal
        isOpen={isDatasetOpen}
        onClose={() => setIsDatasetOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
