import { Tabs } from "@/pages/SnippetPage/SnippetPage";
import { create } from "zustand";

export type SnippetPageStoreType = {
    selectedSnippet: number | null;
    setSelectedSnippet: (snippetID: number | null) => void;
    isPageVisible: () => boolean;
    tab: Tabs;
    setTab: (tab: Tabs) => void;
};

export const useSnippetPageStore = create<SnippetPageStoreType>((set, get) => ({
    selectedSnippet: null,
    setSelectedSnippet: (snippetID) => {
        set({ selectedSnippet: snippetID });
    },
    isPageVisible: () => get().selectedSnippet !== null,
    tab: Tabs.Inputs,
    setTab: (tab) => set({ tab }),
}));
