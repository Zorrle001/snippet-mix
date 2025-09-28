"use client";

import { createRef, MutableRefObject } from "react";
import { create } from "zustand";

export enum SoloWebRTCStatus {
    CONNECTING = "connecting",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    STREAMING = "streaming",
    INITIALIZE_STREAM = "initialize_stream",
}

export type SoloWebRTCStoreType = {
    status: SoloWebRTCStatus;
    setStatus: (status: SoloWebRTCStatus) => void;
    pcRef: MutableRefObject<RTCPeerConnection | null>;
    audioRef: MutableRefObject<HTMLAudioElement | null>;
    toggleSolo: (status: SoloWebRTCStatus) => void;
    setToggleSolo: (fnc: (status: SoloWebRTCStatus) => void) => void;
    meterAnalyser: AnalyserNode | null;
    setMeterAnalyser: (meterAnalyser: AnalyserNode | null) => void;
    realtimeAnalyser: AnalyserNode | null;
    setRealtimeAnalyser: (realtimeAnalyser: AnalyserNode | null) => void;
    soloMonoLevel: [number, number]; // [level, timestamp]
    setSoloMonoLevel: (level: [number, number]) => void;
};

export const useSoloWebRTCStore = create<SoloWebRTCStoreType>((set, get) => ({
    status: SoloWebRTCStatus.DISCONNECTED,
    setStatus: (status: SoloWebRTCStatus) => set({ status }),
    pcRef: createRef<RTCPeerConnection | null>(),
    audioRef: createRef<HTMLAudioElement | null>(),
    toggleSolo: () => {},
    setToggleSolo: (fnc: (status: SoloWebRTCStatus) => void) =>
        set({ toggleSolo: fnc }),
    meterAnalyser: null,
    setMeterAnalyser: (meterAnalyser: AnalyserNode | null) =>
        set({ meterAnalyser }),
    realtimeAnalyser: null,
    setRealtimeAnalyser: (realtimeAnalyser: AnalyserNode | null) =>
        set({ realtimeAnalyser }),
    soloMonoLevel: [0, performance.now()],
    setSoloMonoLevel: (level: [number, number]) =>
        set({ soloMonoLevel: level }),
}));
