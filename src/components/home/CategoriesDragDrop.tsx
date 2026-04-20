"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "إلكترونيات",
    image: "/images/categories/cate1.png",
    href: "/categories/electronics",
  },
  {
    id: "2",
    name: "ملابس",
    image: "/images/categories/cate2.png",
    href: "/categories/clothing",
  },
  {
    id: "3",
    name: "أحذية",
    image: "/images/categories/cate3.png",
    href: "/categories/shoes",
  },
  {
    id: "4",
    name: "مستحضرات تجميل",
    image: "/images/categories/cate4.png",
    href: "/categories/beauty",
  },
  {
    id: "5",
    name: "منزل ومطبخ",
    image: "/images/categories/cate5.png",
    href: "/categories/home",
  },
  {
    id: "6",
    name: "رياضة",
    image: "/images/categories/cate1.png",
    href: "/categories/sports",
  },
  {
    id: "7",
    name: "إلكترونيات 2",
    image: "/images/categories/cate2.png",
    href: "/categories/electronics",
  },
  {
    id: "8",
    name: "ملابس 2",
    image: "/images/categories/cate3.png",
    href: "/categories/clothing",
  },
  {
    id: "9",
    name: "أحذية 2",
    image: "/images/categories/cate4.png",
    href: "/categories/shoes",
  },
  {
    id: "10",
    name: "تجميل 2",
    image: "/images/categories/cate5.png",
    href: "/categories/beauty",
  },
  {
    id: "11",
    name: "منزل 2",
    image: "/images/categories/cate1.png",
    href: "/categories/home",
  },
  {
    id: "12",
    name: "رياضة 2",
    image: "/images/categories/cate2.png",
    href: "/categories/sports",
  },
];

export function CategoriesDragDrop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(6);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(2); // Small screens: 2 items
      } else {
        setItemsPerView(6); // Desktop: 6 items
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalItems = initialCategories.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const goToNext = () => {
    if (isTransitioning) return;
    if (currentIndex < maxIndex) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  const visibleCategories = initialCategories.slice(currentIndex, currentIndex + itemsPerView);

  // Responsive grid classes
  const getGridClasses = () => {
    if (itemsPerView === 2) return "grid-cols-2";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom px-4 sm:px-6">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#112B40' }}>
            الأقسام
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative px-4 md:px-8 lg:px-12">
          {/* Navigation Buttons */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`hidden md:flex absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-[#2DA5F3] text-white rounded-full shadow-lg p-1.5 md:p-2 transition-all duration-300 hover:scale-110 ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
                style={{ border: '1px solid #e2e8f0' }}
                aria-label="السابق"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#ffffff' }} />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className={`hidden md:flex absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-[#2DA5F3] text-white rounded-full shadow-lg p-1.5 md:p-2 transition-all duration-300 hover:scale-110 ${
                  currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
                style={{ border: '1px solid #e2e8f0' }}
                aria-label="التالي"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#ffffff' }} />
              </button>
            </>
          )}

          {/* Slides */}
          <div
            ref={containerRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`transition-all duration-500 ease-in-out ${
                isTransitioning ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <div className={`grid ${getGridClasses()} gap-3 md:gap-4 lg:gap-6`}>
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    className="group transition-all duration-200 animate-in fade-in zoom-in duration-500"
                  >
                    <Link href={category.href}>
                      <div 
                        className="bg-white border-2 border-gray-200 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer w-full"
                        style={{ 
                          borderRadius: '4px',
                        }}
                      >
                        {/* Image Container - Fixed height issue */}
                        <div 
                          className="relative w-full"
                          style={{ 
                            aspectRatio: '1 / 1',
                            width: '100%'
                          }}
                        >
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>

                        {/* Category Name */}
                        <div className="p-2 md:p-3 text-center">
                          <h3 
                            className="text-xs sm:text-sm md:text-base font-semibold line-clamp-2"
                            style={{ color: '#112B40' }}
                          >
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {/* {maxIndex > 0 && (
          <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-6 md:w-8 h-1.5 md:h-2 bg-[#23A6F0]"
                    : "w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
}