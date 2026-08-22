import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { MEAT_DATASET } from '../data/dataset';
import { MeatSample } from '../types';

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: MeatSample) => void;
}

export const DatasetModal: React.FC<DatasetModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [filterExperiment, setFilterExperiment] = useState<'all' | '1' | '2'>('all');
  const [filterLabel, setFilterLabel] = useState<'all' | 'xanh lá' | 'đỏ'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredData = MEAT_DATASET.filter((item) => {
    if (filterExperiment !== 'all' && item.experiment?.toString() !== filterExperiment) {
      return false;
    }
    if (filterLabel !== 'all' && item.label !== filterLabel) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.time.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.obs.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e1e24] border border-[#2e2e38] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2e2e38] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Bộ Dữ Liệu Mẫu Thực Nghiệm
              </h2>
              <p className="text-xs text-[#9ca3af]">
                Trường THPT Nguyễn Khuyến • 28 mẫu thực nghiệm (Nhóm A & B)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#2e2e38] bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Đợt thử nghiệm:</span>
            {(['all', '1', '2'] as const).map((exp) => (
              <button
                key={exp}
                onClick={() => setFilterExperiment(exp)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterExperiment === exp
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-[#2e2e38] text-gray-300 hover:bg-[#3e3e48]'
                }`}
              >
                {exp === 'all' ? 'Tất cả' : `Lần ${exp}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Phân loại:</span>
            {(['all', 'xanh lá', 'đỏ'] as const).map((lbl) => (
              <button
                key={lbl}
                onClick={() => setFilterLabel(lbl)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterLabel === lbl
                    ? lbl === 'xanh lá'
                      ? 'bg-emerald-600 text-white font-medium'
                      : lbl === 'đỏ'
                      ? 'bg-red-600 text-white font-medium'
                      : 'bg-blue-600 text-white font-medium'
                    : 'bg-[#2e2e38] text-gray-300 hover:bg-[#3e3e48]'
                }`}
              >
                {lbl === 'all' ? 'Tất cả' : lbl === 'xanh lá' ? 'Tươi (Xanh)' : 'Hỏng (Đỏ)'}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo giờ, nhóm, cảm quan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#121214] border border-[#2e2e38] rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 bg-black/40 border-b border-[#2e2e38] uppercase">
                <tr>
                  <th className="p-2.5">Lần</th>
                  <th className="p-2.5">Nhóm</th>
                  <th className="p-2.5">Thời gian</th>
                  <th className="p-2.5">Màu RGB</th>
                  <th className="p-2.5">Màu chỉ thị</th>
                  <th className="p-2.5">Trạng thái thịt</th>
                  <th className="p-2.5">Đánh giá</th>
                  <th className="p-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e38]/50">
                {filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectSample(item);
                      onClose();
                    }}
                  >
                    <td className="p-2.5 font-medium text-gray-300">Lần {item.experiment}</td>
                    <td className="p-2.5 font-semibold text-blue-400">Nhóm {item.group}</td>
                    <td className="p-2.5 font-mono text-gray-200">{item.time}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})` }}
                        />
                        <span className="font-mono text-gray-300">
                          {item.r}, {item.g}, {item.b}
                        </span>
                      </div>
                    </td>
                    <td className="p-2.5 text-gray-300 capitalize">{item.obs}</td>
                    <td className="p-2.5 text-gray-400">{item.status}</td>
                    <td className="p-2.5">
                      {item.label === 'xanh lá' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Tươi sạch
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3 h-3" /> Hỏng/Ơi
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40 hover:bg-blue-600 hover:text-white text-[11px] font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSample(item);
                          onClose();
                        }}
                      >
                        Thử mẫu <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#2e2e38] bg-black/40 flex items-center justify-between text-xs text-gray-400">
          <span>Hiển thị {filteredData.length} / {MEAT_DATASET.length} mẫu thực nghiệm</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2e2e38] text-white hover:bg-[#3e3e48] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
