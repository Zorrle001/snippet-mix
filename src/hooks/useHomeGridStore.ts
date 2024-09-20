import { create } from "zustand";

export type HomeGridStoreType = {
    collumns: number;
    setCollumns: (collumns: number) => void;
    rows: number;
    setRows: (rows: number) => void;
};

export const useHomeGridStore = create<HomeGridStoreType>((set, get) => ({
    collumns: 5,
    setCollumns: (collumns) => {
        set({ collumns });
    },
    rows: 3,
    setRows: (rows) => {
        set({ rows });
    },
}));
