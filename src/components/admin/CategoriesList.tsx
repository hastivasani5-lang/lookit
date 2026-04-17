import React from "react";
import NeumorphListCard from "./NeumorphListCard";
import { PencilLine, Trash2, Eye } from "lucide-react";

interface Category {
  id: number;
  name: string;
  type: string;
  description: string;
  professionals: number;
}

interface CategoriesListProps {
  categories: Category[];
  editCategory: (id: number) => void;
  deleteCategory: (id: number) => void;
  openDetailModal: (payload: any) => void;
}


import { useState } from "react";

const CategoriesList: React.FC<CategoriesListProps> = ({ categories, editCategory, deleteCategory, openDetailModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginated = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {paginated.map((category) => (
          <NeumorphListCard key={category.id}>
            <div className="flex-1 min-w-[120px] font-medium text-slate-800">{category.name}</div>
            <div className="flex-1 min-w-[120px] text-slate-700">{category.type}</div>
            <div className="flex-1 min-w-[200px] text-slate-700">{category.description}</div>
            <div className="flex-1 min-w-[60px] text-slate-700">{category.professionals}</div>
            <div className="flex flex-1 justify-end gap-2 min-w-[180px]">
              <button
                type="button"
                onClick={() => editCategory(category.id)}
                className="inline-flex items-center gap-1 rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
              >
                <PencilLine className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
              <button
                type="button"
                onClick={() =>
                  openDetailModal({
                    title: "Professional Category Details",
                    entries: [
                      { label: "Category", value: category.name },
                      { label: "Type", value: category.type },
                      { label: "Description", value: category.description },
                      { label: "Professionals", value: String(category.professionals) },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
            </div>
          </NeumorphListCard>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#e8f9ee] text-[#178c43]" : "bg-slate-100 text-slate-700"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50">Next</button>
        </div>
      )}
    </>
  );
};

export default CategoriesList;
