import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Upload, SwitchCamera, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { extractRGBFromCanvas, classifyRGB } from '../utils/knn';

interface CameraScannerProps {
  onCapture: (rgb: { r: number; g: number; b: number; imageUrl: string; roiCenter: { x: number; y: number }; roiRadius: number }) => void;
  onCancel: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Real-time live RGB state
  const [liveRGB, setLiveRGB] = useState<{ r: number; g: number; b: number } | null>(null);
  const [liveStatus, setLiveStatus] = useState<'fresh' | 'spoiled' | 'out_of_range' | null>(null);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setUploadedImage(null);

    // Stop old stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ WebRTC Camera API');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5');
        video.muted = true;
        video.playsInline = true;
        video.srcObject = newStream;
        await video.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Không thể bật webcam:', err);
      let message = 'Không thể truy cập camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Bạn đã chặn quyền truy cập Camera. Vui lòng cấp quyền trong cài đặt trình duyệt hoặc tải ảnh lên.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Không tìm thấy thiết bị Camera trên máy này.';
      } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        message = 'Camera yêu cầu kết nối bảo mật HTTPS hoặc localhost.';
      }
      setCameraError(message);
    }
  }, [facingMode]);

  // Clean up on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Real-time continuous live RGB sampling (every 100ms)
  useEffect(() => {
    if ((!stream && !uploadedImage) || cameraError) return;

    const interval = setInterval(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      if (uploadedImage) {
        // Sample from uploaded image already processed or let it remain
        return;
      }

      if (videoRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.18;

        const rgbResult = extractRGBFromCanvas(ctx, centerX, centerY, radius);
        if (rgbResult.totalPixels > 0) {
          setLiveRGB({ r: rgbResult.r, g: rgbResult.g, b: rgbResult.b });

          // Live classification evaluation
          const evaluation = classifyRGB(rgbResult.r, rgbResult.g, rgbResult.b, 3);
          if (evaluation.isOutOfRange || evaluation.label === 'ngoài vùng') {
            setLiveStatus('out_of_range');
          } else if (evaluation.label === 'xanh lá') {
            setLiveStatus('fresh');
          } else {
            setLiveStatus('spoiled');
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [stream, cameraError, uploadedImage]);

  // Handle capture action
  const handleCapture = () => {
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        throw new Error('Không tạo được ngữ cảnh Canvas 2D');
      }

      if (uploadedImage) {
        // Sample from uploaded image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.18;

          const rgb = extractRGBFromCanvas(ctx, centerX, centerY, radius);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

          onCapture({
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            imageUrl: dataUrl,
            roiCenter: { x: 50, y: 50 },
            roiRadius: 18,
          });
        };
        img.src = uploadedImage;
        return;
      }

      if (videoRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.18;

        const rgb = extractRGBFromCanvas(ctx, centerX, centerY, radius);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        // Stop camera stream before switching
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        onCapture({
          r: rgb.r,
          g: rgb.g,
          b: rgb.b,
          imageUrl: dataUrl,
          roiCenter: { x: 50, y: 50 },
          roiRadius: 18,
        });
      } else {
        // Fallback synthetic sample
        onCapture({
          r: liveRGB?.r ?? 200,
          g: liveRGB?.g ?? 176,
          b: liveRGB?.b ?? 178,
          imageUrl: '',
          roiCenter: { x: 50, y: 50 },
          roiRadius: 18,
        });
      }
    } catch (err) {
      console.error('Error during capture:', err);
      onCapture({
        r: liveRGB?.r ?? 200,
        g: liveRGB?.g ?? 176,
        b: liveRGB?.b ?? 178,
        imageUrl: '',
        roiCenter: { x: 50, y: 50 },
        roiRadius: 18,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle image upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);
      setCameraError(null);

      // Analyze uploaded image immediately
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.18;

          const rgb = extractRGBFromCanvas(ctx, centerX, centerY, radius);
          setLiveRGB({ r: rgb.r, g: rgb.g, b: rgb.b });

          const evaluation = classifyRGB(rgb.r, rgb.g, rgb.b, 3);
          if (evaluation.isOutOfRange || evaluation.label === 'ngoài vùng') {
            setLiveStatus('out_of_range');
          } else if (evaluation.label === 'xanh lá') {
            setLiveStatus('fresh');
          } else {
            setLiveStatus('spoiled');
          }
        }
      };
      img.src = dataUrl;

      // Stop camera if running
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Switch facing mode
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Dynamic Ring border style based on live evaluation
  const getRingColorClasses = () => {
    if (!liveStatus) return 'border-emerald-500 text-emerald-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]';
    if (liveStatus === 'fresh') return 'border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.7),0_0_0_9999px_rgba(0,0,0,0.55)]';
    if (liveStatus === 'spoiled') return 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7),0_0_0_9999px_rgba(0,0,0,0.55)]';
    return 'border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.7),0_0_0_9999px_rgba(0,0,0,0.55)]';
  };

  return (
    <div id="view-camera-panel" className="w-full flex flex-col items-center justify-center animate-in fade-in duration-300">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Main Viewport */}
      <div className="relative w-full max-w-[900px] h-[380px] sm:h-[460px] md:h-[530px] max-h-[72vh] bg-black rounded-2xl overflow-hidden border-2 border-[#2e2e38] shadow-2xl flex items-center justify-center">
        {/* Live Video Feed */}
        {!uploadedImage && (
          <video
            ref={videoRef}
            id="webcam"
            autoPlay
            playsInline
            muted
            controls={false}
            disablePictureInPicture
            className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
          />
        )}

        {/* Uploaded Image View */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded sample"
            className="w-full h-full object-contain bg-slate-950"
          />
        )}

        {/* Camera Fallback UI if access fails */}
        {cameraError && !uploadedImage && (
          <div id="camera-fallback" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#18181b] text-gray-200">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">
              Không thể khởi chạy trực tiếp Camera
            </h3>
            <p className="text-xs md:text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
              {cameraError}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg text-xs md:text-sm inline-flex items-center gap-2 shadow transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Tải ảnh màng chỉ thị lên</span>
              </button>

              <button
                onClick={startCamera}
                className="bg-[#2e2e38] hover:bg-[#3e3e48] text-gray-300 font-medium px-4 py-2.5 rounded-lg text-xs md:text-sm inline-flex items-center gap-2 border border-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Thử kết nối lại Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Overlay with Guide text, Scan Ring, Realtime RGB, and Controls */}
        {(!cameraError || uploadedImage) && (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-4 sm:p-6 pointer-events-none z-10">
            {/* Top Real-time Status Badge */}
            <div className="pointer-events-auto flex flex-col items-center gap-1.5 max-w-[95%]">
              <div className="bg-black/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/15 shadow-lg flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>Tự động quét màu ROI theo thời gian thực</span>
              </div>

              {/* Live Status Pill */}
              {liveRGB && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all duration-200 ${
                    liveStatus === 'fresh'
                      ? 'bg-emerald-500/90 text-black border border-emerald-300'
                      : liveStatus === 'spoiled'
                      ? 'bg-red-500/90 text-white border border-red-300'
                      : 'bg-amber-500/90 text-black border border-amber-300'
                  }`}
                >
                  {liveStatus === 'fresh' && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>THỊT TƯƠI SẠCH</span>
                    </>
                  )}
                  {liveStatus === 'spoiled' && (
                    <>
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>THỊT ĐÃ ƠI / HỎNG</span>
                    </>
                  )}
                  {liveStatus === 'out_of_range' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>NGOÀI VÙNG DỮ LIỆU</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Circular ROI Scan Ring with Crosshair and Live RGB readout */}
            <div className="relative pointer-events-auto flex flex-col items-center justify-center">
              <div
                className={`w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] border-[3px] border-dashed rounded-full relative transition-all duration-300 ${getRingColorClasses()}`}
              >
                {/* Center crosshair */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-light leading-none select-none">
                  +
                </span>
              </div>

              {/* Live RGB values pill attached to ROI */}
              {liveRGB && (
                <div className="mt-3 bg-black/90 text-xs font-mono px-3 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: `rgb(${liveRGB.r}, ${liveRGB.g}, ${liveRGB.b})` }}
                  />
                  <span className="text-red-400 font-bold">R:{liveRGB.r}</span>
                  <span className="text-emerald-400 font-bold">G:{liveRGB.g}</span>
                  <span className="text-blue-400 font-bold">B:{liveRGB.b}</span>
                </div>
              )}
            </div>

            {/* Bottom Shutter and Helper Controls */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
              {/* Switch camera button */}
              {!uploadedImage && !cameraError && (
                <button
                  onClick={toggleFacingMode}
                  title="Đổi camera trước/sau"
                  className="w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              {/* Shutter Button to confirm / view full report */}
              <button
                id="btn-capture-analyze"
                onClick={handleCapture}
                disabled={isProcessing}
                className="bg-[#ef4444] hover:bg-red-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm md:text-base inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span>{isProcessing ? 'Đang xuất báo cáo...' : '📸 Lưu & Xem Báo Cáo'}</span>
              </button>

              {/* Upload fallback button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Tải ảnh có sẵn từ máy"
                className="w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Bottom Hint */}
      <div className="w-full max-w-[900px] mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Vùng ROI tự động đọc giá trị RGB trung bình liên tục 10 lần/giây</span>
        </div>
        <button
          onClick={onCancel}
          className="text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
        >
          Quay lại Bảng Kết Quả Đánh Giá
        </button>
      </div>
    </div>
  );
};

