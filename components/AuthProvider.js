"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("al_khair_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    
    // Splash screen delay to match animation (1200ms)
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = username.trim();
    if ((user === "الخير" || user === "الخير برو") && password === "Aa1234567890Aa") {
      localStorage.setItem("al_khair_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes drawPath {
            0% { stroke-dashoffset: 1500; opacity: 1; }
            50% { stroke-dashoffset: 0; opacity: 1; }
            80% { opacity: 0; transform: scale(1.05); }
            100% { opacity: 0; transform: scale(1.05); }
          }
          @keyframes revealLogo {
            0% { opacity: 0; transform: scale(0.95); filter: blur(10px); }
            50% { opacity: 0; transform: scale(0.95); filter: blur(5px); }
            80% { opacity: 1; transform: scale(1); filter: blur(0px); }
            100% { opacity: 1; transform: scale(1); filter: blur(0px); }
          }
          .animate-draw {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: drawPath 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          .animate-reveal {
            opacity: 0;
            animation: revealLogo 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}} />
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-64 h-64">
          
          {/* SVG Line Trace */}
          <svg className="absolute inset-0 w-full h-full text-blue-600 animate-draw" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Minimalist Car & Wrench Outline representation */}
            <path d="M20 60 L25 45 L40 35 L70 35 L85 45 L90 60 Z" />
            <circle cx="35" cy="65" r="8" />
            <circle cx="75" cy="65" r="8" />
            <path d="M45 45 L65 65" strokeWidth="2" />
            <path d="M60 45 L45 60" strokeWidth="2" />
          </svg>

          {/* Actual Logo revealing underneath */}
          <div className="absolute inset-0 w-full h-full animate-reveal flex flex-col items-center justify-center">
            <img src="/logo.jpg" alt="الخير" className="w-36 h-36 rounded-[2rem] shadow-2xl mb-4 border border-slate-100 object-cover" />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">الخير برو</h1>
          </div>
          
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden" dir="rtl">
        {/* Background logo watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] bg-no-repeat bg-center bg-cover pointer-events-none blur-sm"
          style={{ backgroundImage: 'url(/logo.jpg)' }}
        />
        
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-sm border border-white relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="الخير" className="w-28 h-28 mx-auto rounded-[2rem] shadow-lg mb-6 border-2 border-white" />
            <h1 className="text-3xl font-black text-slate-800">تسجيل الدخول</h1>
            <p className="text-slate-500 mt-2 font-medium">نظام الإدارة - مركز الخير</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">اسم المستخدم</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-lg p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-lg p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white text-left"
                dir="ltr"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-bold animate-pulse">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="mt-4 w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-95 text-lg"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
