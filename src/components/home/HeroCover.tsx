"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/hero/hero1.png",
    title: "تجربة تقنية متكاملة",
    description: "منتجات أصلية من أشهر العلامات التجارية مع ضمان وجودة تستحقها اكتشف عروض حصرية وتوصيل سريع.",
    buttonText: "تسوق الآن",
    buttonLink: "/",
  },
  {
    id: 2,
    image: "/images/hero/hero2.png",
    title: "تجربة تقنية متكاملة",
    description: "منتجات أصلية من أشهر العلامات التجارية مع ضمان وجودة تستحقها اكتشف عروض حصرية وتوصيل سريع.",
    buttonText: "تسوق الآن",
    buttonLink: "/",
  },
  {
    id: 3,
    image: "/images/hero/hero1.png",
    title: "تجربة تقنية متكاملة",
    description: "منتجات أصلية من أشهر العلامات التجارية مع ضمان وجودة تستحقها اكتشف عروض حصرية وتوصيل سريع.",
    buttonText: "تسوق الآن",
    buttonLink: "/",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setImageLoaded(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setImageLoaded(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setImageLoaded(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative w-full h-[70vh]  overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image Container with better quality */}
            <div className="relative w-full h-full">
              {/* Skeleton loader while image loads */}
              {!imageLoaded && index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse z-5" />
              )}
              
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                loading="eager"
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                priority={index === 0}
                quality={100} // زيادة جودة الصورة لأقصى درجة
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                onLoadingComplete={() => {
                  if (index === currentSlide) {
                    setImageLoaded(true);
                  }
                }}
                  style={{
                  objectPosition: "center top", // هذا يرفع الصورة للأعلى (يظهر الجزء العلوي من الصورة)
                  // objectPosition: "center bottom", // استخدم هذا لتنزيل الصورة للأسفل
                  // objectPosition: "center center", // استخدم هذا لتوسيط الصورة
                }}
              />
              
              {/* تحسين حدة الصورة على الشاشات الكبيرة */}
              <style jsx>{`
                @media (min-width: 1280px) {
                  img {
                    image-rendering: crisp-edges;
                    image-rendering: -webkit-optimize-contrast;
                  }
                }
              `}</style>
            </div>

            {/* Content - Adjusted position to be higher */}
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
                      backgroundColor: '#08B2A7',
                      width: '160px',
                      height: '48px',
                    }}
                  >
                    <Link href={slide.buttonLink} className="flex items-center justify-center gap-2">
                      {slide.buttonText}
                      <FaArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
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

      {/* Dots Navigation */}
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
    </section>
  );
}