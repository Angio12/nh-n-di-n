import React from 'react';
import { Camera, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { ClassificationResult } from '../types';

interface ResultDashboardProps {
  result: ClassificationResult;
  onOpenScanner: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onOpenScanner,
}) => {
  const isOutOfRange = result.isOutOfRange || result.label === 'ngoài vùng';
  const isFresh = result.label === 'xanh lá';
  const hexColor = `#${result.r.toString(16).padStart(2, '0')}${result.g
    .toString(16)
    .padStart(2, '0')}${result.b.toString(16).padStart(2, '0')}`.toUpperCase();

  return (
    <div id="view-result-panel" className="view-panel active w-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* LEFT COLUMN: Image viewer & ROI */}
      <div className="left-col w-full lg:w-[48%] flex flex-col gap-4">
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg flex flex-col">
          <div className="card-title text-xs uppercase font-bold tracking-wider text-[#9ca3af] mb-3">
            Ảnh chụp mẫu & Định vị vùng chỉ thị (ROI)
          </div>

          {/* White background frame for high contrast film observation */}
          <div
            id="image-viewer-container"
            className="image-viewer relative w-full h-[360px] md:h-[400px] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 shadow-inner group"
          >
            {result.imageUrl ? (
              <img
                src={result.imageUrl}
                alt="Captured meat indicator membrane"
                className="w-full h-full object-cover"
              />
            ) : (
              /* Synthetic/Simulated Indicator Film Background */
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 relative"
                style={{
                  background: `radial-gradient(circle at center, rgb(${result.r}, ${result.g}, ${result.b}) 0%, #f1f5f9 70%)`
                }}
              >
                {/* Meat dish illustration / indicator backdrop */}
                <div className="w-64 h-64 rounded-full border-4 border-dashed border-gray-400/40 flex items-center justify-center shadow-lg bg-white/70 backdrop-blur-xs">
                  <div
                    className="w-40 h-40 rounded-full shadow-md flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `rgb(${result.r}, ${result.g}, ${result.b})` }}
                  >
                    <span className="text-xs font-bold text-gray-800 bg-white/80 px-2 py-0.5 rounded shadow">
                      Màng chỉ thị màu
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Circular ROI Box overlay */}
            <div
              className="roi-box absolute w-[70px] h-[70px] border-2 border-dashed border-black rounded-full flex items-center justify-center text-black text-[12px] font-bold z-10 pointer-events-none shadow-[0_0_0_9999px_rgba(255,255,255,0.45)]"
              style={{
                top: result.roiCenter ? `${result.roiCenter.y}%` : '40%',
                left: result.roiCenter ? `${result.roiCenter.x}%` : '45%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              VÙNG ROI
            </div>

            {/* Extracted Color Badge */}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2.5 z-20">
              <div
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: `rgb(${result.r}, ${result.g}, ${result.b})` }}
              />
              <span className="text-xs font-mono text-white font-medium">
                RGB: ({result.r}, {result.g}, {result.b}) • {hexColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Metrics, Classification, Recommendations */}
      <div className="right-col w-full lg:w-[52%] flex flex-col gap-4">
        {/* Card 1: RGB Metrics */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg">
          <div className="card-title text-xs uppercase font-bold tracking-wider text-[#9ca3af] mb-3">
            Thông số giá trị màu trích xuất
          </div>

          <div className="rgb-grid grid grid-cols-3 gap-3">
            {/* Red Card */}
            <div className="rgb-card rgb-r p-4 rounded-lg text-center font-bold bg-red-500/15 text-red-400 border border-red-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">R (Red)</div>
              <div className="rgb-val text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.r}
              </div>
            </div>

            {/* Green Card */}
            <div className="rgb-card rgb-g p-4 rounded-lg text-center font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">G (Green)</div>
              <div className="rgb-val text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.g}
              </div>
            </div>

            {/* Blue Card */}
            <div className="rgb-card rgb-b p-4 rounded-lg text-center font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">B (Blue)</div>
              <div className="rgb-val text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.b}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Traffic Light Status */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg">
          <div className="card-title text-xs uppercase font-bold tracking-wider text-[#9ca3af] mb-3">
            Phân loại mức độ tươi
          </div>

          {isOutOfRange ? (
            /* Out of Dataset Range State */
            <div className="p-4 rounded-xl text-center font-bold bg-amber-500/20 text-amber-300 border-2 border-amber-500/50 shadow-[0_0_24px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              <span className="text-base md:text-lg">NẰM NGOÀI VÙNG DỮ LIỆU</span>
            </div>
          ) : (
            <div className="status-container grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Green status lamp */}
              <div
                className={`status-item st-green p-4 rounded-xl text-center font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                  isFresh
                    ? 'active bg-[#10b981] text-black shadow-[0_0_24px_rgba(16,185,129,0.5)] scale-[1.02] border-2 border-emerald-300'
                    : 'bg-[#10b981]/15 text-emerald-600/50 border border-emerald-900/30 opacity-25 grayscale-[0.5]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm md:text-base">
                  <CheckCircle className="w-5 h-5" />
                  <span>THỊT TƯƠI SẠCH – NÊN ĂN NGAY</span>
                </div>
              </div>

              {/* Red status lamp */}
              <div
                className={`status-item st-red p-4 rounded-xl text-center font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                  !isFresh
                    ? 'active bg-[#ef4444] text-white shadow-[0_0_24px_rgba(239,68,68,0.5)] scale-[1.02] border-2 border-red-300'
                    : 'bg-[#ef4444]/15 text-red-500/40 border border-red-900/30 opacity-25 grayscale-[0.5]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm md:text-base">
                  <AlertOctagon className="w-5 h-5" />
                  <span>KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Recommendations */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <div className="card-title text-xs uppercase font-bold tracking-wider text-[#9ca3af] mb-3">
              Khuyến nghị sử dụng
            </div>

            <p className="text-sm md:text-[15px] leading-relaxed text-[#d1d5db] mb-4">
              {isOutOfRange ? (
                <>
                  Màu sắc trích xuất tại vùng ROI <strong className="text-amber-400">nằm ngoài vùng dữ liệu mẫu</strong> của màng chỉ thị màu. Vui lòng căn chỉnh lại vùng tâm chỉ thị màu vào đúng hồng tâm camera hoặc kiểm tra lại điều kiện ánh sáng.
                </>
              ) : isFresh ? (
                <>
                  Thực phẩm đang ở trạng thái <strong className="text-emerald-400">Tươi Tốt</strong>. Màng chỉ thị màu hoạt động ổn định. Đề xuất chế biến ngay hoặc duy trì bảo quản lạnh dưới 4°C.
                </>
              ) : (
                <>
                  Thực phẩm đang ở trạng thái <strong className="text-red-400">Đã Ơi / Bị Hỏng</strong>. Màng chỉ thị màu đã đổi màu cảnh báo chất lượng không đảm bảo. Tuyệt đối <strong>không sử dụng</strong> làm thực phẩm.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#2e2e38] flex flex-wrap items-center gap-3">
            <button
              id="btn-scan-again"
              onClick={onOpenScanner}
              className="action-btn bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/20 flex-1 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Chụp Quét Mẫu Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
