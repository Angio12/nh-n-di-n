import React from 'react';
import { Camera, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'result' | 'camera';
  onTabChange: (tab: 'result' | 'camera') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="bg-[#1e1e24] border-b border-[#2e2e38] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Title & Subtitle */}
      <div className="logo-title flex items-center gap-3">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#f3f4f6] tracking-tight">
            Dự án nhận diện độ tươi của thịt
          </h1>
          <p className="text-xs text-[#9ca3af]">
            Trường THPT Nguyễn Khuyến
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        <div className="nav-tabs flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            id="tab-btn-result"
            onClick={() => onTabChange('result')}
            className={`tab-btn flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'result'
                ? 'bg-[#3b82f6] text-white shadow-sm active'
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Kết Quả Đánh Giá</span>
          </button>
          <button
            id="tab-btn-camera"
            onClick={() => onTabChange('camera')}
            className={`tab-btn flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-[#3b82f6] text-white shadow-sm active'
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Quét Mẫu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
