import { create } from "zustand";

export type LocalStorageStoreType = {
    lockMode: string;
    setLockMode: (callback: (prevMode: string) => string) => void;
    liveMode: string;
    setLiveMode: (callback: (prevMode: string) => string) => void;
};

export const useLocalStorageStore = create<LocalStorageStoreType>(
    (set, get) => ({
        lockMode: localStorage.getItem("lockMode") || "false",
        setLockMode: (callback) => {
            set(() => {
                let mode = callback(get().lockMode);
                localStorage.setItem("lockMode", mode);
                return { lockMode: mode };
            });
        },
        liveMode: localStorage.getItem("liveMode") || "false",
        setLiveMode: (callback) => {
            set(() => {
                let mode = callback(get().liveMode);
                localStorage.setItem("liveMode", mode);
                return { liveMode: mode };
            });
        },
    })
);
