import { OutputChannelEnum } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";

export type InputTabStoreType = {
    activeOutputChannel: OutputChannelEnum;
    setActiveOutputChannel: (channel: OutputChannelEnum) => void;
};

export const useInputTabStore = create<InputTabStoreType>((set, get) => ({
    activeOutputChannel: OutputChannelEnum.LR,
    setActiveOutputChannel: (channel) => set({ activeOutputChannel: channel }),
}));
