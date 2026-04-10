"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, Download, RefreshCcw, ArrowLeft, SwitchCamera } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TwibbonPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async (mode: "user" | "environment" = facingMode) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1080 } },
      });
      setStream(newStream);
      setFacingMode(mode);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraError(null);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError(err.message || "Tidak dapat mengakses kamera.");
    }
  }, [facingMode]);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        });
        currentStream = newStream;
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setCameraError(null);
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setCameraError(err.message || "Tidak dapat mengakses kamera.");
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    startCamera(newMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // We want a square twibbon. Let's make it 1080x1080
    const twibbonSize = 1080;
    canvas.width = twibbonSize;
    canvas.height = twibbonSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const videoAspectRatio = video.videoWidth / video.videoHeight;
    let sWidth = video.videoWidth;
    let sHeight = video.videoHeight;
    let sx = 0;
    let sy = 0;

    if (videoAspectRatio > 1) {
      // Landscape video: crop sides
      sWidth = video.videoHeight;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      // Portrait video: crop top/bottom
      sHeight = video.videoWidth;
      sy = (video.videoHeight - sHeight) / 2;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, twibbonSize, twibbonSize);

    // 2. Draw Twibbon Frame Overlay (Tech Hub Style)

    // Gradient Outer Border
    const borderGradient = ctx.createLinearGradient(0, 0, twibbonSize, twibbonSize);
    borderGradient.addColorStop(0, "rgba(0, 88, 190, 0.4)"); // Primary
    borderGradient.addColorStop(1, "rgba(182, 23, 34, 0.4)"); // Secondary
    ctx.lineWidth = 30;
    ctx.strokeStyle = borderGradient;

    // Use roundRect if available for modern soft borders
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(40, 40, twibbonSize - 80, twibbonSize - 80, 80);
    } else {
      ctx.rect(40, 40, twibbonSize - 80, twibbonSize - 80);
    }
    ctx.stroke();

    // Corner Brackets (Futuristic look)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 15;
    const padding = 80;
    const bracketLen = 140;

    // Top Left
    ctx.beginPath(); ctx.moveTo(padding, padding + bracketLen); ctx.lineTo(padding, padding); ctx.lineTo(padding + bracketLen, padding); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(twibbonSize - padding - bracketLen, padding); ctx.lineTo(twibbonSize - padding, padding); ctx.lineTo(twibbonSize - padding, padding + bracketLen); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(padding, twibbonSize - padding - bracketLen); ctx.lineTo(padding, twibbonSize - padding); ctx.lineTo(padding + bracketLen, twibbonSize - padding); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(twibbonSize - padding - bracketLen, twibbonSize - padding); ctx.lineTo(twibbonSize - padding, twibbonSize - padding); ctx.lineTo(twibbonSize - padding, twibbonSize - padding - bracketLen); ctx.stroke();

    // Top Text (LOCAL TECH HUB)
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "bold 40px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LOCAL TECH HUB", twibbonSize / 2, padding + 80);

    // 3. Draw Logo 
    const logoImg = new Image();
    logoImg.src = "/logos/logo_madura_light.png";
    logoImg.onload = () => {
      // Draw logo at bottom center, much smaller now (200px instead of 350px)
      const logoWidth = 200;
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      ctx.drawImage(logoImg, (twibbonSize - logoWidth) / 2, twibbonSize - logoHeight - padding - 40, logoWidth, logoHeight);

      // Save data URL
      setPhotoURL(canvas.toDataURL("image/png", 1.0));
      
      // Stop camera to save battery
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };

    // Fallback if image fails to load
    logoImg.onerror = () => {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MADURADEV", twibbonSize / 2, twibbonSize - padding - 60);
      setPhotoURL(canvas.toDataURL("image/png", 1.0));
      
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  };

  const retakePhoto = () => {
    setPhotoURL(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col py-24">
      {/* Dot Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #0058be 1px, transparent 0)",
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
            Tunjukkan semangantmu sebagai bagian dari MaduraDev! Ambil foto dan gunakan twibbon eksklusif ini.
          </p>
        </div>

        {/* Camera/Result Canvas Area */}
        <div className="w-full aspect-square relative rounded-[2.5rem] overflow-hidden editorial-shadow mb-8 bg-black/10 flex items-center justify-center">
          {cameraError && !photoURL ? (
            <div className="text-center p-6">
              <p className="text-destructive font-bold mb-2">Oops!</p>
              <p className="text-sm text-muted-foreground">{cameraError}</p>
            </div>
          ) : photoURL ? (
            // Result View
            <img src={photoURL} alt="Twibbon Result" className="w-full h-full object-cover" />
          ) : (
            // Camera View
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />
              {/* Switch Camera Button */}
              <button
                onClick={toggleCamera}
                className="absolute top-4 right-4 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
                title="Ganti Kamera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              {/* Twibbon DOM Overlay (matches the canvas drawing) */}
              <div className="absolute inset-0 pointer-events-none p-4">
                {/* Modern Soft Border */}
                <div className="absolute inset-4 rounded-[2rem] border-8 border-primary/30 mix-blend-screen" />

                {/* Tech Hub Corner Brackets */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-[5px] border-l-[5px] border-white/90 rounded-tl-2xl mix-blend-overlay" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-[5px] border-r-[5px] border-white/90 rounded-tr-2xl mix-blend-overlay" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-[5px] border-l-[5px] border-white/90 rounded-bl-2xl mix-blend-overlay" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-[5px] border-r-[5px] border-white/90 rounded-br-2xl mix-blend-overlay" />

                {/* Top Text Overlay */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 text-white font-bold tracking-[0.25em] text-xs sm:text-sm drop-shadow-md whitespace-nowrap">
                  LOCAL TECH HUB
                </div>

                {/* Logo (Shrunk!) */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 sm:w-28 drop-shadow-2xl">
                  <img src="/logos/logo_madura_light.png" alt="MaduraDev" className="w-full h-auto opacity-100" />
                </div>
              </div>
            </>
          )}

          {/* Hidden Canvas for Drawing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          {!photoURL ? (
            <Button
              onClick={capturePhoto}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-16 rounded-2xl font-bold text-lg editorial-shadow transition-all duration-300 flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Ambil Foto
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
                asChild
                className="w-1/2 h-16 rounded-2xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 editorial-shadow transition-all duration-300 flex items-center gap-2"
              >
                <a href={photoURL} download="MaduraDev_Twibbon.png">
                  <Download className="w-5 h-5" />
                  Simpan
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
