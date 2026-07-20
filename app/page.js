import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-slate-50 text-slate-900" dir="rtl">
      {/* Header */}
      <header className="w-full max-w-md mt-8 mb-12 flex flex-col items-center">
        {/* Placeholder for Logo */}
        <div className="w-24 h-24 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-4">
          <span className="text-white text-3xl font-bold">خ</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">الخير برو</h1>
        <p className="text-slate-500 mt-2 text-lg">نظام إدارة صيانة السيارات</p>
      </header>

      {/* Main Actions */}
      <main className="w-full max-w-md flex flex-col space-y-6">
        <Link 
          href="/new-service" 
          className="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-10 rounded-3xl shadow-md transition-all h-48"
        >
          <PlusCircle size={48} className="mb-4" />
          <span className="text-2xl font-bold">صيانة جديدة</span>
        </Link>

        <Link 
          href="/search" 
          className="flex flex-col items-center justify-center bg-white border-2 border-slate-200 hover:border-slate-300 active:bg-slate-100 text-slate-700 p-10 rounded-3xl shadow-sm transition-all h-48"
        >
          <Search size={48} className="mb-4 text-slate-400" />
          <span className="text-2xl font-bold">بحث السجلات</span>
        </Link>
      </main>
    </div>
  );
}
