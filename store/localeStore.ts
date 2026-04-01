import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "he" | "en";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "he",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set({ locale: get().locale === "he" ? "en" : "he" }),
    }),
    { name: "shaarei-revacha-locale" },
  ),
);
