// components/AdsHome.tsx

'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { getAds, getFullImageUrl } from '@/services/api'
import { useLanguage } from '@/contexts/LanguageContext'

export interface AdPopup {
  id: number;
  sub_title: string;
  name: string;
  description: string;
  link: string | null;
  image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  type_label?: string;
}

interface AdsHomeProps {
  onLoad?: () => void;
}

const getTranslations = (lang: string) => {
  if (lang === 'en') {
    return {
      loading: "Loading...",
      shopNow: "Get the Offer",
      expiresIn: "Expires in",
      days: "D",
      hours: "H",
      minutes: "M",
      seconds: "S",
      offerExpired: "Offer expired",
      limitedOffer: "Limited Offer",
      dontMiss: "Don't miss the opportunity",
    };
  }
  return {
    loading: "جاري التحميل...",
    shopNow: "تسوق الان",
    expiresIn: "سينتهي الخصم خلال",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثواني",
    offerExpired: "انتهى العرض",
    limitedOffer: "لفترة محدودة",
    dontMiss: "لا تفوت الفرصة",
  };
};

export function AdsHome({ onLoad }: AdsHomeProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  const [isClient, setIsClient] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!loading && !isDataLoaded && onLoad) {
      setIsDataLoaded(true);
      onLoad();
    }
  }, [loading, isDataLoaded, onLoad]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadAds = async () => {
      setLoading(true);
      const data = await getAds();
      setAds(data);
      setLoading(false);
    };
    loadAds();
  }, []);

  const activeAd = ads.find(ad => ad.is_active === 1) || ads[0];

  useEffect(() => {
    if (!activeAd) return;

    const endDateStr = activeAd.end_date;
    const calculateTimeLeft = (end: Date) => {
      const now = new Date();
      const difference = end.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };    
    if (!endDateStr) {
      const fallbackDate = new Date(activeAd.created_at);
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      calculateTimeLeft(fallbackDate);
      
      const timer = setInterval(() => {
        calculateTimeLeft(fallbackDate);
      }, 1000);
      
      return () => clearInterval(timer);
    }

    const endDate = new Date(endDateStr);
    
    if (isNaN(endDate.getTime())) {
      console.error('Invalid end_date:', endDateStr);
      return;
    }

    calculateTimeLeft(endDate);
    
    const timer = setInterval(() => {
      calculateTimeLeft(endDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAd]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  if (loading) {
    return (
      <section className="bg-[#FDF2F8] py-8 md:py-12">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#C092BD]"></div>
        </div>
      </section>
    );
  }

  if (!isClient) {
    return (
      <section className="bg-[#FDF2F8] py-8 md:py-12">
        <div className="min-h-[200px]"></div>
      </section>
    );
  }

  if (!activeAd || isExpired) {
    if (!isDataLoaded && onLoad) {
      setIsDataLoaded(true);
      onLoad();
    }
    return null;
  }

  const adImageUrl = getFullImageUrl(activeAd.image);
  const hasTimer = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  return (
    <section className="bg-[#FDF2F8] mb-4 md:mb-20 my-6 md:my-12 px-3 md:px-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10">
        
        {/* Left Content - يظهر أولاً على الموبايل */}
        <div className="flex px-3 md:px-4 pb-4 md:pb-5 md:ps-[4%] lg:ps-[10%] xl:ps-[13%] flex-col gap-2 md:gap-[5px] w-full md:w-1/2 order-2 md:order-1">
          
          {/* Limited offer badge */}
          <p className="text-[10px] md:text-[16px] font-semibold py-1 px-2 md:px-3 text-[#BE4646]">
            {activeAd.name || t.limitedOffer}
          </p>
          
          {/* Discount badge */}
          <div className="flex items-center gap-2 md:gap-3">
            <p className="text-[18px] md:text-[32px] font-bold py-1 px-2 md:px-3 text-[#191C1F] w-fit rounded-md">
              {activeAd.sub_title}
            </p>
          </div>
          
          <p className="text-xs md:text-[22px] text-[#191C1F] w-full md:w-[80%] leading-[1.5] line-clamp-3 md:line-clamp-none">
            {activeAd.description || t.dontMiss}
          </p>
          
          {/* Countdown Timer - مُحسَّن للموبايل */}
          {hasTimer && (
            <div className="mt-2 md:mt-4">
              <p className="text-[10px] md:text-base text-gray-600 mb-2 md:mb-3">{t.expiresIn}</p>
              <div className="flex gap-2 md:gap-5">
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-1.5 py-1 md:px-4 md:py-2 min-w-[35px] md:min-w-[70px]">
                    <span className="text-base md:text-3xl font-bold">{formatNumber(timeLeft.days)}</span>
                  </div>
                  <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{t.days}</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-1.5 py-1 md:px-4 md:py-2 min-w-[35px] md:min-w-[70px]">
                    <span className="text-base md:text-3xl font-bold">{formatNumber(timeLeft.hours)}</span>
                  </div>
                  <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{t.hours}</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-1.5 py-1 md:px-4 md:py-2 min-w-[35px] md:min-w-[70px]">
                    <span className="text-base md:text-3xl font-bold">{formatNumber(timeLeft.minutes)}</span>
                  </div>
                  <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{t.minutes}</p>
                </div>
                <div className="text-center">
                  <div className="bg-white text-[#191C1F] rounded-lg px-1.5 py-1 md:px-4 md:py-2 min-w-[35px] md:min-w-[70px]">
                    <span className="text-base md:text-3xl font-bold">{formatNumber(timeLeft.seconds)}</span>
                  </div>
                  <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{t.seconds}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Shop Button - عرض كامل على الموبايل */}
          <Button
            asChild
            aria-label='buy now'
            className="w-full md:w-[180px] md:h-[60px] animate-in text-sm md:text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl mt-3 md:mt-4"
            style={{ backgroundColor: '#08B2A7' }}
          >
            <Link href={activeAd.link || '/products'} className="flex items-center justify-center gap-2 text-white py-3 md:py-0">
              {t.shopNow}
            </Link>
          </Button>
        </div>
        
        {/* Right Image - صورة متجاوبة بالكامل */}
        <div className="w-full md:w-1/2 md:ps-30 order-1 md:order-2">
          <div className="relative w-full aspect-[16/10] md:aspect-auto md:h-[432px]">
            <Image 
              src={adImageUrl} 
              alt={activeAd.name || "Advertisement"} 
              className="w-full h-full object-cover rounded-lg md:rounded-none" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/advs.png";
              }}
            />
          </div>
        </div>
        
      </div>
    </section>
  )
}