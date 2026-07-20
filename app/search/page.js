"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchVehicles } from "@/lib/db";
import { ArrowRight, Search as SearchIcon, Plus, ChevronDown, ChevronUp, Loader2, Calendar, PenTool, Hash } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowRight size={24} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mr-4">بحث السجلات</h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ابحث برقم الجوال أو اللوحة..."
            className="flex-1 text-lg p-3 outline-none bg-transparent"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center justify-center transition-colors"
          >
            {isSearching ? <Loader2 size={24} className="animate-spin" /> : <SearchIcon size={24} />}
          </button>
        </div>

        {/* Results */}
        {hasSearched && !isSearching && !result && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 text-lg mb-4">لم يتم العثور على أي مركبة بهذا الرقم.</p>
            <Link 
              href={`/new-service?phone=${searchTerm}`}
              className="inline-flex items-center text-blue-600 font-bold hover:underline text-lg"
            >
              <Plus size={20} className="ml-1" />
              إضافة مركبة جديدة
            </Link>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            
            {/* Customer Info Card */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  {result.vehicle.customerName || "عميل بدون اسم"}
                </h2>
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-x-reverse text-slate-600">
                  <span className="flex items-center mt-1">
                    <span className="font-medium mr-1 text-slate-500">الجوال:</span> {result.vehicle.phoneNumber}
                  </span>
                  <span className="flex items-center mt-1">
                    <span className="font-medium mr-1 text-slate-500">اللوحة:</span> {result.vehicle.licensePlate}
                  </span>
                </div>
              </div>
              
              <Link 
                href={`/new-service?phone=${result.vehicle.phoneNumber}&name=${result.vehicle.customerName || ''}&plate=${result.vehicle.licensePlate}`}
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus size={20} className="ml-2" />
                صيانة جديدة لهذه السيارة
              </Link>
            </div>

            {/* Service History */}
            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">سجل الصيانة ({result.services.length})</h3>
            
            <div className="space-y-4">
              {result.services.length === 0 ? (
                <p className="text-slate-500">لا يوجد سجل صيانة سابق لهذه السيارة.</p>
              ) : (
                result.services.map((service) => {
                  const isExpanded = expandedService === service.id;
                  
                  return (
                    <div 
                      key={service.id} 
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? 'border-blue-300' : 'border-slate-200'}`}
                    >
                      {/* Accordion Header */}
                      <button 
                        onClick={() => toggleAccordion(service.id)}
                        className="w-full text-right p-5 flex items-center justify-between focus:outline-none"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="flex items-center text-blue-700 font-bold text-lg mb-2 sm:mb-0 sm:ml-6">
                            <Calendar size={20} className="ml-2" />
                            {formatDate(service.serviceDate)}
                          </div>
                          
                          <div className="flex items-center text-slate-600 font-medium">
                            <Hash size={18} className="ml-1 text-slate-400" />
                            العداد: {service.currentMileage.toLocaleString()} كم
                          </div>
                        </div>
                        
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>
                      </button>
                      
                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50">
                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-slate-500 mb-2 flex items-center">
                              <PenTool size={16} className="ml-1" /> تفاصيل الصيانة:
                            </h4>
                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                              {service.serviceDescription}
                            </p>
                          </div>
                          
                          {service.nextServiceMileage && (
                            <div className="inline-block bg-white border border-slate-200 rounded-lg px-4 py-2">
                              <span className="text-slate-500 text-sm">ممشى الصيانة القادمة: </span>
                              <span className="font-bold text-blue-600">{service.nextServiceMileage.toLocaleString()} كم</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
