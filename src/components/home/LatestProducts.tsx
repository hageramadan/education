// components/LatestProducts2.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductCard } from "../products/ProductCard";
import { Button } from "../ui/button";
import { fetchNewProducts, calculateDiscountPercentage, getFullImageUrl } from "@/services/api";

interface FormattedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  originalPrice?: number;
  discount?: number;
}

export function LatestProducts() {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  // جلب المنتجات من الـ API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchNewProducts(1, 20);
      
      // التحقق من وجود products قبل محاولة map
      if (!data || !data.products || !Array.isArray(data.products)) {
        console.error("Invalid products data:", data);
        setProducts([]);
        setError("بيانات المنتجات غير صالحة");
        return;
      }
      
      // ✅ عرض أول 8 منتاجات فقط
      const firstEightProducts = data.products.slice(0, 8);
      
      const formattedProducts: FormattedProduct[] = firstEightProducts.map(product => {
        const originalPrice = product?.pricing?.price || 0;
        const finalPrice = product?.pricing?.final_price || 0;
        const discount = calculateDiscountPercentage(originalPrice, finalPrice);
        
        // التحقق من وجود صور
        const productImage = product?.images && product.images.length > 0 
          ? getFullImageUrl(product.images[0]) 
          : "/images/products/placeholder.jpg";
        
        return {
          id: product?.id?.toString() || Math.random().toString(),
          name: product?.name || "منتج بدون اسم",
          price: finalPrice,
          image: productImage,
          href: `/products/${product?.id || 0}`,
          originalPrice: product?.pricing?.has_discount ? originalPrice : undefined,
          discount: discount,
        };
      });
      
      setProducts(formattedProducts);
      setPagination({
        current_page: data?.pagination?.current_page || 1,
        last_page: data?.pagination?.last_page || 1,
        total: Math.min(data?.pagination?.total || 0, 8) // ✅ تحديث العدد الإجمالي ليكون 8 كحد أقصى
      });
      setError(null);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("حدث خطأ في تحميل المنتجات");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (pagination.current_page >= pagination.last_page) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = pagination.current_page + 1;
      const data = await fetchNewProducts(nextPage, 20);
      
      // التحقق من وجود products قبل محاولة map
      if (!data || !data.products || !Array.isArray(data.products)) {
        console.error("Invalid products data:", data);
        return;
      }
      
      // ✅ حساب عدد المنتجات المتبقية للوصول إلى 8 منتجات
      const remainingSlots = 8 - products.length;
      if (remainingSlots <= 0) return;
      
      // ✅ أخذ المنتجات المتبقية فقط
      const newProducts = data.products.slice(0, remainingSlots);
      
      const newFormattedProducts: FormattedProduct[] = newProducts.map(product => {
        const originalPrice = product?.pricing?.price || 0;
        const finalPrice = product?.pricing?.final_price || 0;
        const discount = calculateDiscountPercentage(originalPrice, finalPrice);
        
        const productImage = product?.images && product.images.length > 0 
          ? getFullImageUrl(product.images[0]) 
          : "/images/products/placeholder.jpg";
        
        return {
          id: product?.id?.toString() || Math.random().toString(),
          name: product?.name || "منتج بدون اسم",
          price: finalPrice,
          image: productImage,
          href: `/products/${product?.id || 0}`,
          originalPrice: product?.pricing?.has_discount ? originalPrice : undefined,
          discount: discount,
        };
      });
      
      setProducts(prev => [...prev, ...newFormattedProducts]);
      setPagination({
        current_page: data?.pagination?.current_page || nextPage,
        last_page: data?.pagination?.last_page || pagination.last_page,
        total: pagination.total
      });
    } catch (err) {
      console.error("Failed to load more products:", err);
      setError("حدث خطأ في تحميل المزيد من المنتجات");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ✅ عرض جميع المنتجات (الحد الأقصى 8)
  const visibleProducts = products.slice(0, 8);
  const hasMore = products.length < 8 && products.length < pagination.total;

  if (loading) {
    return (
      <section className="py-6 md:py-12 bg-white">
        <div className="container-custom">
          <div className="mb-2 md:mb-5 flex justify-between">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#112B40' }}>
              أحدث المنتجات
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C092BD]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 md:py-12 bg-white">
        <div className="container-custom">
          <div className="mb-2 md:mb-5 flex justify-between">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#112B40' }}>
              أحدث المنتجات
            </h2>
          </div>
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={loadProducts}
              className="bg-[#C092BD] hover:bg-[#a880a6] text-white"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="container-custom">
        <div className="mb-2 md:mb-5 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#112B40' }}>
            أحدث المنتجات
          </h2>
          {products.length > 0 && (
            <Link 
              href="/products/new" 
              className="text-[#08B2A7] text-[16px] font-bold hover:underline transition-all"
            >
              عرض المزيد
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-2 md:mb-5">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in zoom-in duration-500 w-full"
                  style={{ 
                    animationFillMode: 'both',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C092BD]"></div>
              </div>
            )}

            {hasMore && !isLoadingMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  className="group px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'white',
                    color: '#C092BD',
                    border: '2px solid #C092BD',
                    borderRadius: '12px'
                  }}
                >
                  عرض المزيد
                  <ChevronLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            )}

         
          </>
        )}
      </div>
    </section>
  );
}