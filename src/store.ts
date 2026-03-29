import { create } from "zustand";

interface AppState {
  currentPage: "dashboard" | "leads" | "popups" | "analytics" | "settings";
  setPage: (page: AppState["currentPage"]) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  editingPopup: any | null;
  setEditingPopup: (popup: any | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentPage: "dashboard",
  setPage: (page) => set({ currentPage: page, isMobileMenuOpen: false, editingPopup: null }),
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  editingPopup: null,
  setEditingPopup: (popup) => set({ editingPopup: popup }),
}));
