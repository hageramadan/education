// components/CategoriesSection.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories, Category } from "@/services/api";

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // استخدام useCallback لتثبيت الدالة
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل التصنيفات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // لا توجد dependencies

  useEffect(() => {
    loadCategories();
  }, [loadCategories]); // إضافة loadCategories كـ dependency

  // توزيع التصنيفات على الـ grid حسب الترتيب المطلوب
  const getCategoryLayout = (index: number, category: Category) => {
    if (index === 0) return { colSpan: "lg:col-span-1", rowSpan: "" };
    if (index === 1) return { colSpan: "lg:col-span-2", rowSpan: "row-span-1" };
    if (index === 2) return { colSpan: "lg:col-span-1", rowSpan: "row-span-1" };
    if (index === 3) return { colSpan: "lg:col-span-2", rowSpan: "" };
    if (index === 4) return { colSpan: "lg:col-span-2", rowSpan: "" };
    return { colSpan: "lg:col-span-1", rowSpan: "" };
  };

  // بناء رابط الصورة الكامل
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/images/categories/placeholder.jpg";
    if (imagePath.startsWith('/storage')) {
      return `https://education.admin.t-carts.com${imagePath}`;
    }
    return imagePath;
  };

  if (loading) {
    return (
      <section className="py-8 container mx-auto px-4" style={{ minHeight: '816px' }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-[#112B40]">اختر حسب الفئة</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C092BD]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 container mx-auto px-4" style={{ minHeight: '816px' }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-[#112B40]">اختر حسب الفئة</h2>
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={loadCategories}
            className="mt-4 px-4 py-2 bg-[#C092BD] text-white rounded-md hover:bg-[#a880a6] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 container mx-auto px-4" style={{ minHeight: '816px' }}>
      <h2 className="text-3xl font-bold text-center mb-12 text-[#112B40]">اختر حسب الفئة</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 auto-rows-[400px]">
        {categories.slice(0, 5).map((category, index) => {
          const layout = getCategoryLayout(index, category);
          return (
            <Link 
              key={category.id}
              href={`/categories/${category.id}`} 
              className={`${layout.colSpan} ${layout.rowSpan} block group`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                <Image
                  src={getFullImageUrl(category.image)}
                  alt={category.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/categories/placeholder.jpg";
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold text-center transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}