import React from 'react';
import { Camera, BarChart3, Database, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'result' | 'camera';
  onTabChange: (tab: 'result' | 'camera') => void;
  onOpenDataset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenDataset,
}) => {
  return (
    <header className="bg-[#1e1e24] border-b border-[#2e2e38] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#f3f4f6] tracking-tight">
            Dự án nhận diện độ tươi của thịt
          </h1>
          <p className="text-xs text-[#9ca3af]">
            Trường THPT Nguyễn Khuyến • Màng chỉ thị màu sinh học & Thuật toán k-NN (k=3)
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            id="tab-btn-result"
            onClick={() => onTabChange('result')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === 'result'
                ? 'bg-[#3b82f6] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Kết Quả Đánh Giá</span>
          </button>
          <button
            id="tab-btn-camera"
            onClick={() => onTabChange('camera')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === 'camera'
                ? 'bg-[#3b82f6] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Quét Mẫu</span>
          </button>
        </div>

        {/* Dataset Button */}
        <button
          id="btn-open-dataset"
          onClick={onOpenDataset}
          title="Xem bộ dữ liệu 28 mẫu thực nghiệm"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2e2e38]/80 text-[#9ca3af] hover:text-white hover:bg-[#2e2e38] border border-white/10 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Dataset (28 mẫu)</span>
        </button>
      </div>
    </header>
  );
};
