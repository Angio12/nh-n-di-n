import React from 'react';
import { Camera, Sparkles, Database, CheckCircle, AlertOctagon, HelpCircle, Layers, ArrowUpRight } from 'lucide-react';
import { ClassificationResult, MeatSample } from '../types';

interface ResultDashboardProps {
  result: ClassificationResult;
  onOpenScanner: () => void;
  onOpenDataset: () => void;
  onSelectPreset: (sample: MeatSample) => void;
  onManualRGBChange: (r: number, g: number, b: number) => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onOpenScanner,
  onOpenDataset,
  onSelectPreset,
}) => {
  const isFresh = result.label === 'xanh lá';
  const hexColor = `#${result.r.toString(16).padStart(2, '0')}${result.g
    .toString(16)
    .padStart(2, '0')}${result.b.toString(16).padStart(2, '0')}`.toUpperCase();

  return (
    <div id="view-result-panel" className="w-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* LEFT COLUMN: Image viewer & ROI */}
      <div className="w-full lg:w-[48%] flex flex-col gap-4">
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-[#9ca3af]">
              Ảnh chụp mẫu & Định vị vùng chỉ thị (ROI)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-950/70 text-blue-400 border border-blue-800/40">
              Mẫu phân tích
            </span>
          </div>

          {/* White background frame for high contrast film observation */}
          <div
            id="image-viewer-container"
            className="relative w-full h-[360px] md:h-[400px] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 shadow-inner group"
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
              className="absolute w-[80px] h-[80px] border-2 border-dashed border-black rounded-full flex items-center justify-center text-black text-[11px] font-bold z-10 pointer-events-none shadow-[0_0_0_9999px_rgba(255,255,255,0.45)]"
              style={{
                top: result.roiCenter ? `${result.roiCenter.y}%` : '50%',
                left: result.roiCenter ? `${result.roiCenter.x}%` : '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="bg-white/85 px-1.5 py-0.5 rounded text-[10px] tracking-wide border border-black/20">
                VÙNG ROI
              </span>
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

          {/* Quick Presets for easy testing without camera */}
          <div className="mt-4 pt-4 border-t border-[#2e2e38]">
            <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-2 font-medium">
              <span>Mẫu kiểm thử nhanh (Không cần mở Camera):</span>
              <button
                onClick={onOpenDataset}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
              >
                <span>Xem tất cả 28 mẫu</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  onSelectPreset({
                    time: '0h',
                    group: 'A',
                    r: 200,
                    g: 176,
                    b: 178,
                    obs: 'hồng nhạt',
                    status: 'tươi',
                    label: 'xanh lá',
                    conclusion: 'THỊT TƯƠI SẠCH – NÊN ĂN NGAY',
                  })
                }
                className="px-2.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c8b0b2]" />
                  <span className="text-xs font-bold text-emerald-400">Mẫu Tươi (0h)</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">RGB: 200, 176, 178</p>
              </button>

              <button
                onClick={() =>
                  onSelectPreset({
                    time: '24h',
                    group: 'B',
                    r: 193,
                    g: 180,
                    b: 176,
                    obs: 'hồng pha xanh',
                    status: 'thối rõ',
                    label: 'đỏ',
                    conclusion: 'KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG',
                  })
                }
                className="px-2.5 py-2 rounded-lg bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c1b4b0]" />
                  <span className="text-xs font-bold text-amber-400">Biến chất (24h)</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">RGB: 193, 180, 176</p>
              </button>

              <button
                onClick={() =>
                  onSelectPreset({
                    time: '60h',
                    group: 'A',
                    r: 171,
                    g: 178,
                    b: 180,
                    obs: 'xanh dương',
                    status: 'thối rõ',
                    label: 'đỏ',
                    conclusion: 'KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG',
                  })
                }
                className="px-2.5 py-2 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#abb2b4]" />
                  <span className="text-xs font-bold text-red-400">Mẫu Hỏng (60h)</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">RGB: 171, 178, 180</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Metrics, Classification, Recommendations */}
      <div className="w-full lg:w-[52%] flex flex-col gap-4">
        {/* Card 1: RGB Metrics */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-[#9ca3af]">
              Thông số giá trị màu trích xuất
            </h2>
            <span className="text-xs text-gray-400 font-mono">Không gian màu sRGB</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Red Card */}
            <div className="p-4 rounded-lg text-center font-bold bg-red-500/15 text-red-400 border border-red-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">R (Red)</div>
              <div className="text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.r}
              </div>
            </div>

            {/* Green Card */}
            <div className="p-4 rounded-lg text-center font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">G (Green)</div>
              <div className="text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.g}
              </div>
            </div>

            {/* Blue Card */}
            <div className="p-4 rounded-lg text-center font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <div className="text-xs tracking-wider uppercase opacity-90">B (Blue)</div>
              <div className="text-3xl font-extrabold mt-1 font-mono tracking-tight">
                {result.b}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Traffic Light Status */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-[#9ca3af]">
              Phân loại mức độ tươi (Thuật toán k-NN)
            </h2>
            <span className="text-xs text-gray-400">Độ tin cậy: {result.confidence}% ({result.freshVotes > result.spoiledVotes ? result.freshVotes : result.spoiledVotes}/3 láng giềng)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Green status lamp */}
            <div
              className={`p-4 rounded-xl text-center font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                isFresh
                  ? 'bg-[#10b981] text-black shadow-[0_0_24px_rgba(16,185,129,0.5)] scale-[1.02] border-2 border-emerald-300'
                  : 'bg-[#10b981]/15 text-emerald-600/50 border border-emerald-900/30 opacity-30 grayscale-[0.5]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm md:text-base">
                <CheckCircle className="w-5 h-5" />
                <span>THỊT TƯƠI SẠCH – NÊN ĂN NGAY</span>
              </div>
              {isFresh && (
                <span className="text-[11px] font-semibold opacity-90">
                  (Chỉ thị duy trì sắc tố Hồng Nhạt tự nhiên)
                </span>
              )}
            </div>

            {/* Red status lamp */}
            <div
              className={`p-4 rounded-xl text-center font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                !isFresh
                  ? 'bg-[#ef4444] text-white shadow-[0_0_24px_rgba(239,68,68,0.5)] scale-[1.02] border-2 border-red-300'
                  : 'bg-[#ef4444]/15 text-red-500/40 border border-red-900/30 opacity-30 grayscale-[0.5]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm md:text-base">
                <AlertOctagon className="w-5 h-5" />
                <span>KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG</span>
              </div>
              {!isFresh && (
                <span className="text-[11px] font-medium opacity-90">
                  (Chỉ thị đã chuyển màu Xanh Dương / Hồng Pha Xanh)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Recommendations & k-NN Neighbors Detail */}
        <div className="card bg-[#1e1e24] border border-[#2e2e38] rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs uppercase font-bold tracking-wider text-[#9ca3af]">
                Khuyến nghị sử dụng & Cơ sở k-NN (k=3)
              </h2>
              <span className="text-[11px] text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Dự đoán AI k-NN
              </span>
            </div>

            <p className="text-sm leading-relaxed text-[#d1d5db] mb-4 bg-black/25 p-3 rounded-lg border border-white/5">
              {isFresh ? (
                <>
                  Thực phẩm đang ở trạng thái <strong className="text-emerald-400">Tươi Tốt</strong>.
                  Màng chỉ thị màu cho thấy nồng độ base bay hơi (TVB-N) còn ở ngưỡng rất thấp an toàn.
                  Đề xuất chế biến ngay hoặc duy trì bảo quản lạnh dưới 4°C trong hộp kín.
                </>
              ) : (
                <>
                  Cảnh báo: Thực phẩm đang ở trạng thái <strong className="text-red-400">Đã Ơi / Bị Hỏng</strong>.
                  Màng chỉ thị màu đã hấp phụ lượng lớn hợp chất bay hơi do vi sinh vật phân giải protein.
                  Tuyệt đối <strong>không sử dụng</strong> làm thực phẩm để tránh ngộ độc.
                </>
              )}
            </p>

            {/* k-NN 3 Nearest Neighbors Table/Cards */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>3 Điểm Láng Giềng Gần Nhất (Euclidean Distance):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.closestNeighbors.map((neighbor, index) => {
                  const s = neighbor.sample;
                  const isNeighborFresh = s.label === 'xanh lá';
                  return (
                    <div
                      key={index}
                      className="bg-black/30 border border-[#2e2e38] rounded-lg p-2 text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-300">
                          #{index + 1} ({s.time} - {s.group})
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isNeighborFresh
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-950 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isNeighborFresh ? 'Tươi' : 'Hỏng'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1 font-mono">
                        Khoảng cách: <strong className="text-blue-300">{neighbor.distance.toFixed(1)}</strong>
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        Màu: {s.obs} ({s.status})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#2e2e38] flex flex-wrap items-center gap-3">
            <button
              id="btn-scan-again"
              onClick={onOpenScanner}
              className="bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/20 flex-1 sm:flex-initial cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Chụp Quét Mẫu Mới</span>
            </button>

            <button
              onClick={onOpenDataset}
              className="bg-[#2e2e38] hover:bg-[#3e3e48] text-gray-200 font-medium px-4 py-3 rounded-lg text-sm transition-colors inline-flex items-center justify-center gap-2 border border-white/10"
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>Tra Cứu Bộ Dữ Liệu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
