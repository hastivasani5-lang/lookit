"use client";
import React from "react";
import ProductCard from "./ProductCard";
import products from "./products.json";

export default function ProductGrid({ items }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
        {(items || products).map(product => (
          <li key={product.id} className="flex">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
