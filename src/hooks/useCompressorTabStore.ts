import { SnippetPageTabs } from "@/pages/SnippetPage/SnippetPage";
import { create } from "zustand";

export type SnippetPageStoreType = {};

export const useSnippetPageStore = create<SnippetPageStoreType>(
    (set, get) => ({})
);
