import { SnippetPageTabs } from "@/pages/SnippetPage/SnippetPage";
import { create } from "zustand";

export type SnippetPageStoreType = {
    selectedSnippet: number | null;
    setSelectedSnippet: (snippetID: number | null) => void;
    isPageVisible: () => boolean;
    tab: SnippetPageTabs;
    setTab: (tab: SnippetPageTabs) => void;
};

export const useSnippetPageStore = create<SnippetPageStoreType>((set, get) => ({
    selectedSnippet: null,
    setSelectedSnippet: (snippetID) => {
        set({ selectedSnippet: snippetID });
    },
    isPageVisible: () => get().selectedSnippet !== null,
    tab: SnippetPageTabs.Sends,
    setTab: (tab) => set({ tab }),
}));
