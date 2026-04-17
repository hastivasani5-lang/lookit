import React from "react";

interface SearchResultsSectionProps {
  searchResults: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearchResultClick: (result: any) => void;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({ searchResults, searchQuery, setSearchQuery, handleSearchResultClick }) => {
  return (
    <div className="mt-6 rounded-[24px] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Search Results</h3>
          <p className="text-sm text-slate-500">
            {searchResults.length} result{searchResults.length === 1 ? "" : "s"} found for “{searchQuery.trim()}”.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="rounded-full bg-[#effaf6] px-4 py-2 text-xs font-semibold text-[#1ec28e] transition hover:bg-[#dff5eb]"
        >
          Clear
        </button>
      </div>
      <ul>
        {searchResults.map((result, idx) => (
          <li key={idx} onClick={() => handleSearchResultClick(result)}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsSection;
