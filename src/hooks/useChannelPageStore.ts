import { SnippetObjChannelObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { ChannelPageTabs } from "@/pages/ChannelPage/ChannelPage";
import { create } from "zustand";

export type ChannelPageStoreType = {
    selectedChannelID: string | null;
    setSelectedChannelID: (channelID: string | null) => void;
    selectedChannelObj: SnippetObjChannelObjType | null;
    setSelectedChannelObj: (
        snippetObj: SnippetObjChannelObjType | null
    ) => void;
    tab: ChannelPageTabs;
    setTab: (tab: ChannelPageTabs) => void;
    isPageVisible: () => boolean;
};

export const useChannelPageStore = create<ChannelPageStoreType>((set, get) => ({
    selectedChannelID: null,
    setSelectedChannelID: (channelID) => {
        set({ selectedChannelID: channelID });
    },
    selectedChannelObj: null,
    setSelectedChannelObj: (channelObj) => {
        set({ selectedChannelObj: channelObj });
    },
    isPageVisible: () =>
        get().selectedChannelID !== null && get().selectedChannelObj !== null,
    tab: ChannelPageTabs.EQ,
    setTab: (tab) => set({ tab }),
}));
