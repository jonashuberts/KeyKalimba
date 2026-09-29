import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, FileMusic, Minus, Plus, Mic, Hash, Upload, Heart, ExternalLink, Sliders } from 'lucide-react';
import { TUNINGS } from '../constants/kalimba';
import './Navbar.css';

interface NavbarProps {
  ppi: number;
  setPpi: (val: number) => void;
  tuning: string;
  setTuning: (val: string) => void;
  tempo: number;
  setTempo: (val: number) => void;
  onFileUpload: (file: File) => void;
  onPlay: () => void;
  onStop: () => void;
  isPlaying: boolean;
  isFinished: boolean;
  isReady: boolean;
  showNumbers: boolean;
  setShowNumbers: (val: boolean) => void;
  progress: number;
  seek: (percent: number) => void;
  isTuningMode: boolean;
  toggleTuningMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  ppi,
  setPpi,
  tuning,
  setTuning,
  tempo,
  setTempo,
  onFileUpload,
  onPlay,
  onStop,
  isPlaying,
  isReady,
  showNumbers,
  setShowNumbers,
  progress,
  seek,
  isTuningMode,
  toggleTuningMode
}) => {
  const [localTempo, setLocalTempo] = useState<string>(tempo.toString());
  const [isMidiMenuOpen, setIsMidiMenuOpen] = useState<boolean>(false);
  const [isScaleMenuOpen, setIsScaleMenuOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scaleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalTempo(tempo.toString());
  }, [tempo]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMidiMenuOpen(false);
      }
      if (scaleMenuRef.current && !scaleMenuRef.current.contains(e.target as Node)) {
        setIsScaleMenuOpen(false);
      }
    };
    if (isMidiMenuOpen || isScaleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMidiMenuOpen, isScaleMenuOpen]);

  const commitTempo = () => {
    const parsed = parseInt(localTempo, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTempo(parsed);
      setLocalTempo(parsed.toString()); // Clean up leading zeros
    } else {
      setLocalTempo(tempo.toString()); // Revert if invalid gracefully
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>KeyKalimba</h1>
      </div>

      <div className="nav-controls">
        {/* Left Side: Environment Configuration */}
        <div className="setting-group">
          <span className="setting-label">Tuning</span>
          <select 
            className="tempo-input tuning-select"
            value={tuning}
            onChange={(e) => setTuning(e.target.value)}
          >
            {Object.keys(TUNINGS).map(scale => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
        </div>

        {/* Scale / Zoom Popover Menu */}
        <div className="scale-menu-container" ref={scaleMenuRef}>
          <button 
            className={`scale-menu-btn ${isScaleMenuOpen ? 'active' : ''}`}
            onClick={() => {
              setIsScaleMenuOpen(!isScaleMenuOpen);
              setIsMidiMenuOpen(false);
            }}
            title="Calibrate Instrument Scale"
          >
            <Sliders size={15} />
            <span className="scale-btn-label">Scale</span>
            <span className="scale-pill-badge">{ppi}</span>
          </button>

          {isScaleMenuOpen && (
            <div className="scale-dropdown-menu">
              <div className="scale-menu-header">
                <span className="scale-menu-title">Instrument Scale</span>
                <span className="scale-menu-val">{ppi} PPI</span>
              </div>

              <div className="scale-slider-row">
                <button 
                  className="scale-stepper-btn" 
                  onClick={() => setPpi(Math.max(50, ppi - 1))}
                  title="Decrease"
                >
                  <Minus size={15} />
                </button>
                <input 
                  type="range" 
                  min={50} 
                  max={250} 
                  value={ppi} 
                  onChange={(e) => setPpi(Number(e.target.value))}
                  className="scale-range-slider"
                />
                <button 
                  className="scale-stepper-btn" 
                  onClick={() => setPpi(Math.min(250, ppi + 1))}
                  title="Increase"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="scale-presets-row">
                <button 
                  className={`scale-preset-btn ${ppi === 130 ? 'active' : ''}`}
                  onClick={() => setPpi(130)}
                >
                  130
                </button>
                <button 
                  className={`scale-preset-btn ${ppi === 153 ? 'active' : ''}`}
                  onClick={() => setPpi(153)}
                >
                  153 (Default)
                </button>
                <button 
                  className={`scale-preset-btn ${ppi === 175 ? 'active' : ''}`}
                  onClick={() => setPpi(175)}
                >
                  175
                </button>
              </div>

              <span className="scale-help-text">Align keys with your physical Kalimba</span>
            </div>
          )}
        </div>

        <button 
          className={`toggle-btn ${showNumbers ? 'active' : 'inactive'}`}
          onClick={() => setShowNumbers(!showNumbers)}
          title={showNumbers ? "Hide Key Numbers" : "Show Key Numbers"}
        >
          <Hash size={15} />
          <span className="toggle-text">123</span>
        </button>

        {/* Right Side: Tools & Playback */}
        {!isTuningMode && (
          <>
            <div className="midi-menu-container" ref={menuRef}>
              <button 
                className={`midi-menu-btn ${isMidiMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMidiMenuOpen(!isMidiMenuOpen)}
                title="MIDI Options & Song Library"
              >
                <FileMusic size={16} />
                <span>MIDI</span>
              </button>

              <input 
                ref={fileInputRef}
                type="file" 
                accept=".mid,.midi,audio/midi,audio/x-midi" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileUpload(e.target.files[0]);
                    setIsMidiMenuOpen(false);
                  }
                }} 
                hidden
              />

              {isMidiMenuOpen && (
                <div className="midi-dropdown-menu">
                  <button 
                    className="midi-dropdown-item"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsMidiMenuOpen(false);
                    }}
                  >
                    <Upload size={16} />
                    <div className="dropdown-item-text">
                      <span className="dropdown-title">Import File</span>
                      <span className="dropdown-desc">Load local .mid from device</span>
                    </div>
                  </button>

                  <a 
                    href="https://ko-fi.com/keykalimba" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="midi-dropdown-item support-item"
                    onClick={() => setIsMidiMenuOpen(false)}
                  >
                    <Heart size={16} className="support-icon" fill="currentColor" />
                    <div className="dropdown-item-text">
                      <span className="dropdown-title">Support Project</span>
                      <span className="dropdown-desc">Keep it free, ad-free & alive</span>
                    </div>
                    <ExternalLink size={13} className="ext-icon" />
                  </a>
                </div>
              )}
            </div>

              <div className="setting-group tempo-group">
                <span className="setting-label">BPM</span>
                <input 
                  type={isReady ? "number" : "text"}
                  className="tempo-input" 
                  min={10} 
                  max={200} 
                  value={isReady ? localTempo : "---"}
                  onChange={(e) => setLocalTempo(e.target.value)}
                  onBlur={commitTempo}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  disabled={!isReady}
                />
              </div>

              <div className="playback-controls">
                <button 
                  className={`btn-icon ${isPlaying ? 'active' : ''}`} 
                  onClick={onPlay} 
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="none" />}
                </button>
                <button className="btn-icon" onClick={onStop} disabled={!isReady} title="Stop">
                  <Square size={15} />
                </button>
              </div>
            </>
          )}

        <button 
          className={`toggle-btn ${isTuningMode ? 'active' : 'inactive'}`}
          onClick={toggleTuningMode}
          title={isTuningMode ? "Exit Tuner" : "Open Kalimba Tuner"}
        >
          <Mic size={15} />
          <span className="toggle-text">Tune</span>
        </button>
      </div>

      {!isTuningMode && (
        <div className="progress-bar-container">
          <input 
            type="range" 
            className="progress-bar" 
            min="0" 
            max="100" 
            step="0.05"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!isReady}
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
        </div>
      )}
    </nav>
  );
};
