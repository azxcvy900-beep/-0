"use client";

import { useState, useEffect } from "react";
import { getRemindersData } from "@/lib/db";
import { ArrowRight, Loader2, MessageCircle, ChevronDown, ChevronUp, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RemindersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('oneMonth'); // 'oneMonth', 'twoMonths', 'threeMonths'

  useEffect(() => {
    async function loadData() {
      const reminders = await getRemindersData();
      setData(reminders);
      setLoading(false);
    }
    loadData();
  }, []);

  const formatPhoneForWA = (phone) => {
    if (!phone) return "";
    let formatted = phone.replace(/\s+/g, '');
    if (formatted.startsWith('0')) {
      formatted = '966' + formatted.substring(1);
    }
    return formatted;
  };

  const generateWaLink = (item, periodText) => {
    const waPhone = formatPhoneForWA(item.vehicle.phoneNumber);
    const customerName = item.vehicle.customerName || "عميلنا العزيز";
    const nextMileage = item.latestService.nextServiceMileage 
      ? item.latestService.nextServiceMileage.toLocaleString() 
      : "غير مسجل";

    const message = `مرحباً *${customerName}*،
معك مركز الخير لخدمة السيارات. نتمنى لك دوام الصحة والسلامة. 🌹

نود تذكيرك بأنه قد مر *${periodText}* على آخر تغيير زيت لمركبتك ذات اللوحة (*${item.vehicle.licensePlate}*).
حرصاً منا على سلامتك وسلامة محرك سيارتك من الأعطال المكلفة، ننصحك بزيارتنا في أقرب وقت لتغيير الزيت.

ℹ️ *ملاحظة:* الممشى المفترض لتغيير الزيت القادم هو: *${nextMileage}* كم.

نسعد بخدمتكم دائماً في مركز الخير! 🛠️`;

    return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50" dir="rtl">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold text-xl">جاري تجميع بيانات العملاء...</p>
      </div>
    );
  }

  const sections = [
    {
      id: 'oneMonth',
      title: 'شهر واحد (1 - 30 يوم)',
      data: data?.oneMonth || [],
      color: 'blue',
      icon: <Clock size={24} className="text-blue-500" />,
      periodText: 'شهر واحد'
    },
    {
      id: 'twoMonths',
      title: 'شهران (31 - 60 يوم)',
      data: data?.twoMonths || [],
      color: 'orange',
      icon: <AlertTriangle size={24} className="text-orange-500" />,
      periodText: 'شهران'
    },
    {
      id: 'threeMonths',
      title: 'ثلاثة أشهر فأكثر (61+ يوم)',
      data: data?.threeMonths || [],
      color: 'red',
      icon: <ShieldCheck size={24} className="text-red-500" />,
      periodText: 'ثلاثة أشهر فأكثر'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-100/40 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-300/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-3xl mx-auto relative z-10 pb-20">
        
        {/* Header */}
        <div className="flex items-center mb-10 pt-4">
          <Link href="/" className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-orange-600 hover:bg-white transition-all hover:scale-105 active:scale-95">
            <ArrowRight size={24} />
          </Link>
          <div className="mr-5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">تذكير العملاء</h1>
            <p className="text-slate-500 mt-1 font-medium">نظام المتابعة الذكي للعملاء</p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const count = section.data.length;

            return (
              <div 
                key={section.id} 
                className={`bg-white/80 backdrop-blur-xl rounded-[2rem] border transition-all duration-300 overflow-hidden shadow-lg ${isExpanded ? `border-${section.color}-200 ring-4 ring-${section.color}-500/10 shadow-${section.color}-900/10 scale-[1.01]` : 'border-white/50 shadow-slate-200/50 hover:shadow-xl'}`}
              >
                {/* Accordion Header */}
                <button 
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className={`w-full p-6 sm:p-8 flex items-center justify-between focus:outline-none transition-colors ${isExpanded ? `bg-${section.color}-50/30` : 'hover:bg-slate-50/50'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-14 h-14 rounded-2xl bg-${section.color}-100 flex items-center justify-center ml-4 shadow-inner`}>
                      {section.icon}
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{section.title}</h2>
                      <p className="text-slate-500 font-medium">يوجد <span className={`text-${section.color}-600 font-bold`}>{count}</span> عملاء في هذه الفئة</p>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? `bg-${section.color}-100 text-${section.color}-600 rotate-180` : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                    <ChevronDown size={28} />
                  </div>
                </button>

                {/* Accordion Body */}
                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className={`p-6 pt-0 bg-gradient-to-b from-${section.color}-50/30 to-transparent`}>
                      {count === 0 ? (
                        <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                          <p className="text-slate-500 font-medium text-lg">لا يوجد عملاء في هذه الفئة حالياً 🎉</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.data.map((item) => (
                            <div key={item.vehicle.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between group">
                              <div className="mb-4 sm:mb-0">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{item.vehicle.customerName || "عميل غير مسجل الاسم"}</h3>
                                <div className="flex items-center space-x-4 space-x-reverse text-sm font-medium text-slate-500">
                                  <span className="bg-slate-100 px-3 py-1 rounded-lg">{item.vehicle.licensePlate}</span>
                                  <span className={`text-${section.color}-600 bg-${section.color}-50 px-3 py-1 rounded-lg`}>منذ {item.daysPassed} يوم</span>
                                </div>
                              </div>
                              <a 
                                href={generateWaLink(item, section.periodText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
                              >
                                <MessageCircle size={20} className="ml-2" />
                                إرسال تذكير
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
