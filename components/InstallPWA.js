"use client";
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt if user hasn't dismissed it
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        // Wait a little bit so it doesn't pop up instantly
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-3xl p-5 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col gap-4" dir="rtl">
      <button onClick={handleDismiss} className="absolute top-3 left-3 text-slate-400 hover:text-slate-600 bg-slate-100/50 rounded-full p-1 transition-colors">
        <X size={18} />
      </button>
      
      <div className="flex items-center gap-4">
        <img src="/logo.jpg" alt="الخير برو" className="w-16 h-16 rounded-2xl shadow-md border border-slate-100 object-cover" />
        <div>
          <h3 className="font-black text-slate-800 text-lg">الخير برو</h3>
          <p className="text-sm font-medium text-slate-500">قم بتثبيت التطبيق للوصول السريع</p>
        </div>
      </div>
      
      <button 
        onClick={handleInstall}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
      >
        <Download size={20} />
        تثبيت التطبيق الآن
      </button>
    </div>
  );
}
