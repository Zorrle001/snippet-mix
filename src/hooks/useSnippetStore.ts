import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type SnippetStoreType = {
    snippets: Array<SnippetObjType>;
    setSnippets: (
        callback: (snippets: Array<SnippetObjType>) => Array<SnippetObjType>
    ) => void;
    getSnippetCount: () => number;
};

export const useSnippetStore = create(
    subscribeWithSelector<SnippetStoreType>((set, get) => ({
        snippets: [],
        setSnippets: (callback) => {
            const newSnippets = callback(get().snippets);
            set({ snippets: newSnippets });
        },
        getSnippetCount: () => get().snippets.length,
    }))
);
