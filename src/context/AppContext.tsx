"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { MOCK_USER, MOCK_DESIGNS, Design } from "@/lib/data";

type AppContextType = {
  user: typeof MOCK_USER | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  designs: Design[];
  myDesigns: Design[];
  addDesign: (d: Design) => void;
  showSaleNotification: boolean;
  triggerSaleNotification: () => void;
  credits: number;
  addCredits: (amount: number) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [designs, setDesigns] = useState<Design[]>(MOCK_DESIGNS);
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const [showSaleNotification, setShowSaleNotification] = useState(false);
  const [credits, setCredits] = useState(12.00);

  const login = () => {
    setIsLoggedIn(true);
    setUser(MOCK_USER);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addDesign = (d: Design) => {
    setDesigns(prev => [d, ...prev]);
    setMyDesigns(prev => [d, ...prev]);
  };

  const triggerSaleNotification = () => {
    setShowSaleNotification(true);
    setTimeout(() => setShowSaleNotification(false), 5000);
  };

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, login, logout,
      designs, myDesigns, addDesign,
      showSaleNotification, triggerSaleNotification,
      credits, addCredits,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
