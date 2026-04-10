import React from "react";
import CategoriesList from "./CategoriesList";

interface CategoriesSectionProps {
  categoriesList: any[];
  editCategory: (id: number) => void;
  deleteCategory: (id: number) => void;
  openDetailModal: (payload: any) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoriesList, editCategory, deleteCategory, openDetailModal }) => (
  <div className="mt-6 space-y-5">
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <CategoriesList
        categories={categoriesList}
        editCategory={editCategory}
        deleteCategory={deleteCategory}
        openDetailModal={openDetailModal}
      />
    </div>
  </div>
);

export default CategoriesSection;
