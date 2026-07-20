"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addServiceRecord, getCustomerNameByPhone } from "@/lib/db";
import { ArrowRight, Save, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function NewServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [phone, setPhone] = useState(searchParams.get('phone') || "");
  const [customerName, setCustomerName] = useState(searchParams.get('name') || "");
  const [plate, setPlate] = useState(searchParams.get('plate') || "");
  const [description, setDescription] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [oilLifespan, setOilLifespan] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  
  const [isFetchingName, setIsFetchingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-fetch customer name by phone
  useEffect(() => {
    const fetchName = async () => {
      if (phone.length >= 9) { // Assume min length for phone
        setIsFetchingName(true);
        const name = await getCustomerNameByPhone(phone);
        if (name && !customerName) {
          setCustomerName(name);
        }
        setIsFetchingName(false);
      }
    };
    
    // Debounce fetch slightly
    const timeoutId = setTimeout(() => {
      fetchName();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !plate || !description || !currentMileage) {
      alert("الرجاء تعبئة الحقول الإجبارية");
      return;
    }

    setIsSubmitting(true);
    const vehicleData = { phoneNumber: phone, customerName, licensePlate: plate };
    const serviceData = { serviceDescription: description, currentMileage, oilLifespan, invoiceNumber };

    const result = await addServiceRecord(vehicleData, serviceData);
    
    if (result.success) {
      setSuccess(true);
      // Removed auto-redirect so the user can send WhatsApp msg
    } else {
      alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    // Format phone number to international format for WhatsApp (assuming Saudi Arabia 966)
    let formattedPhone = phone;
    if (phone.startsWith('05')) {
      formattedPhone = '966' + phone.substring(1);
    } else if (!phone.startsWith('966') && !phone.startsWith('+')) {
      formattedPhone = '966' + phone;
    }
    
    // WhatsApp Message Template
    const whatsappMessage = `أهلاً بك ${customerName ? 'أستاذ/ة ' + customerName : 'عميلنا العزيز'} في مركز الخير برو 🛠️\nسعدنا بزيارتك لنا وثقتك بنا لصيانة سيارتك ذات اللوحة (${plate}). 🚗\n\nلقد أصبحت الآن من عملائنا المميزين، ولأننا نهتم بك وبمركبتك، نسعى دائماً لتقديم أفضل خدمة لضمان سلامتك وراحتك على الطريق. ✨\nلأي استفسار، نحن دائماً في خدمتك!`;
    const whatsappUrl = `https://wa.me/${formattedPhone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden" dir="rtl">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 flex flex-col items-center text-center animate-in zoom-in duration-500 relative z-10">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={50} className="text-green-500 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">تم الحفظ بنجاح!</h2>
          <p className="text-slate-500 font-medium mb-8">تم تسجيل بيانات الصيانة للسيارة {plate} في النظام.</p>
          
          <div className="w-full space-y-4">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-green-500/20 active:scale-95 text-lg"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="ml-3"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              إرسال رسالة ترحيبية
            </a>
            
            <button 
              onClick={() => router.push("/search?q=" + plate)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95 text-lg"
            >
              <ArrowRight size={20} className="ml-2" />
              الذهاب لسجل السيارة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8" dir="rtl">
      
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link href="/" className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-white transition-all hover:scale-105 active:scale-95">
            <ArrowRight size={24} />
          </Link>
          <div className="mr-5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">صيانة جديدة</h1>
            <p className="text-slate-500 mt-1 font-medium">تسجيل مركبة وعملية صيانة جديدة</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-white/50 relative overflow-hidden">
          
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">رقم الجوال <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full text-lg p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
                required
              />
            </div>

            {/* Customer Name */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                اسم العميل
                {isFetchingName && <Loader2 size={14} className="inline animate-spin mr-2 text-blue-500" />}
              </label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="الاسم (اختياري)"
                className="w-full text-lg p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
              />
            </div>

            {/* License Plate */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">رقم اللوحة <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="مثال: أ ب ت 1234"
                className="w-full text-lg p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
                required
              />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />

            {/* Invoice Number */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">رقم الفاتورة (اختياري)</label>
              <input 
                type="text" 
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="رقم الفاتورة الورقية أو النظامية..."
                className="w-full text-lg p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">تفاصيل الصيانة <span className="text-red-500">*</span></label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب تفاصيل الخدمة والقطع التي تم تغييرها..."
                className="w-full text-lg p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner h-32 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Current Mileage */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">العداد الحالي <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(e.target.value)}
                    placeholder="الرقم"
                    className="w-full text-lg p-4 pl-12 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">كم</span>
                </div>
              </div>

              {/* Oil Lifespan */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">ممشى الزيت القادم</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={oilLifespan}
                    onChange={(e) => setOilLifespan(e.target.value)}
                    placeholder="مثال: 5000"
                    className="w-full text-lg p-4 pl-12 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white shadow-inner"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">كم</span>
                </div>
              </div>
            </div>
            
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-10 relative group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-400 active:scale-[0.98] text-white text-xl font-bold p-5 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-500/30 overflow-hidden border border-blue-400/50"
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isSubmitting ? (
              <Loader2 size={28} className="animate-spin relative z-10" />
            ) : (
              <div className="flex items-center relative z-10 drop-shadow-md">
                <Save size={26} className="ml-2" />
                <span>حفظ الخدمة</span>
              </div>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function NewService() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>}>
      <NewServiceContent />
    </Suspense>
  );
}
