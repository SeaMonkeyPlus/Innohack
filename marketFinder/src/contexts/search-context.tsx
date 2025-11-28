import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PredictApiResponse } from "../services/market-api";

const SELECTED_MARKET_KEY = "@selected_market_id";

interface SearchContextType {
  searchKeyword: string | null;
  capturedImage: string | null;
  selectedMarketId: string | null;
  predictResult: PredictApiResponse | null;
  setSearchData: (keyword: string, image: string, predictResult?: PredictApiResponse) => void;
  setSelectedMarket: (marketId: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [predictResult, setPredictResult] = useState<PredictApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 시장 ID 불러오기
  useEffect(() => {
    const loadSelectedMarket = async () => {
      try {
        const savedMarketId = await AsyncStorage.getItem(SELECTED_MARKET_KEY);
        if (savedMarketId) {
          setSelectedMarketId(savedMarketId);
        }
      } catch (error) {
        console.error("Failed to load selected market:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedMarket();
  }, []);

  const setSearchData = (keyword: string, image: string, predictResult?: PredictApiResponse) => {
    setSearchKeyword(keyword);
    setCapturedImage(image);
    setPredictResult(predictResult || null);
  };

  const setSelectedMarket = async (marketId: string) => {
    try {
      setSelectedMarketId(marketId);
      if (marketId) {
        await AsyncStorage.setItem(SELECTED_MARKET_KEY, marketId);
      } else {
        // 빈 문자열이면 AsyncStorage에서 제거
        await AsyncStorage.removeItem(SELECTED_MARKET_KEY);
      }
    } catch (error) {
      console.error("Failed to save selected market:", error);
    }
  };

  const clearSearch = () => {
    setSearchKeyword(null);
    setCapturedImage(null);
    setPredictResult(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchKeyword,
        capturedImage,
        selectedMarketId,
        predictResult,
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
