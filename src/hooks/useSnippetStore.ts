import { SnippetObjectType } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";

export type SnippetStoreType = {
    snippets: Array<SnippetObjectType>;
    setSnippets: (
        callback: (
            snippets: Array<SnippetObjectType>
        ) => Array<SnippetObjectType>
    ) => void;
    getSnippetCount: () => number;
};

export const useSnippetStore = create<SnippetStoreType>((set, get) => ({
    snippets: [],
    setSnippets: (callback) => {
        const newSnippets = callback(get().snippets);
        set({ snippets: newSnippets });
    },
    getSnippetCount: () => get().snippets.length,
}));
