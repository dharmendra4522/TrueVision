import { useState, useRef, useEffect } from 'react';

// --- Icons ---
const EyeIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgba(0,200,255,0.8)]">
    <ellipse cx="32" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="3" fill="currentColor" />
    <path d="M32 12V8M32 56V52M52 32H56M8 32H12M12 18L10 16M52 46L54 48M52 18L54 16M12 46L10 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export default function App() {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanningText, setScanningText] = useState('SCANNING...');
  const [showTeam, setShowTeam] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const fileInputRef = useRef(null);

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

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.');
      return;
    }
    
    setImage({ 
      file: file,           // original File object — FormData ke liye
      preview: URL.createObjectURL(file),  // preview ke liye
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

      const response = await fetch("https://truevision-api.onrender.com/predict", {
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
      setError("API se connect nahi ho paya. Check karo backend chal raha hai.");
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`group animate-on-load anim-step-5 relative w-full min-h-[clamp(220px,30vh,300px)] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden border-[1.5px] ${
            image ? 'bg-white/5 border-cyan-500/30' : 'bg-white/[0.03] border-white/10'
          } hover:border-cyan-500/60 backdrop-blur-[20px] mb-8 md:mb-10 p-6 sm:p-8`}
        >
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          
          {!image ? (
            <div className="flex flex-col items-center gap-6 group-hover:scale-105 transition-all duration-500 px-4 text-center">
              <div className="scale-[clamp(0.75,2vw,1)]">
                <EyeIcon />
              </div>
              <div>
                <p className="font-orbitron text-[clamp(0.7rem,3vw,0.9rem)] text-cyan-400/80 tracking-[0.2em] uppercase">DROP IMAGE TO ANALYZE</p>
                <p className="text-white/35 text-[clamp(0.6rem,1.5vw,0.75rem)] font-light mt-3">or click to browse local storage</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <img src={image.preview} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl z-10" alt="Preview" />
              <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
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
        </div>

        {/* Results Panel */}
        {result && (
          <div className="w-full mt-10 md:mt-12 glass-card rounded-[20px] p-[clamp(20px,5vw,32px)] animate-on-load anim-step-5">
            {/* Verdict */}
            <div className={`mb-6 md:mb-10 text-center p-6 md:p-10 rounded-2xl border ${
              result.verdict === 'REAL' 
                ? 'bg-green-400/5 border-green-500/20' 
                : 'bg-red-400/5 border-red-500/20'
            } glitch-flicker`}>
              <h2 className={`font-orbitron text-[clamp(1.3rem,5vw,2rem)] font-black mb-2 tracking-tighter ${
                result.verdict === 'REAL' ? 'text-[#00FF88] drop-shadow-[0_0_20px_rgba(0,255,100,0.5)]' : 'text-[#FF4444] drop-shadow-[0_0_20px_rgba(255,50,50,0.5)]'
              }`}>
                {result.verdict === 'REAL' ? '✓ AUTHENTIC' : '⚠ DEEPFAKE DETECTED'}
              </h2>
              <p className="text-white/50 text-[0.6rem] md:text-[0.65rem] font-mono-space tracking-[0.15em] md:tracking-[0.2em] uppercase">
                Status: {result.verdict === 'REAL' ? 'GENUINE CONTENT' : 'SYNTHETIC CONTENT DETECTED'}
              </p>
            </div>

            {/* Confidence */}
            <div className="mb-10 space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="section-label mb-0">Confidence Level</h3>
                <span className={`font-orbitron text-sm md:text-lg font-black ${result.verdict === 'REAL' ? 'text-[#00FF88]' : 'text-[#FF4444]'}`}>
                  {result.confidence}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full progress-fill ${result.verdict === 'REAL' ? 'bg-gradient-to-r from-[#00cc66] to-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'bg-gradient-to-r from-[#cc0000] to-[#ff4444] shadow-[0_0_15px_rgba(255,68,68,0.3)]'}`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Indicators */}
            <div className="mb-10">
              <h3 className="section-label">Detection Indicators</h3>
              <div className="flex flex-wrap gap-3">
                {result.indicators.map((ind, i) => {
                  const isFake = result.verdict === 'FAKE';
                  const isHighlight = i === 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`indicator-pill group transition-all duration-300 ${
                        isFake 
                          ? 'border-[rgba(255,50,50,0.3)] text-[rgba(255,150,150,0.9)] hover:border-[rgba(255,50,50,0.5)]' 
                          : 'border-[rgba(0,255,100,0.3)] text-[rgba(100,255,180,0.9)] hover:border-[rgba(0,255,100,0.5)]'
                      } ${isHighlight ? 'text-[0.8rem] font-bold brightness-125 scale-[1.02]' : 'text-[0.75rem]'}`}
                    >
                      <span className={`font-bold ${isFake ? 'text-[#FF4444]' : 'text-[#00FF88]'}`}>▸</span>
                      {ind}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reasoning */}
            <div className="mb-10">
              <h3 className="section-label">AI Reasoning</h3>
              <div 
                className="p-5 rounded-xl border border-white/5 bg-white/[0.02] text-sm leading-relaxed font-light italic"
                style={{ 
                  color: result.verdict === 'FAKE' ? 'rgba(255,150,150,0.8)' : 'rgba(100,255,180,0.8)' 
                }}
              >
                "{result.reasoning}"
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.6rem] font-mono-space text-white/20 uppercase tracking-widest mb-10">
              <span>{image.name}</span>
              <span>{(image.size / (1024 * 1024)).toFixed(2)} MB</span>
              <span>TIME: {new Date().toLocaleTimeString()}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetScan}
              className="w-full h-[44px] rounded-[10px] border border-cyan-500/30 bg-transparent text-cyan-400/80 font-orbitron text-[0.75rem] tracking-[0.2em] hover:bg-cyan-500/10 hover:border-cyan-500/60 transition-all duration-200 uppercase"
            >
              ↩ SCAN ANOTHER IMAGE
            </button>
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
