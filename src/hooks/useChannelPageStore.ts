import { SnippetObjChannelObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { ChannelPageTabs } from "@/pages/ChannelPage/ChannelPage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useChannelPageStore = create<ChannelPageStoreType>()(
    persist(
        (set, get) => ({
            selectedChannelID: null,
            setSelectedChannelID: (channelID) => {
                set({ selectedChannelID: channelID });
            },
            selectedChannelObj: null,
            setSelectedChannelObj: (channelObj) => {
                set({ selectedChannelObj: channelObj });
            },
            isPageVisible: () =>
                get().selectedChannelID !== null &&
                get().selectedChannelObj !== null,
            tab: ChannelPageTabs.Comp,
            setTab: (tab) => set({ tab }),
        }),
        {
            name: "temporary-channel-page-store",
        }
    )
);
