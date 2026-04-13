"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  Download,
  RefreshCcw,
  ArrowLeft,
  SwitchCamera,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TwibbonPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // Use a ref so capturePhoto always reads the latest value without stale closure
  const facingModeRef = useRef<"user" | "environment">("user");

  const startCamera = useCallback(
    async (mode: "user" | "environment" = "user") => {
      try {
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((t) => t.stop());
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1080 },
            height: { ideal: 1080 },
          },
        });
        setStream(newStream);
        setFacingMode(mode);
        facingModeRef.current = mode;
        if (videoRef.current) videoRef.current.srcObject = newStream;
        setCameraError(null);
      } catch (err: any) {
        setCameraError(err.message || "Tidak dapat mengakses kamera.");
      }
    },
    [],
  );

  useEffect(() => {
    startCamera("user");
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    const next = facingModeRef.current === "user" ? "environment" : "user";
    startCamera(next);
  };
  // TWIBBON OVERLAY DRAWING (pure canvas, no video reading happens here)
  const drawTwibbon = (
    ctx: CanvasRenderingContext2D,
    S: number,
    logoImg: HTMLImageElement | null,
  ) => {
    // Grid lines
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    const step = S / 8;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, S);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(S, i * step);
      ctx.stroke();
    }
    ctx.restore();

    // Diagonal cross accent
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.lineWidth = 100;
    ctx.strokeStyle = "#0058BE";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(S, S);
    ctx.stroke();
    ctx.strokeStyle = "#B61722";
    ctx.beginPath();
    ctx.moveTo(S, 0);
    ctx.lineTo(0, S);
    ctx.stroke();
    ctx.restore();

    // Corner vignette
    const vig = ctx.createLinearGradient(0, 0, S, S);
    vig.addColorStop(0, "rgba(0,88,190,0.2)");
    vig.addColorStop(0.45, "rgba(0,0,0,0)");
    vig.addColorStop(0.55, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(182,23,34,0.2)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, S, S);

    // Outer gradient border
    const bGrad = ctx.createLinearGradient(0, 0, S, S);
    bGrad.addColorStop(0, "#0058BE");
    bGrad.addColorStop(0.5, "#7B1FA2");
    bGrad.addColorStop(1, "#B61722");
    ctx.strokeStyle = bGrad;
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, S - 16, S - 16);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.45;
    ctx.strokeRect(26, 26, S - 52, S - 52);
    ctx.globalAlpha = 1;

    // TOP BANNER — red, with big logo overflowing downward
    const bannerH = 115;
    const topGrad = ctx.createLinearGradient(0, 0, S, 0);
    topGrad.addColorStop(0, "rgba(182,23,34,0.96)");
    topGrad.addColorStop(1, "rgba(136,14,27,0.93)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, S, bannerH);

    // Logo — large, overflows below the top banner
    if (logoImg && logoImg.naturalWidth > 0) {
      const lw = S * 0.2;
      const lh = (logoImg.naturalHeight / logoImg.naturalWidth) * lw;
      // anchor bottom of logo ~40% below the banner bottom edge
      const ly = bannerH - lh * 0.6;
      ctx.drawImage(logoImg, S / 2 - lw / 2, ly, lw, lh);
    } else {
      // Fallback </> icon + text centered in top banner area
      const cx = S / 2;
      const iy = bannerH * 0.52;
      const bW = 70,
        bH = 38;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - bW * 0.42, iy + bH / 2);
      ctx.lineTo(cx - bW * 0.82, iy);
      ctx.lineTo(cx - bW * 0.42, iy - bH / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + bW * 0.42, iy + bH / 2);
      ctx.lineTo(cx + bW * 0.82, iy);
      ctx.lineTo(cx + bW * 0.42, iy - bH / 2);
      ctx.stroke();
      ctx.strokeStyle = "#FFCDD2";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx + 10, iy + bH / 2 - 2);
      ctx.lineTo(cx - 10, iy - bH / 2 + 2);
      ctx.stroke();
      const fs = Math.round(S * 0.028);
      ctx.font = `bold ${fs}px 'Inter','Segoe UI',Arial,sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Madura", S / 2 - fs * 1.5, bannerH * 0.82);
      ctx.fillStyle = "#FFCDD2";
      ctx.fillText("Dev", S / 2 + fs * 1.08, bannerH * 0.82);
    }

    // Side accent lines
    const sY1 = S * 0.3,
      sY2 = S * 0.54;
    const sx1 = 50,
      sx2 = 62;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "#0058BE";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx1, sY1);
    ctx.lineTo(sx1, sY2);
    ctx.stroke();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#0058BE";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx2, sY1 + 20);
    ctx.lineTo(sx2, sY2 - 20);
    ctx.stroke();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "#B61722";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(S - sx1, sY1);
    ctx.lineTo(S - sx1, sY2);
    ctx.stroke();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#B61722";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(S - sx2, sY1 + 20);
    ctx.lineTo(S - sx2, sY2 - 20);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Mid scan line
    const scanY = S * 0.5;
    const sg = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 35);
    sg.addColorStop(0, "rgba(0,88,190,0)");
    sg.addColorStop(0.5, "rgba(0,88,190,0.13)");
    sg.addColorStop(1, "rgba(0,88,190,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, scanY - 35, S, 70);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "#0058BE";
    ctx.beginPath();
    ctx.moveTo(90, scanY);
    ctx.lineTo(S * 0.27, scanY);
    ctx.stroke();
    ctx.strokeStyle = "#B61722";
    ctx.beginPath();
    ctx.moveTo(S - 90, scanY);
    ctx.lineTo(S * 0.73, scanY);
    ctx.stroke();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(S / 2, scanY, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Corner brackets — anchored just BELOW top banner and ABOVE bottom banner
    const pad = 85,
      brkLen = 140,
      bw = 9;
    const bY1 = bannerH + 28; // top anchor y
    const bY2 = S - bannerH - 28; // bottom anchor y

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = bw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Top-left
    ctx.beginPath();
    ctx.moveTo(pad, bY1 + brkLen);
    ctx.lineTo(pad, bY1);
    ctx.lineTo(pad + brkLen, bY1);
    ctx.stroke();
    drawDot(ctx, pad, bY1, 8, "#0058BE");

    // Top-right
    ctx.beginPath();
    ctx.moveTo(S - pad - brkLen, bY1);
    ctx.lineTo(S - pad, bY1);
    ctx.lineTo(S - pad, bY1 + brkLen);
    ctx.stroke();
    drawDot(ctx, S - pad, bY1, 8, "#0058BE");

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(pad, bY2 - brkLen);
    ctx.lineTo(pad, bY2);
    ctx.lineTo(pad + brkLen, bY2);
    ctx.stroke();
    drawDot(ctx, pad, bY2, 8, "#B61722");

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(S - pad - brkLen, bY2);
    ctx.lineTo(S - pad, bY2);
    ctx.lineTo(S - pad, bY2 - brkLen);
    ctx.stroke();
    drawDot(ctx, S - pad, bY2, 8, "#B61722");

    // BOTTOM BANNER — blue, with LOCAL TECH HUB text
    const botH = 115;
    const botGrad = ctx.createLinearGradient(0, 0, S, 0);
    botGrad.addColorStop(0, "rgba(0,70,200,0.96)");
    botGrad.addColorStop(1, "rgba(21,101,192,0.93)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, S - botH, S, botH);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${Math.round(S * 0.034)}px 'Inter','Segoe UI',Arial,sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("LOCAL TECH HUB", S / 2, S - botH * 0.37);

    // dots beside text
    ctx.globalAlpha = 0.65;
    [
      [S * 0.19, S - botH * 0.43, 5],
      [S * 0.175, S - botH * 0.43, 3.5],
      [S * 0.81, S - botH * 0.43, 5],
      [S * 0.825, S - botH * 0.43, 3.5],
    ].forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  // CAPTURE PHOTO
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) {
      alert("Kamera belum siap, tunggu sebentar lalu coba lagi.");
      return;
    }

    setIsCapturing(true);
    const SIZE = 1080;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;

    // Crop video frame to square
    let sx = 0,
      sy = 0,
      sw = vw,
      sh = vh;
    if (vw > vh) {
      sw = vh;
      sx = (vw - sw) / 2;
    } else {
      sh = vw;
      sy = (vh - sh) / 2;
    }

    // *** Snapshot the live video frame into an offscreen canvas RIGHT NOW ***
    // This must happen BEFORE stream.stop() or the result will be black.
    const snap = document.createElement("canvas");
    snap.width = SIZE;
    snap.height = SIZE;
    const sCtx = snap.getContext("2d")!;
    if (facingModeRef.current === "user") {
      sCtx.translate(SIZE, 0);
      sCtx.scale(-1, 1);
    }
    sCtx.drawImage(video, sx, sy, sw, sh, 0, 0, SIZE, SIZE);

    // Compose: draw snapshot + twibbon overlay onto main canvas
    const compose = (logoImg: HTMLImageElement | null) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(snap, 0, 0); // frozen photo (not live video!)
      drawTwibbon(ctx, SIZE, logoImg);
      setPhotoURL(canvas.toDataURL("image/png", 1.0));
      setIsCapturing(false);
      // Stop camera only after we're done reading from it
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    };

    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/logos/logo_madura_light.png";
    logo.onload = () => compose(logo);
    logo.onerror = () => compose(null);
    // Fallback if logo takes too long
    const fallbackTimer = setTimeout(() => compose(null), 3000);
    logo.onload = (e) => {
      clearTimeout(fallbackTimer);
      compose(logo);
    };
  };

  const retakePhoto = () => {
    setPhotoURL(null);
    startCamera(facingModeRef.current);
  };

  const handleDownload = () => {
    if (!photoURL) return;
    setIsDownloading(true);

    // Menerapkan sedikit delay untuk memberikan feedback visual UI saving
    setTimeout(() => {
      const timestamp = new Date().getTime();
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const filename = `MaduraDev_Twibbon_${timestamp}_${randomSuffix}.png`;
      
      const link = document.createElement("a");
      link.href = photoURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col py-24">
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #0058be 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 w-full flex-grow flex flex-col items-center">
        <div className="w-full flex items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">
              Twibbon
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground font-display tracking-tight mb-2">
            MaduraDev <span className="text-primary italic">Camera</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Tunjukkan semangatmu sebagai bagian dari MaduraDev! Ambil foto dan
            gunakan twibbon eksklusif ini.
          </p>
        </div>

        <div className="w-full aspect-square relative rounded-[2.5rem] overflow-hidden editorial-shadow mb-8 bg-black flex items-center justify-center">
          {cameraError && !photoURL ? (
            <div className="text-center p-6">
              <p className="text-destructive font-bold mb-2">Oops!</p>
              <p className="text-sm text-muted-foreground">{cameraError}</p>
            </div>
          ) : photoURL ? (
            <img
              src={photoURL}
              alt="Twibbon Result"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              <button
                onClick={toggleCamera}
                className="absolute top-4 right-4 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              {/* Preview twibbon overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Gradient border */}
                <div
                  className="absolute inset-0 rounded-[2.5rem]"
                  style={{
                    background:
                      "linear-gradient(135deg,#0058BE,#7B1FA2,#B61722) border-box",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    maskComposite: "exclude",
                    border: "6px solid transparent",
                  }}
                />

                {/* Top banner — red */}
                <div
                  className="absolute top-0 left-0 right-0 h-[11%] rounded-t-[2.5rem]"
                  style={{ background: "rgba(182,23,34,0.9)" }}
                />
                {/* Logo — large, overflows below the top banner */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ top: "1%", width: "25%" }}
                >
                  <img
                    src="/logos/logo_madura_light.png"
                    alt="MaduraDev"
                    className="w-full h-auto drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Corner brackets — just below/above banners */}
                <div
                  className="absolute border-white/90 border-t-[4px] border-l-[4px] w-10 h-10 sm:w-12 sm:h-12"
                  style={{ top: "13%", left: "8%" }}
                />
                <div
                  className="absolute border-white/90 border-t-[4px] border-r-[4px] w-10 h-10 sm:w-12 sm:h-12"
                  style={{ top: "13%", right: "8%" }}
                />
                <div
                  className="absolute border-white/90 border-b-[4px] border-l-[4px] w-10 h-10 sm:w-12 sm:h-12"
                  style={{ bottom: "13%", left: "8%" }}
                />
                <div
                  className="absolute border-white/90 border-b-[4px] border-r-[4px] w-10 h-10 sm:w-12 sm:h-12"
                  style={{ bottom: "13%", right: "8%" }}
                />

                {/* Side accent lines */}
                <div
                  className="absolute left-[4.5%] w-[2px] rounded-full bg-blue-500/70"
                  style={{ top: "30%", height: "24%" }}
                />
                <div
                  className="absolute right-[4.5%] w-[2px] rounded-full bg-red-600/70"
                  style={{ top: "30%", height: "24%" }}
                />

                {/* Bottom banner — blue with LOCAL TECH HUB */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[11%] rounded-b-[2.5rem] flex items-center justify-center"
                  style={{ background: "rgba(0,80,200,0.9)" }}
                >
                  <span className="text-white font-bold text-[9px] sm:text-[11px] tracking-[0.28em] uppercase">
                    LOCAL TECH HUB
                  </span>
                </div>
              </div>
            </>
          )}

          {isCapturing && (
            <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center rounded-[2.5rem]">
              <span className="text-white font-bold text-sm animate-pulse">
                Memproses...
              </span>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4 w-full">
          {!photoURL ? (
            <Button
              onClick={capturePhoto}
              disabled={isCapturing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-16 rounded-2xl font-bold text-lg editorial-shadow transition-all duration-300 flex items-center gap-3 disabled:opacity-60"
            >
              <Camera className="w-6 h-6" />
              {isCapturing ? "Memproses..." : "Ambil Foto"}
            </Button>
          ) : (
            <>
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="w-1/2 h-16 rounded-2xl font-bold border-border text-foreground hover:bg-muted transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Ulangi
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-1/2 h-16 rounded-2xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 editorial-shadow transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Simpan
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//Canvas helpers

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
