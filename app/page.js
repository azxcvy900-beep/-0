"use client";

import Link from "next/link";
import { PlusCircle, Search, Bell, Share2, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstallable(false);
    } else {
      setIsInstallable(true); // Always show if not installed
    }

    // Check for iOS Safari
    const ua = window.navigator.userAgent;
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    const isWebKit = !!ua.match(/WebKit/i);
    const isChrome = !!ua.match(/CriOS/i);
    
    if ((isIPad || isIPhone) && isWebKit && !isChrome) {
      setIsIOS(true);
    }

    // Handle standard beforeinstallprompt (Android/Chrome/Edge)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native install prompt available
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show fallback instructions for iOS or Chrome without service worker
      setShowInstructions(true);
      setTimeout(() => setShowInstructions(false), 10000); // Hide instructions after 10 seconds
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'الخير برو',
          text: 'تطبيق إدارة ورشة الخير برو لصيانة السيارات',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط التطبيق!');
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col items-center justify-center" dir="rtl">
      
      {/* Premium Background Blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      {/* Transparent Watermark Logo */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] bg-no-repeat bg-center bg-contain pointer-events-none blur-[1px]"
        style={{ backgroundImage: 'url(/logo.jpg)' }}
      />

      {/* Top Left Buttons */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 hover:bg-white text-slate-500 hover:text-blue-600 transition-all hover:scale-105 active:scale-95 shadow-sm group"
          title="مشاركة التطبيق"
        >
          <Share2 size={22} className="group-hover:animate-pulse" />
        </button>

        {/* Install Button (Visible only if not installed) */}
        {isInstallable && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center justify-center p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30 group relative"
            title="تثبيت التطبيق"
          >
            <Download size={22} className="group-hover:animate-bounce" />
            
            {/* Instructions Tooltip/Popup */}
            {showInstructions && (
              <div className="absolute top-full mt-4 left-0 w-64 bg-slate-800 text-white text-sm p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 pointer-events-none">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-800 rotate-45" />
                <p className="font-bold mb-1 text-blue-300">{isIOS ? 'لتثبيت التطبيق على الآيفون:' : 'لتثبيت التطبيق:'}</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  {isIOS ? (
                    <>
                      <li>اضغط على أيقونة المشاركة <Share2 size={12} className="inline mx-1" /> بالأسفل</li>
                      <li>اختر <strong>"إضافة للشاشة الرئيسية"</strong></li>
                    </>
                  ) : (
                    <>
                      <li>اضغط على القائمة (الثلاث نقاط) بالأعلى</li>
                      <li>اختر <strong>"إضافة للشاشة الرئيسية"</strong> أو "تثبيت التطبيق"</li>
                    </>
                  )}
                </ol>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Top Right Customer Reminder Icon */}
      <Link 
        href="/reminders" 
        className="absolute top-6 right-6 flex flex-col items-center justify-center p-2.5 rounded-2xl bg-orange-50/80 backdrop-blur-md border border-orange-200/50 hover:bg-orange-100 text-orange-500 transition-all hover:scale-105 active:scale-95 shadow-sm group z-20"
      >
        <Bell size={22} className="mb-1 group-hover:animate-bounce" />
        <span className="text-[11px] font-bold text-orange-600">تذكير العملاء</span>
      </Link>

      {/* Main Actions */}
      <main className="w-full max-w-md flex flex-col space-y-6 px-6 relative z-10">
        
        <Link 
          href="/search" 
          className="group relative flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border-2 border-slate-100/80 p-10 rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-56 overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-all duration-500" />
          
          <div className="bg-slate-50 p-4 rounded-2xl mb-5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-50 group-hover:border-blue-100 relative">
            <Search size={40} className="text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
          <span className="text-3xl font-black text-slate-700 tracking-tight">بحث السجلات</span>
          <p className="text-slate-400 mt-2 font-medium">استعلام عن تاريخ السيارات</p>
        </Link>

        <Link 
          href="/new-service" 
          className="group relative flex flex-col items-center justify-center p-10 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-56 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
          
          <div className="bg-white/20 p-4 rounded-2xl mb-5 backdrop-blur-sm border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <PlusCircle size={40} className="text-white" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight drop-shadow-sm">صيانة جديدة</span>
          <p className="text-blue-100/80 mt-2 font-medium">تسجيل مركبة أو عملية صيانة</p>
        </Link>
      </main>

      {/* Requested Text */}
      <div className="relative z-10 mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-900 drop-shadow-sm">
          غنيتكم يا ابراهيم وعبود لما الموت
        </h2>
      </div>

    </div>
  );
}
