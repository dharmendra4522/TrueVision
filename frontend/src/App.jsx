import { useState, useRef, useEffect } from 'react';
import Hologram from './components/Hologram';

// --- Icons ---
const EyeIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgba(0,200,255,0.8)]">
    <ellipse cx="32" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="3" fill="currentColor" />
    <path d="M32 12V8M32 56V52M52 32H56M8 32H12M12 18L10 16M52 46L54 48M52 18L54 16M12 46L10 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const TerminalLogs = ({ isProcessing, imagePreview }) => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    if (!isProcessing) {
      setLogs([]);
      return;
    }
    
    let isCancelled = false;
    
    const runSequence = async () => {
      let imgW = 896, imgH = 1152;
      if (imagePreview) {
        const img = new window.Image();
        img.src = imagePreview;
        await new Promise(r => {
          img.onload = () => {
            imgW = img.width;
            imgH = img.height;
            r();
          };
          img.onerror = r;
        });
      }
      
      if (isCancelled) return;
      
      const sequence = [
        { text: "INFO:     Application startup complete.", delay: 300 },
        { text: `Original image size: (${imgW}, ${imgH})`, delay: 800 },
        { text: `Resizing to: (260, 260)`, delay: 600 },
        { text: `Input array shape: (1, 260, 260, 3)`, delay: 500 },
        { text: `1/1 ━━━━━━━━━━━━━━━━━━━━ 2s 2s/step`, delay: 1200 }
      ];

      for (let i = 0; i < sequence.length; i++) {
        await new Promise(r => setTimeout(r, sequence[i].delay));
        if (isCancelled) return;
        setLogs(prev => [...prev, sequence[i].text]);
      }
    };
    
    runSequence();
    
    return () => {
      isCancelled = true;
    };
  }, [isProcessing, imagePreview]);

  if (!isProcessing) return null;

  return (
    <div className="w-full mt-4 bg-[#050810] rounded-xl p-4 font-mono-space text-[0.65rem] sm:text-xs text-green-400 text-left border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_15px_rgba(0,200,255,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-white/20 text-[0.55rem] tracking-widest uppercase ml-2">Backend Process</span>
      </div>
      <div className="flex flex-col space-y-1.5 h-[100px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ animation: "fadeIn 0.3s forwards" }}>
            <span className="text-cyan-500/70 mr-2">root@backend:~#</span>
            <span className="text-white/80">{log}</span>
          </div>
        ))}
        {logs.length < 5 && (
          <div className="animate-pulse">
             <span className="text-cyan-500/70 mr-2">root@backend:~#</span>
             <span className="text-white/80">_</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TypewriterText = ({ text, delay = 20 }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, delay);
    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export default function App() {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanningText, setScanningText] = useState('SCANNING...');
  const [showTeam, setShowTeam] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);
  const resultRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 50;
    let mouse = { x: null, y: null };

    const handleWindowMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
      
      particles.forEach(p => {
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
          }
        }
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const texts = ['SCANNING PIXELS...', 'NEURAL ANALYSIS...', 'PATTERN MATCHING...', 'EVALUATING ARTIFACTS...'];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setScanningText(texts[i]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.');
      return;
    }
    
    setImage({ 
      file: file,           
      preview: URL.createObjectURL(file), 
      name: file.name, 
      size: file.size 
    });
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", image.file);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setResult({
        verdict: data.verdict,
        confidence: data.confidence,
        reasoning: data.reasoning,
        indicators: data.indicators
      });

    } catch (err) {
      setError("Unable to connect to the API. Please ensure the backend server is running.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setImage(null);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen relative flex flex-col items-center selection:bg-cyan-500/30 selection:text-cyan-400 ${loaded ? 'loaded' : ''}`}>
      {/* Background Layers */}
      <div className="space-bg animate-on-load anim-step-1" />
      <div className="grid-overlay animate-on-load anim-step-1" />
      <div className="vignette animate-on-load anim-step-1" />
      <div className="orb orb-1 animate-on-load anim-step-1" />
      <div className="orb orb-2 animate-on-load anim-step-1" />
      <div className="orb orb-3 animate-on-load anim-step-1" />
      <div className="scanline" />

      {/* 3D Real Model Layer */}
      <Hologram />

      {/* Background Particles Canvas (Optional) */}
      <canvas id="bg-canvas" className="fixed inset-0 z-[-1] opacity-30" />

      {/* TEAM Button (Top Right) */}
      <button 
        onClick={() => setShowTeam(true)}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 font-orbitron text-[0.65rem] tracking-[0.2em] bg-white/5 border border-cyan-500/30 rounded-lg px-[14px] py-2 text-cyan-400/80 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] transition-all duration-300 animate-on-load anim-step-8"
      >
        <span>👥</span> TEAM
      </button>

      {/* TEAM Modal */}
      {showTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setShowTeam(false)} />
          <div className="relative glass-card w-full max-w-[480px] max-h-[85vh] overflow-y-auto p-7 rounded-[20px] shadow-[0_0_80px_rgba(0,200,255,0.1),0_32px_80px_rgba(0,0,0,0.8)] border-cyan-500/20 bg-[#080a23]/95 modal-animate">
            {/* Close Button */}
            <button 
              onClick={() => setShowTeam(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-white/5 border border-white/10 rounded-md text-white/50 hover:text-white hover:border-white/30 transition-all font-sans text-sm"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="section-label mb-1 text-[0.6rem] tracking-[0.35em]">PROJECT TEAM</div>
            <h2 className="font-orbitron font-bold text-base md:text-xl text-white mt-1 leading-tight">
              TrueVision – AI Sees What We Cannot
            </h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded font-mono-space text-[0.65rem] text-cyan-400/80">
                ID: 22-26/IT/G23
              </span>
              <p className="font-sans text-[0.75rem] text-white/40 italic">AKGEC, Ghaziabad</p>
            </div>

            <div className="h-[1px] w-full bg-white/[0.06] my-5" />

            {/* Team Members */}
            <div className="section-label mb-3 text-[0.6rem] tracking-[0.3em]">TEAM MEMBERS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { name: "Anchal Chauhan", id: "2200270130018" },
                { name: "Anshika Goel", id: "2100270130020" },
                { name: "Atul Shukla", id: "2200270130040" },
                { name: "Dharmendra Vishvkarma", id: "2300270139006" }
              ].map((member, i) => (
                <div key={i} className="bg-cyan-500/[0.04] border border-cyan-500/10 rounded-xl p-3 px-4 flex flex-col">
                  <span className="font-sans text-[0.85rem] font-semibold text-white/85 flex items-center gap-2">
                    <span className="text-[0.4rem] text-cyan-400">●</span>
                    {member.name}
                  </span>
                  <span className="font-mono-space text-[0.65rem] text-cyan-400/55 mt-1">{member.id}</span>
                </div>
              ))}
            </div>

            <div className="h-[1px] w-full bg-white/[0.06] my-5" />

            {/* Guidance */}
            <div className="flex flex-col items-center">
              <span className="font-orbitron text-[0.58rem] tracking-[0.3em] text-cyan-500/40 uppercase">
                UNDER THE GUIDANCE OF
              </span>
              <h4 className="font-orbitron text-lg font-bold text-white text-center mt-2 drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]">
                Dr. Sarvachan Verma
              </h4>
              <p className="font-sans text-[0.75rem] text-white/40 text-center mt-1">Assistant Professor</p>
              <p className="font-sans text-[0.75rem] text-white/40 text-center">Dept. of Information Technology</p>
              <p className="font-sans text-[0.7rem] text-cyan-500/40 text-center mt-1 uppercase tracking-tight">
                Ajay Kumar Garg Engineering College
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-full sm:max-w-[480px] md:max-w-2xl px-4 sm:px-6 md:px-10 flex flex-col items-center py-8 md:py-16">
        {/* Header */}
        <header className="flex flex-col items-center mb-10 md:mb-16 w-full">
          <h1 className="font-orbitron text-[clamp(2rem,8vw,5rem)] font-black text-white tracking-[clamp(0.1em,2vw,0.3em)] text-center drop-shadow-[0_0_30px_rgba(0,200,255,0.4)] animate-on-load anim-step-2">
            TRUEVISION
          </h1>
          <p className="mt-4 md:mt-6 font-mono-space text-[clamp(0.55rem,2vw,0.75rem)] text-[rgba(180,200,255,0.7)] tracking-[clamp(0.1em,1.5vw,0.4em)] text-center uppercase leading-relaxed whitespace-normal break-words max-w-full animate-on-load anim-step-3">
            AI-Powered Deepfake Detection System
          </p>
          <div className="mt-6 flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 animate-on-load anim-step-4">
            <div className="w-2 h-2 rounded-full bg-brand-cyan blinking-dot shadow-[0_0_5px_#00F5FF]" />
            <span className="text-[10px] font-mono-space text-slate-400 uppercase tracking-tighter">Powered by TruVision AI</span>
          </div>
        </header>

        {/* Upload Zone */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`group tech-border animate-on-load anim-step-5 relative w-full min-h-[clamp(220px,30vh,300px)] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
            image ? 'bg-white/5 border-cyan-500/30' : 'bg-white/[0.03] border-white/10'
          } hover:border-cyan-500/60 backdrop-blur-[20px] mb-8 md:mb-10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
        >
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          
          {!image ? (
            <div className="flex flex-col items-center gap-6 group-hover:scale-105 transition-all duration-500 px-4 text-center">
              <div className="scale-[clamp(0.75,2vw,1)] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]">
                <EyeIcon />
              </div>
              <div>
                <p className="font-orbitron text-[clamp(0.7rem,3vw,0.9rem)] text-cyan-400/80 tracking-[0.2em] uppercase">DROP IMAGE TO ANALYZE</p>
                <p className="text-white/35 text-[clamp(0.6rem,1.5vw,0.75rem)] font-light mt-3">or click to browse local storage</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <img src={image.preview} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl z-10 border border-white/10" alt="Preview" />
              <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
              {/* Internal Scanline Effect on image */}
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
                <div className="w-full h-[2px] bg-cyan-400/50 shadow-[0_0_10px_#00f5ff] animate-[scanMove_2s_infinite]" />
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="w-full animate-on-load anim-step-6">
          <button
            onClick={analyzeImage}
            disabled={!image || isLoading}
            className={`w-full h-[clamp(48px,5vw,56px)] rounded-[12px] font-orbitron text-[clamp(0.7rem,2.5vw,0.85rem)] font-bold tracking-[clamp(0.05em,1vw,0.2em)] transition-all duration-300 ${
              !image || isLoading 
                ? 'bg-white/5 text-white/15 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-[#0066ff] to-[#00ccff] text-white hover:brightness-110 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,150,255,0.4)]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span className="truncate">{scanningText}</span>
              </span>
            ) : "RUN DEEPFAKE SCAN →"}
          </button>
          
          <TerminalLogs isProcessing={isLoading} imagePreview={image?.preview} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-mono-space text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div ref={resultRef} className="w-full mt-10 md:mt-12 glass-card rounded-[20px] p-0 overflow-hidden animate-on-load anim-step-5 border-cyan-500/20 shadow-[0_0_100px_rgba(0,200,255,0.05)]">
            
            {/* Header / Status Bar */}
            <div className={`p-4 border-b ${result.verdict === 'REAL' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'} flex justify-between items-center px-8`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${result.verdict === 'REAL' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                <span className="font-mono-space text-[0.65rem] tracking-[0.2em] text-white/60">ANALYSIS COMPLETE</span>
              </div>
              <span className="font-mono-space text-[0.65rem] tracking-[0.2em] text-white/40">ID: TV-SCAN-{Math.floor(Math.random()*9000)+1000}</span>
            </div>

            <div className="p-[clamp(24px,5vw,40px)]">
              {/* Verdict & Gauge Row */}
              <div className="flex flex-col md:flex-row gap-10 items-center mb-12">
                
                {/* Circular Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke={result.verdict === 'REAL' ? '#00FF88' : '#FF4444'} 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * result.confidence) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-[1.5s] ease-out drop-shadow-[0_0_10px_currentColor]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-orbitron text-3xl font-black ${result.verdict === 'REAL' ? 'text-[#00FF88]' : 'text-[#FF4444]'}`}>
                      {result.confidence}%
                    </span>
                    <span className="text-white/30 text-[0.55rem] font-mono-space uppercase tracking-widest mt-1">CONFIDENCE</span>
                  </div>
                </div>

                {/* Main Verdict */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`inline-block px-4 py-1 rounded-full border mb-4 ${result.verdict === 'REAL' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'} font-mono-space text-[0.65rem] tracking-widest`}>
                    {result.verdict === 'REAL' ? 'PASSED AUTHENTICATION' : 'SECURITY ALERT DETECTED'}
                  </div>
                  <h2 
                    data-text={result.verdict}
                    className={`font-orbitron text-[clamp(2rem,5vw,3rem)] font-black leading-none mb-3 tracking-tighter ${
                    result.verdict === 'REAL' ? 'text-[#00FF88] drop-shadow-[0_0_20px_rgba(0,255,100,0.4)]' : 'text-[#FF4444] drop-shadow-[0_0_20px_rgba(255,50,50,0.4)] glitch-text'
                  }`}>
                    {result.verdict}
                  </h2>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-md">
                    Our neural network has analyzed the spatial and frequency domains of this image. 
                    {result.verdict === 'REAL' ? ' No synthetic manipulation patterns were detected.' : ' Strong indicators of AI generation or GAN manipulation were identified.'}
                  </p>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Indicators */}
                <div className="space-y-4">
                  <h3 className="section-label">DETECTION LOG</h3>
                  <div className="space-y-3">
                    {result.indicators.map((ind, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.05] group`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${result.verdict === 'REAL' ? 'bg-green-500' : 'bg-red-500'} group-hover:scale-125 transition-transform`} />
                        <span className="text-[0.75rem] text-white/70 font-mono-space leading-none">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reasoning / Explanation */}
                <div className="space-y-4">
                  <h3 className="section-label">AI REASONING</h3>
                  <div className="relative group p-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.02] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    <p className="relative z-10 text-[0.85rem] leading-relaxed font-light italic text-cyan-100/70">
                      "<TypewriterText text={result.reasoning} />"
                    </p>
                    {/* Decorative Code Snippet */}
                    <div className="mt-4 pt-4 border-t border-white/5 font-mono-space text-[0.6rem] text-white/20 overflow-hidden whitespace-nowrap opacity-50">
                      <code>{`>> DETECT_OBJ: FACE_ZONE_1\n>> MAP: ${result.verdict === 'REAL' ? '0x7F42A' : '0xDE4AD'}\n>> ENTROPY_VAL: 0.942`}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 text-[0.6rem] font-mono-space text-white/30 uppercase tracking-[0.2em]">
                  <span>{image.name}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{(image.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <button
                  onClick={resetScan}
                  className="px-8 py-3 rounded-xl border border-cyan-500/30 bg-transparent text-cyan-400 font-orbitron text-[0.7rem] tracking-[0.2em] hover:bg-cyan-500/10 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(0,200,255,0.1)] transition-all duration-300 uppercase flex items-center gap-3"
                >
                  <span className="text-base">↩</span> NEW SCAN
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 md:mt-24 pb-8 md:pb-12 flex flex-col items-center gap-2 text-[0.6rem] font-mono-space tracking-[0.2em] leading-[1.8] animate-on-load anim-step-7">
          <p className="text-center px-4">TRUEVISION v2.0 • DEEP SPACE NEURAL LAB</p>
          <p className="text-center px-4">AKGEC FINAL YEAR PROJECT • 2026</p>
        </footer>
      </div>
    </div>
  );
}
