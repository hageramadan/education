"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: 1, name: "كتب اطفال", image: "/images/categories/bg1.png", slug: "electronics" },
  { id: 2, name: "مستلزمات مدرسية", image: "/images/categories/bg2.png", slug: "fashion" },
  { id: 3, name: "كتب خارجية", image: "/images/categories/bg3.png", slug: "home" },
  { id: 4, name: " كتب خارجية", image: "/images/categories/bg4.png", slug: "beauty" },
  { id: 5, name: "ادوات تلوين", image: "/images/categories/bg5.png", slug: "shoes" },
];

export function CategoriesSection() {
  return (
    <section className="py-8 container mx-auto px-4" style={{ minHeight: '816px' }}>
      <h2 className="text-3xl font-bold text-center mb-12 text-[#112B40]">اختر حسب الفئة</h2>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 auto-rows-[400px]">
        
        {/* العنصر الأول: إلكترونيات */}
        <Link 
          href={`/categories/${categories[0].slug}`} 
          className="lg:col-span-1 block"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <Image
              src={categories[0].image}
              alt={categories[0].name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Overlay for better text visibility */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            
            {/* Category Name */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                {categories[0].name}
              </h3>
            </div>
          </div>
        </Link>

        {/* العنصر الثاني: ملابس (col-span-2) */}
        <Link 
          href={`/categories/${categories[1].slug}`} 
          className="lg:col-span-2 row-span-1 block"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <Image
              src={categories[1].image}
              alt={categories[1].name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                {categories[1].name}
              </h3>
            </div>
          </div>
        </Link>

        {/* العنصر الثالث: أجهزة منزلية */}
        <Link 
          href={`/categories/${categories[2].slug}`} 
          className="lg:col-span-1 row-span-1 block"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <Image
              src={categories[2].image}
              alt={categories[2].name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                {categories[2].name}
              </h3>
            </div>
          </div>
        </Link>

        {/* العنصر الرابع: مستحضرات تجميل (col-span-2) */}
        <Link 
          href={`/categories/${categories[3].slug}`} 
          className="lg:col-span-2 block"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <Image
              src={categories[3].image}
              alt={categories[3].name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                {categories[3].name}
              </h3>
            </div>
          </div>
        </Link>

        {/* العنصر الخامس: أحذية */}
        <Link 
          href={`/categories/${categories[4].slug}`} 
          className="lg:col-span-2 block"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <Image
              src={categories[4].image}
              alt={categories[4].name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                {categories[4].name}
              </h3>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}