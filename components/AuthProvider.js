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
    setIsChecking(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "الخير" && password === "Aa1234567890Aa") {
      localStorage.setItem("al_khair_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
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
