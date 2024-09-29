import { OutputChannelEnum } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";

export type InputTabStoreType = {
    activeOutputChannel: OutputChannelEnum;
    lastActiveOutputChannel: OutputChannelEnum | null;
    setActiveOutputChannel: (channel: OutputChannelEnum) => void;
    setLastActiveOutputChannel: (channel: OutputChannelEnum) => void;
};

export const useInputTabStore = create<InputTabStoreType>((set, get) => ({
    activeOutputChannel: OutputChannelEnum.LR,
    lastActiveOutputChannel: null,
    setActiveOutputChannel: (channel) => {
        set({ lastActiveOutputChannel: get().activeOutputChannel });
        set({ activeOutputChannel: channel });
    },
    setLastActiveOutputChannel: (channel) => {
        set({ lastActiveOutputChannel: channel });
    },
}));
