// components/AdsHome.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import Image from 'next/image'
import { fetchAds, AdPopup, getFullImageUrl } from '@/services/api'

export function AdsHome() {
  const [adData, setAdData] = useState<AdPopup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Countdown timer state - سيتم تحديثه بناءً على تاريخ انتهاء الإعلان
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // جلب بيانات الإعلان
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const ads = await fetchAds();
      
      if (ads && ads.length > 0) {
        // أخذ أول إعلان نشط
        setAdData(ads[0]);
        
        // حساب الوقت المتبقي حتى تاريخ انتهاء الإعلان (مثال: إضافة 7 أيام من تاريخ الإنشاء)
        if (ads[0].created_at) {
          const endDate = new Date(ads[0].created_at);
          endDate.setDate(endDate.getDate() + 7); // إضافة 7 أيام صلاحية للإعلان
          startCountdown(endDate);
        }
      } else {
        setError("لا توجد إعلانات حالياً");
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load ads:", err);
      setError("حدث خطأ في تحميل الإعلان");
    } finally {
      setLoading(false);
    }
  };

  // بدء العد التنازلي
  const startCountdown = (targetDate: Date) => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        // إذا انتهى الوقت
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // تحديث فوراً
    updateCountdown();
    
    // تحديث كل ثانية
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  };

  // Format numbers to always show 2 digits
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  // عرض حالة التحميل
  if (loading) {
    return (
      <section className="bg-[#FDF2F8] py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C092BD]"></div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error || !adData) {
    return (
      <section className="bg-[#FDF2F8] py-12">
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error || "لا توجد إعلانات حالياً"}</p>
          <Button 
            onClick={loadAds}
            className="bg-[#C092BD] hover:bg-[#a880a6] text-white"
          >
            إعادة المحاولة
          </Button>
        </div>
      </section>
    );
  }

  // استخراج بيانات الإعلان
  const discountText = adData.sub_title || "خصم مميز";
  const offerTitle = adData.name || "لفترة محدودة";
  const description = adData.description || "لا تفوت الفرصة";
  const buttonLink = adData.link || "/products";
  const adImage = adData.image ? getFullImageUrl(adData.image) : "/images/advs.png";

  return (
    <section className="bg-[#FDF2F8]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        
        {/* Left Content */}
        <div className="flex px-4 pb-5 sm:ps-[2%] md:ps-[4%] lg:ps-[10%] xl:ps-[13%] mx-auto flex-col gap-2 md:gap-[22px] w-full md:w-1/2 order-2 md:order-1">
          
          {/* Limited offer badge */}
          <p className="text-[12px] md:text-[16px] font-semibold py-1 px-3 text-[#BE4646]">
            {offerTitle}
          </p>
          
          {/* Discount badge */}
          <div className="flex items-center gap-3">
            <p className="text-[20px] md:text-[32px] font-bold py-1 px-3 text-[#191C1F] w-fit rounded-md">
              {discountText}
            </p>
          </div>
          
          <p className="text-sm md:text-[22px] text-[#191C1F] w-full md:w-[80%] leading-[1.5]">
            {description}
          </p>
          
          {/* Countdown Timer - يظهر فقط إذا كان هناك وقت متبقي */}
          {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
            <div className="mt-4">
              <p className="text-sm md:text-base text-gray-600 mb-3">سينتهي الخصم خلال</p>
              <div className="flex gap-3 md:gap-5">
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-2 py-1 md:px-4 md:py-2 min-w-[50px] md:min-w-[70px]">
                    <span className="text-xl md:text-3xl font-bold">{formatNumber(timeLeft.days)}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">أيام</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-2 py-1 md:px-4 md:py-2 min-w-[50px] md:min-w-[70px]">
                    <span className="text-xl md:text-3xl font-bold">{formatNumber(timeLeft.hours)}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">ساعات</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-2 py-1 md:px-4 md:py-2 min-w-[50px] md:min-w-[70px]">
                    <span className="text-xl md:text-3xl font-bold">{formatNumber(timeLeft.minutes)}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">دقائق</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-2 py-1 md:px-4 md:py-2 min-w-[50px] md:min-w-[70px]">
                    <span className="text-xl md:text-3xl font-bold">{formatNumber(timeLeft.seconds)}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">ثواني</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Shop Button */}
          <Button
            asChild
            aria-label='buy now'
            className="w-full md:w-[180px] md:h-[60px] animate-in text-[12px] md:text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl mt-4"
            style={{ backgroundColor: '#08B2A7' }}
          >
            <Link href={buttonLink} className="flex items-center justify-center gap-2 text-white">
              تسوق الان
              <FaArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Right Image */}
        <div className="w-full md:w-1/2 md:ps-30 order-1 md:order-2">
          <Image 
            src={adImage} 
            alt={offerTitle} 
            className="w-full h-auto md:w-[100%] md:h-[532px] object-cover" 
            width={500} 
            height={300} 
            priority
            onError={(e) => {
              // في حال فشل تحميل الصورة، استخدم الصورة الافتراضية
              const target = e.target as HTMLImageElement;
              target.src = "/images/advs.png";
            }}
          />
        </div>
        
      </div>
    </section>
  );
}