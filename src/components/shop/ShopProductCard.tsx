import React from "react";
import Link from "next/link";

// You can swap this for a real star icon if you want
const Star = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" className="inline text-yellow-400 mr-1">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

interface ShopProductCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    price: string;
    badge: string;
    category?: string;
    oldPrice?: string;
  };
  idx: number;
  hideBadge?: boolean;
  hideCategory?: boolean;
  hidePrice?: boolean;
  hideButton?: boolean;
  hideDescription?: boolean;
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({
  item,
  idx,
  hideBadge = false,
  hideCategory = false,
  hidePrice = false,
  hideButton = false,
  hideDescription = false,
}) => {
  // Demo: fake rating and old price for visual parity
  const rating = 4.5;
  const oldPrice = item.oldPrice;
  return (
    <article
      className="flex flex-col items-center bg-white rounded-xl border border-gray-200 shadow-sm p-4 pt-5 transition hover:shadow-md min-h-[340px]"
    >
      <div className="w-full flex justify-center">
        <div className="h-44 w-36 rounded-lg overflow-hidden bg-[#f6f6f6] flex items-center justify-center border border-gray-100">
          <img
            src={`/shop-covers/cover${(idx % 6) + 1}.jpg`}
            alt="Book Cover"
            className="h-full w-full object-cover"
            style={{ background: '#f6f6f6' }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <h3 className="text-base font-semibold text-gray-900 text-center mb-1 min-h-[40px] flex items-center justify-center">
          {item.title}
        </h3>
        {/* Rating */}
        <div className="flex items-center justify-center mb-1">
          <span className="text-orange-400 mr-1"><Star /></span>
          <span className="text-sm text-gray-700 font-medium">{rating}</span>
        </div>
        {/* Price row */}
        <div className="flex items-center gap-2 mt-1 mb-2">
          <span className="text-lg font-bold text-emerald-600">{item.price}</span>
          {oldPrice && (
            <span className="text-base text-gray-400 line-through">{oldPrice}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
