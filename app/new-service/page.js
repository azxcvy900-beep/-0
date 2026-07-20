"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addServiceRecord, getCustomerNameByPhone } from "@/lib/db";
import { ArrowRight, Save, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewService() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [phone, setPhone] = useState(searchParams.get('phone') || "");
  const [customerName, setCustomerName] = useState(searchParams.get('name') || "");
  const [plate, setPlate] = useState(searchParams.get('plate') || "");
  const [description, setDescription] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [oilLifespan, setOilLifespan] = useState("");
  
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
    const serviceData = { serviceDescription: description, currentMileage, oilLifespan };

    const result = await addServiceRecord(vehicleData, serviceData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/search?q=" + plate); // redirect to search results of this car
      }, 1500);
    } else {
      alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-slate-50" dir="rtl">
        <CheckCircle2 size={80} className="text-green-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-800">تم حفظ الصيانة بنجاح!</h2>
        <p className="text-slate-500 mt-2">جاري تحويلك لسجل السيارة...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50" dir="rtl">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowRight size={24} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mr-4">صيانة جديدة</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          
          <div className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">رقم الجوال <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                required
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">
                اسم العميل
                {isFetchingName && <Loader2 size={16} className="inline animate-spin mr-2 text-blue-500" />}
              </label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اختياري"
                className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
              />
            </div>

            {/* License Plate */}
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">رقم اللوحة <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="مثال: أ ب ت 1234"
                className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                required
              />
            </div>

            <hr className="border-slate-100 my-6" />

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">تفاصيل الصيانة <span className="text-red-500">*</span></label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب تفاصيل الخدمة والقطع التي تم تغييرها..."
                className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 h-32 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Current Mileage */}
              <div>
                <label className="block text-lg font-medium text-slate-700 mb-2">العداد الحالي <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={currentMileage}
                  onChange={(e) => setCurrentMileage(e.target.value)}
                  placeholder="كم"
                  className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                  required
                />
              </div>

              {/* Oil Lifespan */}
              <div>
                <label className="block text-lg font-medium text-slate-700 mb-2">ممشى الزيت القادم</label>
                <input 
                  type="number" 
                  value={oilLifespan}
                  onChange={(e) => setOilLifespan(e.target.value)}
                  placeholder="مثال: 5000 (اختياري)"
                  className="w-full text-lg p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                />
              </div>
            </div>
            
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:bg-blue-800 text-white text-xl font-bold p-5 rounded-2xl flex items-center justify-center transition-all shadow-md"
          >
            {isSubmitting ? (
              <Loader2 size={28} className="animate-spin" />
            ) : (
              <>
                <Save size={28} className="ml-2" />
                حفظ الخدمة
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
