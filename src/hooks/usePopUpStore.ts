import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { SelectSnippetPopUpProps } from "@/components/PopUps/SelectSnippetPopUp";
import { create } from "zustand";

export type PopUpStoreType = {
    openedPopUp: PopUps | null;
    setOpenedPopUp: (openedPopUp: PopUps | null) => void;
    openedPopUpProps: SelectSnippetPopUpProps | {};
    setOpenedPopUpProps: (props: SelectSnippetPopUpProps | {}) => void;
    isPopUpOpened?: boolean;
};

export enum PopUps {
    CreatePopUp,
    DesignPopUp,
    SelectSnippetPopUp,
}

export const usePopUpStore = create<PopUpStoreType>((set, get) => ({
    openedPopUp: null,
    setOpenedPopUp: (openedPopUp) => {
        set({ openedPopUp });
    },
    openedPopUpProps: {},
    setOpenedPopUpProps: (props) => {
        set({ openedPopUpProps: props });
    },
}));
