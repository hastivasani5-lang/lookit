"use client";
import React, { useEffect, useRef, useState } from "react";
import ShopProductCard from "./ShopProductCard";

interface ShopProductGridProps {
  items: Array<{
    id: number;
    title: string;
    description: string;
    price: string;
    badge: string;
    category?: string;
  }>;
}

const PAGE_SIZE = 6;

const ShopProductGrid: React.FC<ShopProductGridProps> = ({ items }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loader = useRef<HTMLDivElement>(null);

  // Infinite scroll effect
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [items.length]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, visibleCount).map((item, idx) => (
          <ShopProductCard key={item.id} item={item} idx={idx} />
        ))}
      </div>
      {visibleCount < items.length && (
        <div ref={loader} className="flex justify-center py-6">
          <span className="text-gray-400">Loading more...</span>
        </div>
      )}
    </>
  );
};

export default ShopProductGrid;
