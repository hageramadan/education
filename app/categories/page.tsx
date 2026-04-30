// app/categories/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories, Category } from "@/services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/images/placeholder.jpg";
    if (imagePath.startsWith('/storage')) {
      return `https://education.admin.t-carts.com${imagePath}`;
    }
    return imagePath;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C092BD]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-[#112B40]">جميع التصنيفات</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/categories/${category.id}`}
            className="group block"
          >
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <Image
                src={getFullImageUrl(category.image)}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 right-4 text-white text-xl font-bold">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}