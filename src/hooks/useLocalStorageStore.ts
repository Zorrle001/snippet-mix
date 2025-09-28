import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LocalStorageStoreType = {
    lockMode: boolean;
    setLockMode: (callback: (prevMode: boolean) => boolean) => void;
    liveMode: boolean;
    setLiveMode: (callback: (prevMode: boolean) => boolean) => void;
    soloMuted: boolean;
    setSoloMuted: (callback: (prevMode: boolean) => boolean) => void;
};

export const useLocalStorageStore = create<LocalStorageStoreType>()(
    persist(
        (set, get) => ({
            lockMode: false,
            setLockMode: (callback) => {
                set(() => {
                    let mode = callback(get().lockMode);
                    return { lockMode: mode };
                });
            },
            liveMode: false,
            setLiveMode: (callback) => {
                set(() => {
                    let mode = callback(get().liveMode);
                    return { liveMode: mode };
                });
            },
            soloMuted: false,
            setSoloMuted: (callback) => {
                set(() => {
                    let mode = callback(get().soloMuted);
                    return { soloMuted: mode };
                });
            },
        }),
        {
            name: "app-storage",
        }
    )
);
