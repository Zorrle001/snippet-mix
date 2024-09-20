import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { create } from "zustand";

export type NodeConnectionManagerStoreType = {
    isConnected: boolean;
    setConnected: (state: boolean) => void;
    isLoading: boolean;
    setLoading: (state: boolean) => void;
    socket: WebSocket | null;
    setSocket: (ws: WebSocket | null) => void;
};

export const useNodeConnectionManagerStore =
    create<NodeConnectionManagerStoreType>((set, get) => ({
        isConnected: false,
        setConnected: (state) => set({ isConnected: state }),
        isLoading: true,
        setLoading: (state) => set({ isLoading: state }),
        socket: null,
        setSocket: (ws: WebSocket | null) => set({ socket: ws }),
    }));
