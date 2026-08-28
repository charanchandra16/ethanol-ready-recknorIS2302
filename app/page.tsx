'use client';

import { useState, useCallback } from 'react';
import { calculate, getTempRange, getObsRange } from '@/lib/calculator';
import type { CalculationResult } from '@/lib/calculator';

const tempRange = getTempRange();
const obsRange  = getObsRange();

export default function Home() {
  const [temperature, setTemperature]       = useState('');
  const [observedDegree, setObservedDegree] = useState('');
  const [result, setResult]                 = useState<CalculationResult | null>(null);
  const [error, setError]                   = useState<string | null>(null);
  const [isCalculating, setIsCalculating]   = useState(false);
  const [hasCalculated, setHasCalculated]   = useState(false);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);
    const temp = parseFloat(temperature);
    const obs  = parseFloat(observedDegree);
    if (isNaN(temp) || temperature.trim() === '') { setError('Please enter a valid temperature value.'); return; }
    if (isNaN(obs)  || observedDegree.trim() === '') { setError('Please enter a valid observed degree value.'); return; }
    setIsCalculating(true);
    setTimeout(() => {
      const r = calculate(temp, obs);
      setIsCalculating(false);
      setHasCalculated(true);
      if ('error' in r) setError(r.error);
      else setResult(r);
    }, 250);
  }, [temperature, observedDegree]);

  const handleReset = () => {
    setTemperature(''); setObservedDegree('');
    setResult(null); setError(null); setHasCalculated(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCalculate(); };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 55%, #fffde7 100%)' }}>

      {/* ── HEADER BANNER ── */}
      <header style={{ background: 'linear-gradient(90deg, #007A3D 0%, #005f2e 40%, #1565C0 100%)' }} className="flex-shrink-0 px-4 py-2 flex items-center gap-3 shadow-lg">
        {/* BPCL flame icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,184,28,0.2)', border: '2px solid #FFB81C' }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FFB81C">
            <path d="M12 2C10 5 7 7 7 11c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2-1-3.5-2-4.5C14.5 8 14 9.5 14 11c0 1.1-.9 2-2 2s-2-.9-2-2c0-2.5 2-5 2-9z"/>
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-white font-extrabold leading-tight text-sm sm:text-base md:text-lg tracking-tight">
            Ready Reckoner : Estimation of Ethanol Specific Gravity &amp; Purity
          </h1>
          <p className="text-xs leading-tight" style={{ color: '#FFB81C' }}>
            Extract of IS 2302 &amp; IS 321
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex items-center justify-center px-3 py-2 overflow-hidden">
        <div className="w-full max-w-2xl flex flex-col gap-2.5">

          {/* ── INPUT CARD ── */}
          <div className="rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: '#007A3D', background: 'rgba(255,255,255,0.92)' }}>
            {/* Card header stripe */}
            <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #007A3D, #1565C0)' }}>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Input Parameters</span>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Temperature */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#007A3D' }}>
                    <span className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-black flex-shrink-0" style={{ background: '#007A3D' }}>1</span>
                    Temperature (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number" step="0.5" min={tempRange.min} max={tempRange.max}
                      value={temperature}
                      onChange={e => setTemperature(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 28"
                      className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none transition-all"
                      style={{ border: '2px solid #a7d7b8', background: '#f0faf4' }}
                      onFocus={e => e.target.style.borderColor = '#007A3D'}
                      onBlur={e => e.target.style.borderColor = '#a7d7b8'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: '#007A3D' }}>°C</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Range: {tempRange.min}–{tempRange.max}°C</p>
                </div>

                {/* Observed Degree */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#1565C0' }}>
                    <span className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-black flex-shrink-0" style={{ background: '#1565C0' }}>2</span>
                    Observed Degree
                  </label>
                  <input
                    type="number" step="0.1" min={obsRange.min} max={obsRange.max}
                    value={observedDegree}
                    onChange={e => setObservedDegree(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 99"
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none transition-all"
                    style={{ border: '2px solid #b3cef5', background: '#f0f4ff' }}
                    onFocus={e => e.target.style.borderColor = '#1565C0'}
                    onBlur={e => e.target.style.borderColor = '#b3cef5'}
                  />
                  <p className="text-[10px] text-slate-400">Range: {obsRange.min}–{obsRange.max}</p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs fade-up" style={{ background: '#fff3f3', border: '1.5px solid #fca5a5', color: '#b91c1c' }}>
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <button onClick={handleCalculate} disabled={isCalculating} className="btn-calculate flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed" style={{ focusRingColor: '#007A3D' }}>
                  {isCalculating ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Calculating…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      Calculate
                    </span>
                  )}
                </button>
                {hasCalculated && (
                  <button onClick={handleReset} className="btn-reset py-2.5 px-4 rounded-xl font-bold text-sm text-white focus:outline-none">
                    🔄 Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── RESULTS CARD ── */}
          {result && (
            <div className="rounded-2xl overflow-hidden shadow-xl border fade-up" style={{ borderColor: '#1565C0', background: 'rgba(255,255,255,0.95)' }}>
              <div className="px-4 py-2" style={{ background: 'linear-gradient(90deg, #1565C0, #007A3D)' }}>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Calculation Results</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <ResultCard
                    label="Corresponding Degree @ 20°C"
                    value={result.degreeAt20C.toFixed(1)}
                    unit="" accent="#007A3D" bg="#f0faf4" border="#a7d7b8"
                  />
                  <ResultCard
                    label="Volume at 20°C Conversion Factor"
                    value={result.conversionFactor.toFixed(3)}
                    unit="" accent="#1565C0" bg="#f0f4ff" border="#b3cef5"
                  />
                  <ResultCard
                    label="Ethanol Purity"
                    value={result.purity.toFixed(1)}
                    unit="%" accent="#FFB81C" bg="#fffde7" border="#ffe082"
                    big labelColor="#000"
                  />
                  <ResultCard
                    label="Specific Gravity @ 15.6°C"
                    value={result.specificGravity !== null ? result.specificGravity.toFixed(4) : '—'}
                    unit="" accent="#c62828" bg="#fff5f5" border="#ffcdd2"
                    big labelColor="#000"
                  />
                </div>

                {/* Breakdown */}
                <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Calculation Breakdown</p>
                  <div className="space-y-0.5 text-xs font-mono text-slate-600">
                    <p>Input: temp = <b style={{color:'#007A3D'}}>{result.inputTemp}°C</b>, obs = <b style={{color:'#1565C0'}}>{result.inputObs}</b></p>
                    <p>Degree @ 20°C = <b style={{color:'#007A3D'}}>{result.degreeAt20C}</b> (from lookup table)</p>
                    <p>Conversion Factor = <b style={{color:'#1565C0'}}>{result.conversionFactor}</b></p>
                    <p>Purity = {result.degreeAt20C} ÷ {result.conversionFactor} = <b style={{color:'#e65100'}}>{result.purity.toFixed(1)}%</b></p>
                    {result.specificGravity !== null && (
                      <p>SG @ 15.6°C = <b style={{color:'#c62828'}}>{result.specificGravity.toFixed(4)}</b> (from SG table at {result.purity.toFixed(1)}%)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTE + DISCLAIMER ── */}
          <div className="flex flex-col gap-1.5">
            {/* Note – highlighted */}
            <div className="flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: 'linear-gradient(90deg, #fffde7, #fff9c4)', border: '2px solid #FFB81C' }}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="#e65100">
                <path d="M12 2L2 22h20L12 2zm0 4l7.5 13H4.5L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
              <p className="text-xs font-bold leading-tight" style={{ color: '#e65100' }}>
                ⚠️ Note : Specific Gravity is valid upto <span className="underline decoration-2">0.7997</span> &amp; Observed degree of Purity from <span className="underline decoration-2">83.0 Onwards</span>
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(21,101,192,0.07)', border: '1px solid #b3cef5' }}>
              <p className="text-[10px] text-slate-600 leading-snug">
                <span className="font-bold" style={{ color: '#1565C0' }}>Disclaimer : </span>
                In case of dispute / doubt in quality, Please refer to <strong>IS 2302 &amp; IS 321</strong> standard for verification of results.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

interface ResultCardProps {
  label: string; value: string; unit: string;
  accent: string; bg: string; border: string;
  big?: boolean; labelColor?: string;
}

function ResultCard({ label, value, unit, accent, bg, border, big, labelColor }: ResultCardProps) {
  return (
    <div className="rounded-xl p-3" style={{ background: bg, border: `2px solid ${border}` }}>
      <p className="text-[10px] font-bold uppercase tracking-wide leading-tight mb-1"
         style={{ color: labelColor ?? accent }}>
        {label}
      </p>
      <p className={`font-extrabold tracking-tight leading-none ${big ? 'text-2xl' : 'text-xl'}`}
         style={{ color: accent }}>
        {value}<span className="text-sm font-bold">{unit}</span>
      </p>
    </div>
  );
}
