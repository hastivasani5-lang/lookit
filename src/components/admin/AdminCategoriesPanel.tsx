import { Eye, PencilLine, Trash2 } from "lucide-react";

type AdminCategoriesPanelProps = {
  paginatedCategories: any[];
  categoriesList: any[];
  editCategory: (id: number) => void;
  deleteCategory: (id: number) => void;
  openDetailModal: (payload: { title: string; entries: Array<{ label: string; value: string }> }) => void;
  categoriesCurrentPage: number;
  categoryTotalPages: number;
  itemsPerPage: number;
  setCategoriesCurrentPage: (value: number | ((value: number) => number)) => void;
};

export default function AdminCategoriesPanel({
  paginatedCategories,
  categoriesList,
  editCategory,
  deleteCategory,
  openDetailModal,
  categoriesCurrentPage,
  categoryTotalPages,
  itemsPerPage,
  setCategoriesCurrentPage,
}: AdminCategoriesPanelProps) {
  return (
    <div className="mt-6 space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Professionals</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr key={category.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-800">{category.name}</td>
                <td className="px-4 py-3">{category.type}</td>
                <td className="px-4 py-3">{category.description}</td>
                <td className="px-4 py-3">{category.professionals}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
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
                </td>
              </tr>
            ))}
            {categoriesList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-sm text-slate-500">No categories found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </div>

      {categoriesList.length > 0 ? (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCategoriesCurrentPage((page) => page - 1)}
              disabled={categoriesCurrentPage === 1}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Prev
            </button>
            {Array.from({ length: categoryTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCategoriesCurrentPage(page)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === categoriesCurrentPage
                    ? "border-[#178c43] bg-[#178c43] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCategoriesCurrentPage((page) => page + 1)}
              disabled={categoriesCurrentPage === categoryTotalPages}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
