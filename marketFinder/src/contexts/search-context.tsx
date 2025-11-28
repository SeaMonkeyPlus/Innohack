import React, { createContext, ReactNode, useContext, useState } from "react";

interface SearchContextType {
  searchKeyword: string | null;
  capturedImage: string | null;
  selectedMarketId: string | null;
  setSearchData: (keyword: string, image: string) => void;
  setSelectedMarket: (marketId: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const setSearchData = (keyword: string, image: string) => {
    setSearchKeyword(keyword);
    setCapturedImage(image);
  };

  const setSelectedMarket = (marketId: string) => {
    setSelectedMarketId(marketId);
  };

  const clearSearch = () => {
    setSearchKeyword(null);
    setCapturedImage(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchKeyword,
        capturedImage,
        selectedMarketId,
        setSearchData,
        setSelectedMarket,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
