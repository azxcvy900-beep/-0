import Link from "next/link";
import { PlusCircle, Search, Wrench, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col items-center" dir="rtl">
      
      {/* Premium Background Blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-md mt-16 mb-12 flex flex-col items-center relative z-10 px-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center mb-6 border border-white/20 transform transition-transform duration-500 hover:scale-105">
            <Wrench className="text-white/80 w-8 h-8 mb-1" />
            <span className="text-white text-3xl font-black tracking-tight">الخير</span>
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          الخير برو
        </h1>
        <div className="flex items-center mt-3 text-slate-500 font-medium">
          <ShieldCheck className="w-5 h-5 mr-1.5 text-blue-500" />
          <p className="text-lg">نظام الإدارة الذكي</p>
        </div>
      </header>

      {/* Main Actions */}
      <main className="w-full max-w-md flex flex-col space-y-6 px-6 relative z-10 pb-12">
        <Link 
          href="/search" 
          className="group relative flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border-2 border-slate-100/80 p-10 rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-56 overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-all duration-500" />
          
          <div className="bg-slate-50 p-4 rounded-2xl mb-5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-50 group-hover:border-blue-100">
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
    </div>
  );
}
