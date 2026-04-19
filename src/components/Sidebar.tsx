"use client";

type SidebarProps = {
  minPrice: number;
  maxPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (value: number) => void;
};

const Sidebar = ({ minPrice, maxPrice, selectedMaxPrice, onPriceChange }: SidebarProps) => {
  const categories = [
    { name: "Historical Fiction", count: 18 },
    { name: "Mystery and Thriller", count: 15 },
    { name: "Biography and Memoir", count: 10 },
    { name: "Business and Finance", count: 9 },
    { name: "Non-Fiction", count: 5 },
    { name: "Poetry", count: 2 },
  ];

  return (
    <div className="w-full lg:w-[260px] bg-white p-5 rounded-xl border border-gray-200">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map((cat, i) => (
            <li
              key={i}
              className="flex justify-between text-gray-600 hover:text-[#1ec28e] cursor-pointer"
            >
              <span>{cat.name}</span>
              <span className="text-sm">({cat.count})</span>
            </li>
          ))}
          <li className="text-center text-[#1ec28e] cursor-pointer font-semibold hover:underline mt-2">More...</li>
        </ul>
      </div>

      {/* Divider */}
      <div className="my-6 border-t"></div>

      {/* Price Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>

        <input
          type="range"
          min={minPrice ?? 0}
          max={Math.max(maxPrice ?? 0, minPrice ?? 0)}
          value={Math.min(selectedMaxPrice ?? 0, Math.max(maxPrice ?? 0, minPrice ?? 0))}
          onChange={(event) => onPriceChange(Number(event.target.value))}
          disabled={(maxPrice ?? 0) <= (minPrice ?? 0)}
          className="w-full accent-[#1ec28e]"
        />

        <div className="mt-3 text-sm text-gray-500">
          ₹{(minPrice ?? 0).toFixed(2)} - ₹{Math.max(selectedMaxPrice ?? 0, minPrice ?? 0).toFixed(2)}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Max available: ₹{Math.max(maxPrice ?? 0, minPrice ?? 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;