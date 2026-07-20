"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchVehicles } from "@/lib/db";
import { ArrowRight, Search as SearchIcon, Plus, ChevronDown, ChevronUp, Loader2, Calendar, PenTool, Hash, FileText } from "lucide-react";
import Link from "next/link";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('q') || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Accordion state - stores the ID of the expanded service
  const [expandedService, setExpandedService] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (queryToSearch = searchTerm) => {
    if (!queryToSearch.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setResult(null);
    
    const data = await searchVehicles(queryToSearch.trim());
    setResult(data);
    setIsSearching(false);
  };

  const toggleAccordion = (id) => {
    if (expandedService === id) {
      setExpandedService(null);
    } else {
      setExpandedService(id);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8" dir="rtl">
      
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link href="/" className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-white transition-all hover:scale-105 active:scale-95">
            <ArrowRight size={24} />
          </Link>
          <div className="mr-5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">بحث السجلات</h1>
            <p className="text-slate-500 mt-1 font-medium">استعلم عن تاريخ المركبات بسهولة</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white flex relative group transition-all duration-300 focus-within:shadow-2xl focus-within:shadow-blue-500/10 focus-within:bg-white mb-8">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="أدخل رقم الجوال أو اللوحة..."
            className="flex-1 text-lg p-3 sm:px-6 outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-70"
          >
            {isSearching ? <Loader2 size={26} className="animate-spin" /> : <SearchIcon size={26} />}
          </button>
        </div>

        {/* Results */}
        {hasSearched && !isSearching && !result && (
          <div className="bg-white/60 backdrop-blur-lg rounded-[2rem] p-10 text-center shadow-lg border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <SearchIcon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">لم نجد هذه المركبة</h3>
            <p className="text-slate-500 mb-6">تأكد من الرقم أو قم بإضافتها كمركبة جديدة</p>
            <Link 
              href={`/new-service?phone=${searchTerm}`}
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors border border-blue-100 shadow-sm hover:shadow"
            >
              <Plus size={20} className="ml-2" />
              إضافة مركبة جديدة
            </Link>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Customer Info Card */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] transition-all duration-500 group-hover:bg-blue-500/10" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    {result.vehicle.customerName || "عميل غير مسجل الاسم"}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-x-reverse text-slate-600 font-medium">
                    <span className="flex items-center mt-2 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 mr-2 text-sm">الجوال</span> {result.vehicle.phoneNumber}
                    </span>
                    <span className="flex items-center mt-2 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 mr-2 text-sm">اللوحة</span> {result.vehicle.licensePlate}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/new-service?phone=${result.vehicle.phoneNumber}&name=${result.vehicle.customerName || ''}&plate=${result.vehicle.licensePlate}`}
                  className="mt-6 sm:mt-0 bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 px-6 py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-sm hover:shadow active:scale-95 group/btn"
                >
                  <Plus size={22} className="ml-2 group-hover/btn:scale-110 transition-transform" />
                  تسجيل صيانة
                </Link>
              </div>
            </div>

            {/* Service History */}
            <div>
              <div className="flex items-center mb-6 pl-2">
                <h3 className="text-2xl font-black text-slate-800">سجل الصيانة</h3>
                <span className="mr-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {result.services.length} عمليات
                </span>
              </div>
              
              <div className="space-y-4">
                {result.services.length === 0 ? (
                  <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 text-center border border-white">
                    <p className="text-slate-500 font-medium">المركبة مسجلة ولكن لا يوجد لها أي سجل صيانة حتى الآن.</p>
                  </div>
                ) : (
                  result.services.map((service, index) => {
                    const isExpanded = expandedService === service.id;
                    
                    return (
                      <div 
                        key={service.id} 
                        className={`bg-white/80 backdrop-blur-lg rounded-[1.5rem] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md border border-white/80 ${isExpanded ? 'ring-2 ring-blue-500/20 my-6' : ''}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Accordion Header */}
                        <button 
                          onClick={() => toggleAccordion(service.id)}
                          className={`w-full text-right p-5 sm:p-6 flex items-center justify-between focus:outline-none transition-colors ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="flex items-center text-blue-700 font-black text-lg mb-2 sm:mb-0 sm:ml-8">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center ml-3 text-blue-600">
                                <Calendar size={20} />
                              </div>
                              {formatDate(service.serviceDate)}
                            </div>
                            
                            <div className="flex items-center text-slate-600 font-bold bg-slate-100/80 px-4 py-2 rounded-xl">
                              <Hash size={18} className="ml-2 text-slate-400" />
                              العداد: {service.currentMileage.toLocaleString()} كم
                            </div>
                          </div>
                          
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                            <ChevronDown size={24} />
                          </div>
                        </button>
                        
                        {/* Accordion Body */}
                        <div 
                          className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-6 pt-2 border-t border-slate-100 bg-gradient-to-b from-blue-50/30 to-transparent">
                              <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center">
                                  <PenTool size={16} className="ml-2" /> 
                                  الخدمات المقدمة:
                                </h4>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                                  {service.serviceDescription}
                                </p>
                              </div>
                              
                              {service.nextServiceMileage && (
                                <div className="inline-flex items-center bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 ml-3 mt-3 sm:mt-0">
                                  <span className="text-indigo-400 font-medium mr-1 text-sm ml-3">موعد الزيت القادم: </span>
                                  <span className="font-black text-indigo-700 text-lg flex items-center">
                                    {service.nextServiceMileage.toLocaleString()} كم
                                  </span>
                                </div>
                              )}
                              
                              {service.invoiceNumber && (
                                <div className="inline-flex items-center bg-green-50 border border-green-100 rounded-xl px-5 py-3 mt-3 sm:mt-0">
                                  <FileText size={18} className="text-green-500 ml-2" />
                                  <span className="text-green-600 font-medium mr-1 text-sm ml-3">رقم الفاتورة: </span>
                                  <span className="font-black text-green-700 text-lg">
                                    {service.invoiceNumber}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
