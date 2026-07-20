"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("al_khair_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    
    // Start exit animation after 1.5 seconds
    const timer1 = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    // Completely unmount splash screen after exit animation completes (1.5s + 0.6s)
    const timer2 = setTimeout(() => {
      setIsChecking(false);
    }, 2100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#0b1120] flex items-center justify-center overflow-hidden"
            dir="rtl"
          >
            {/* Cinematic Spotlight */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"
            />
            
            <motion.div 
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center z-10"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(37,99,235,0.4)] border-2 border-white/10 mb-6">
                <img src="/logo.jpg" alt="الخير" className="w-44 h-44 object-cover" />
                
                {/* Diagonal Light Sweep */}
                <motion.div 
                  initial={{ x: "-150%" }}
                  animate={{ x: "250%" }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
                />
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-black text-white tracking-tight drop-shadow-2xl"
              >
                الخير برو
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
