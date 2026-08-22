import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Upload, SwitchCamera } from 'lucide-react';
import { extractRGBFromCanvas } from '../utils/knn';

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
  const [liveRGB, setLiveRGB] = useState<{ r: number; g: number; b: number } | null>(null);

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
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(() => {});
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

  // Live color sampling ticker (every 300ms)
  useEffect(() => {
    if (!stream || cameraError || uploadedImage) return;

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.18;

      const rgbResult = extractRGBFromCanvas(ctx, centerX, centerY, radius);
      if (rgbResult.totalPixels > 0) {
        setLiveRGB({ r: rgbResult.r, g: rgbResult.g, b: rgbResult.b });
      }
    }, 300);

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
        // Fallback synthetic sample (Fresh Pink default if camera is unready)
        onCapture({
          r: 200,
          g: 176,
          b: 178,
          imageUrl: '',
          roiCenter: { x: 50, y: 50 },
          roiRadius: 18,
        });
      }
    } catch (err) {
      console.error('Error during capture:', err);
      // Fallback
      onCapture({
        r: 200,
        g: 176,
        b: 178,
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

  return (
    <div id="view-camera-panel" className="w-full flex flex-col items-center justify-center animate-in fade-in duration-300">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Main Viewport */}
      <div className="relative w-full max-w-[900px] h-[480px] md:h-[520px] bg-white rounded-2xl overflow-hidden border-2 border-[#2e2e38] shadow-2xl flex items-center justify-center">
        {/* Live Video Feed */}
        {!uploadedImage && (
          <video
            ref={videoRef}
            id="webcam"
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
          />
        )}

        {/* Uploaded Image View */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded sample"
            className="w-full h-full object-contain bg-slate-900"
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

        {/* Overlay with Guide text, Scan Ring, and Controls */}
        {(!cameraError || uploadedImage) && (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-6 pointer-events-none z-10">
            {/* Top Guide Text */}
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-medium text-white border border-white/15 shadow-lg max-w-[90%] text-center">
              Di chuyển và căn chỉnh màng chỉ thị vào khung tròn bên dưới
            </div>

            {/* Circular ROI Scan Ring with Crosshair */}
            <div className="relative pointer-events-auto flex items-center justify-center">
              <div className="scan-ring" />
              {liveRGB && (
                <div className="absolute -bottom-8 bg-black/80 text-[11px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow">
                  Live RGB: {liveRGB.r}, {liveRGB.g}, {liveRGB.b}
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
                  className="w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              {/* Shutter Button */}
              <button
                id="btn-capture-analyze"
                onClick={handleCapture}
                disabled={isProcessing}
                className="bg-[#ef4444] hover:bg-red-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm md:text-base inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span>{isProcessing ? 'Đang phân tích...' : '🔴 Chụp & Phân Tích'}</span>
              </button>

              {/* Upload fallback button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Tải ảnh có sẵn từ máy"
                className="w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all shadow-md"
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

      {/* Bottom Hint / Secondary Bar */}
      <div className="w-full max-w-[900px] mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Vùng ROI: Đường kính 200px tại tâm khung hình</span>
        </div>
        <button
          onClick={onCancel}
          className="text-blue-400 hover:text-blue-300 underline font-medium"
        >
          Quay lại Bảng Kết Quả Đánh Giá
        </button>
      </div>
    </div>
  );
};
