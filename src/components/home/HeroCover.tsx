// components/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { fetchSliders, Slider } from "@/services/api";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // بناء رابط الصورة الكامل
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/images/hero/placeholder.jpg";
    if (imagePath.startsWith('/storage')) {
      return `https://education.admin.t-carts.com${imagePath}`;
    }
    return imagePath;
  };

  // جلب الـ sliders من الـ API
  useEffect(() => {
    const loadSliders = async () => {
      try {
        setLoading(true);
        const data = await fetchSliders();
        
        // تحويل البيانات إلى الصيغة المطلوبة للمكون
        const formattedSlides: Slide[] = data.map(slider => ({
          id: slider.id,
          image: getFullImageUrl(slider.image),
          title: slider.name || "تجربة تقنية متكاملة",
          description: slider.description?.replace(/\n/g, ' ') || "منتجات أصلية من أشهر العلامات التجارية مع ضمان وجودة تستحقها اكتشف عروض حصرية وتوصيل سريع.",
          buttonText: "تسوق الآن",
          buttonLink: slider.link || "/",
        }));
        
        setSlides(formattedSlides);
        setError(null);
      } catch (err) {
        console.error("Failed to load sliders:", err);
        setError("حدث خطأ في تحميل العروض");
      } finally {
        setLoading(false);
      }
    };

    loadSliders();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToNextSlide = () => {
    if (slides.length === 0) return;
    const nextSlide = (currentSlide + 1) % slides.length;
    setIsAutoPlaying(false);
    setCurrentSlide(nextSlide);
    setLoadedImages((prev) => ({ ...prev, [nextSlide]: false }));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevSlide = () => {
    if (slides.length === 0) return;
    const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
    setIsAutoPlaying(false);
    setCurrentSlide(prevSlide);
    setLoadedImages((prev) => ({ ...prev, [prevSlide]: false }));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setLoadedImages((prev) => ({ ...prev, [index]: false }));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleImageLoad = (slideId: number) => {
    setLoadedImages((prev) => ({ ...prev, [slideId]: true }));
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <section className="relative w-full h-[70vh] overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C092BD]"></div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error || slides.length === 0) {
    return (
      <section className="relative w-full h-[70vh] overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error || "لا توجد عروض حالياً"}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#C092BD] hover:bg-[#a880a6]"
          >
            إعادة المحاولة
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isCurrentSlide = index === currentSlide;
          const isImageLoaded = loadedImages[slide.id] || false;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full">
                {/* Skeleton loader */}
                {!isImageLoaded && isCurrentSlide && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse z-5" />
                )}

                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  loading="eager"
                  className={`object-cover transition-opacity duration-500 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  priority={index === 0}
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  onLoad={() => handleImageLoad(slide.id)}
                  style={{
                    objectPosition: "center top",
                  }}
                />
              </div>

              <div className="absolute inset-0 z-20 flex items-start md:items-center pt-20 md:pt-0">
                <div className="container-custom px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#110322]">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-5xl lg:text-[58px] font-bold mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-[#110322] mt-3 md:mt-5 text-base md:text-lg lg:text-[20px] mb-6 md:mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 leading-relaxed">
                      {slide.description}
                    </p>
                    <Button
                      asChild
                      className="animate-in text-white text-[14px] md:text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                      style={{
                        backgroundColor: "#08B2A7",
                        width: "160px",
                        height: "48px",
                      }}
                    >
                      <Link
                        href={slide.buttonLink}
                        className="flex items-center justify-center gap-2"
                      >
                        {slide.buttonText}
                        <FaArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* أزرار التنقل - تظهر فقط عند وجود أكثر من شريحة واحدة */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </button>

          <button
            onClick={goToNextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-2 bg-[#C092BD]"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}