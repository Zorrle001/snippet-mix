import { SnippetObjectType } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";

export type PopUpStoreType = {
    openedPopUp: PopUps | null;
    setOpenedPopUp: (openedPopUp: PopUps | null) => void;
    isPopUpOpened?: boolean;
};

export enum PopUps {
    CreatePopUp,
}

export const usePopUpStore = create<PopUpStoreType>((set, get) => ({
    openedPopUp: null,
    setOpenedPopUp: (openedPopUp) => {
        set({ openedPopUp });
    },
}));
