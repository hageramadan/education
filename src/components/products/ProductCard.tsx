"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  originalPrice?: number;
  discount?: number;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  href,
  originalPrice,
  discount 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Quick view:", id);
  };

  return (
    <div
      role="article"
      aria-labelledby={`product-name-${id}`}
      className="group w-full max-w-[340px] sm:max-w-[350px] md:max-w-[308px] lg:max-w-[308px] mx-auto h-auto relative bg-white transition-all duration-500 ease-out hover:shadow-2xl"
      style={{
        borderRadius: '16px',
        border: '1px solid #E4E7E9',
        padding: '0 0px 16px 0',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0px)',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block h-full" aria-label={`عرض تفاصيل ${name}`}>
        {/* Image Container */}
        <div 
          className="relative mx-auto transition-all duration-500 w-full"
          style={{
            borderRadius: '5px',
          }}
        >
          {/* Heart Icon - Top Left Corner */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-1 left-2 z-10 rounded-full p-1.5 bg-white shadow hover:bg-red-50 transition-all duration-200 hover:scale-110"
            style={{ color: isFavorite ? '#ef4444' : '#112B40' }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            aria-pressed={isFavorite}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill={isFavorite ? '#ef4444' : 'none'} />
          </button>
          
          {/* Best Seller Badge */}
          <div className="absolute top-2 right-2 z-10">
            <p className="text-[9px] sm:text-xs font-bold text-white bg-[#08B2A7] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              الاكثر مبيعا
            </p>
          </div>

          {/* Image with scale effect on hover */}
          <div className="overflow-hidden rounded-t-lg">
            <Image
              src={image}
              alt={name}
              width={340}
              height={340}
              className="object-cover w-full h-auto aspect-square transition-transform duration-500 ease-out group-hover:scale-105"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </div>
        </div>

        {/* Product Info with slide up effect */}
        <div 
          className="px-2 sm:px-3 flex flex-col gap-1 sm:gap-2 mt-2 transition-all duration-500 ease-out"
          style={{
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
          }}
        >
          {/* Rating Section */}
          <div className="flex gap-1 items-center mb-1 flex-wrap">
            <p className="text-[#77878F] text-[10px] sm:text-xs md:text-sm">(994)</p>
            <div className="flex gap-0.5">
              <FaRegStar className="text-[#77878F] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"/>
              <FaStar className="text-[#FA8232] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <FaStar className="text-[#FA8232] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <FaStar className="text-[#FA8232] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <FaStar className="text-[#FA8232] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="text-[11px] sm:text-[13px] md:text-[14px] font-medium line-clamp-2 mb-1" style={{ color: '#112B40' }}>
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm sm:text-base md:text-[17px] font-semibold" style={{ color: '#08B2A7' }}>
              {price.toLocaleString()} <span className="text-[10px] sm:text-xs md:text-[12px] font-semibold">EGP</span>
            </span>
          </div>
          
          {/* Add to cart button */}
          <div
            style={{
              opacity: isHovered ? 1 : 0.9,
              transition: 'opacity 0.3s ease 0.1s',
            }}
          >
            <Button
              onClick={handleAddToCart}
              className="w-full text-[11px] sm:text-[14px] md:text-[16px] font-semibold rounded-[24px] bg-[#C092BD] hover:bg-[#8C6D8A] transition-all duration-300 text-white py-1.5 sm:py-2 md:py-2.5 px-4 border-2 border-[#C092BD] hover:border-[#8C6D8A] flex items-center justify-center gap-2 hover:scale-[1.02] h-auto"  
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span>إضافة إلى السلة</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Example usage with multiple products
export function ProductsGrid() {
  const products = [
    {
      id: "1",
      name: "سماعات لاسلكية عالية الجودة مع قاعدة شحن",
      price: 360,
      originalPrice: 35000,
      discount: 28,
      image: "/images/products/pro1.png",
      href: "/",
    },
    {
      id: "2",
      name: "ساعة ذكية رياضية",
      price: 360,
      image: "/images/products/pro2.png",
      href: "/",
    },
    {
      id: "3",
      name: "حقيبة ظهر عصرية",
      price: 360,
      originalPrice: 60000,
      discount: 25,
      image: "/images/products/pro3.png",
      href: "/",
    },
    {
      id: "4",
      name: "سماعة ألعاب احترافية",
      price: 360,
      image: "/images/products/pro4.png",
      href: "/",
    },
  ];

  return (
    <section className="py-4 sm:py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#112B40' }}>
          منتجات مميزة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}