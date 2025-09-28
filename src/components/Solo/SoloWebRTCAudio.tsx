"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useLocalStorageStore } from "@/hooks/useLocalStorageStore";
import {
    SoloWebRTCStatus,
    useSoloWebRTCStore,
} from "@/hooks/useSoloWebRTCAudioStore";
import { useEffect, useState } from "react";

let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;
let meterAnalyser: AnalyserNode | null = null;
let realtimeAnalyser: AnalyserNode | null = null;

export default function SoloWebRTCAudio() {
    //const pcRef = useSoloWebRTCStore((state) => state.pcRef);
    //const wsRef = useRef<null | WebSocket>(null);
    //const audioRef = useSoloWebRTCStore((state) => state.audioRef);

    const setToggleSolo = useSoloWebRTCStore((state) => state.setToggleSolo);

    const [nodeURL, setNodeURL] = useLocalStorage("nodeURL", null);
    const soloMuted = useLocalStorageStore((state) => state.soloMuted);
    //const setSoloMuted = useLocalStorageStore((state) => state.setSoloMuted);

    //const soloSignalingWS = new WebSocket("ws://" + nodeURL + ":8765");
    //const status = useSoloWebRTCStore((state) => state.status);
    const setStatus = useSoloWebRTCStore((state) => state.setStatus);
    const setMeterAnalyser = useSoloWebRTCStore(
        (state) => state.setMeterAnalyser
    );
    const setRealtimeAnalyser = useSoloWebRTCStore(
        (state) => state.setRealtimeAnalyser
    );

    console.warn("RENDERING SOLO WEBRTC AUDIO");

    /* let ws: WebSocket | null = useRef<WebSocket | null>(null);
    let pc: RTCPeerConnection | null = useRef<RTCPeerConnection | null>(null); */

    // OR REF doesnt matter
    const [audioContext, setAudioContext] = useState<AudioContext>(() => {
        //@ts-ignore
        return new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: "interactive",
        });
    });

    /* let audioContext: AudioContext | null = new (window.AudioContext ||
        window.webkitAudioContext)({
        latencyHint: "interactive",
    }); */

    let [audio] = useState<HTMLAudioElement>(() => {
        let audio = new Audio();
        audio.muted = soloMuted;
        return audio;
    }); //audioRef.current;

    useEffect(() => {
        audio.muted = soloMuted;
        console.warn("SET SOLO MUTED TO " + soloMuted);
    }, [soloMuted]);

    function handlePlay() {
        if (audio) {
            audioContext &&
                audioContext.resume().catch((e) => {
                    console.log("AudioCtx resume error: " + e.message);
                });
            if (audio.srcObject == null) {
                // FOR SAFARI PRE START
                audio.srcObject = new MediaStream();
            }
            audio.play().catch((e) => {
                console.log("Audio play error: " + e.message);
            });
            console.log("Play triggered");
        } else {
            console.log("No audio element to play");
        }
    }

    function log(msg: string) {
        console.log(msg);
        /* const logEl = document.getElementById("log");
        logEl.innerHTML +=
            new Date().toLocaleTimeString() + ": " + msg + "<br>";
        logEl.scrollTop = logEl.scrollHeight;
        console.log(msg); */
    }

    /* function setStatus(status, text) {
        const statusEl = document.getElementById("status");
        statusEl.className = `status ${status}`;
        statusEl.textContent = text;
    } */

    async function connect() {
        try {
            setStatus(SoloWebRTCStatus.CONNECTING);
            log("Connecting to WebSocket...");

            if (ws) ws.close();
            ws = new WebSocket("ws://" + nodeURL + ":8765");

            ws.onopen = (e) => {
                setStatus(SoloWebRTCStatus.CONNECTED);
                log("WebSocket connected");

                console.log("TARGET", e.target);
                e.target &&
                    (e.target as WebSocket).send(
                        JSON.stringify({
                            type: "initiate_default_solo_webrtc",
                        })
                    );
                //loadDevices();
            };

            ws.onmessage = handleMessage;

            ws.onclose = () => {
                log("WebSocket disconnected");
                setStatus(SoloWebRTCStatus.DISCONNECTED);
                cleanup();
            };
        } catch (error: any) {
            log("Connection error: " + error.message);
            setStatus(SoloWebRTCStatus.DISCONNECTED);
        }
    }

    function disconnect() {
        if (ws) ws.close();
        //cleanup();
    }

    function cleanup() {
        if (pc) {
            pc.close();
            pc = null;
        }
        if (audioContext) {
            //audioContext.close();
            //audioContext = null;
        }
        console.warn("CLEANUP");
        ws = null;
    }

    /* function loadDevices() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "get_devices" }));
        }
    }

    function selectInput() {
        const select = document.getElementById("inputDevices");
        const deviceIndex = parseInt(select.value);

        if (ws && !isNaN(deviceIndex)) {
            log(`Selecting device: ${deviceIndex}`);
            ws.send(
                JSON.stringify({
                    type: "select_device",
                    device_index: deviceIndex,
                })
            );

            if (!pc) setupWebRTC();
        }
    } */

    async function setupWebRTC() {
        if (!ws) {
            log("WebSocket not connected for WebRTC setup");
            return;
        }

        try {
            log("Setting up WebRTC...");
            setStatus(SoloWebRTCStatus.INITIALIZE_STREAM);

            pc = new RTCPeerConnection(/*{
                sdpSemantics: "unified-plan",
            }*/);

            // AUSKOMMENTIEREN
            /* pc.onicecandidate = (e) => {
                if (e.candidate) {
                    ws.send(
                        JSON.stringify({
                            type: "ice",
                            ...e.candidate.toJSON(),
                        })
                    );
                } else {
                    ws.send(JSON.stringify({ type: "ice", candidate: null }));
                }
            }; */

            pc.ontrack = (event) => {
                log("Received audio track");
                handleAudioStream(event.streams[0]);
            };

            // @ts-ignore
            pc.onaddstream = (event) => {
                log("onAddStream event");
                console.log("ON ADD STREAM EVENT", event);
                //handleAudioStream(event.streams[0]);
            };

            pc.onconnectionstatechange = () => {
                log(`Connection state: ${pc?.connectionState}`);
                if (pc && pc.connectionState === "connected") {
                    setStatus(SoloWebRTCStatus.STREAMING);
                }
            };

            pc.addTransceiver("audio", { direction: "recvonly" });
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: false,
            });

            await pc.setLocalDescription(offer);

            ws.send(
                JSON.stringify({
                    type: "offer",
                    sdp: offer.sdp,
                    sdp_type: offer.type,
                })
            );

            log("Offer sent");
        } catch (error: any) {
            log("WebRTC error: " + error.message);
        }
    }

    async function handleAudioStream(stream: MediaStream) {
        if (!audio) {
            console.error("No audio element for stream");
            return;
        }

        try {
            log("Setting up audio playback...");

            /* audioContext = new (window.AudioContext ||
                window.webkitAudioContext)({
                latencyHint: "interactive",
            }); */
            meterAnalyser = audioContext.createAnalyser();
            meterAnalyser.fftSize = 2048; // -> ~43ms Analysefenster bei 48kHz
            meterAnalyser.smoothingTimeConstant = 0;

            realtimeAnalyser = audioContext.createAnalyser();
            realtimeAnalyser.fftSize = 32; // 2.6ms
            realtimeAnalyser.smoothingTimeConstant = 0;

            // DIRECT PLAYBACK - SIMPLE!
            //audio = new Audio();
            audio.srcObject = stream;
            audio.autoplay = true;
            audio.volume = 1.0;

            // Also connect to AudioContext for monitoring
            const source = audioContext.createMediaStreamSource(stream);
            const destination = audioContext.createMediaStreamDestination();
            source
                .connect(meterAnalyser)
                .connect(realtimeAnalyser)
                .connect(destination);

            audio.play().catch((e) => {
                log("Audio play error: " + e.message);
            });
            audioContext.resume().catch((e) => {
                log("AudioCtx resume error: " + e.message);
            });

            log("Audio playback started: " + audioContext.state);

            setMeterAnalyser(meterAnalyser);
            setRealtimeAnalyser(realtimeAnalyser);
        } catch (error: any) {
            log("Audio setup error: " + error.message);
        }
    }

    async function logAudioStats(pc: RTCPeerConnection | null) {
        if (!pc || !audioContext) return;

        const stats = await pc.getStats();
        let rttMs: string | number = "n/a";
        let jitterMs: string | number = "n/a";
        let jitterBufMs: string | number = "n/a";
        let packetsLost: string | number = "n/a";

        stats.forEach((report) => {
            if (report.type === "inbound-rtp" && report.kind === "audio") {
                if (report.jitter != null) {
                    jitterMs = (report.jitter * 1000).toFixed(1);
                }
                if (
                    report.jitterBufferDelay != null &&
                    report.jitterBufferEmittedCount > 0
                ) {
                    const avgSec =
                        report.jitterBufferDelay /
                        report.jitterBufferEmittedCount;
                    jitterBufMs = (avgSec * 1000).toFixed(1);
                }
                packetsLost = report.packetsLost;
            }

            if (
                report.type === "candidate-pair" &&
                report.state === "succeeded" &&
                report.nominated
            ) {
                if (report.currentRoundTripTime != null) {
                    rttMs = (report.currentRoundTripTime * 1000).toFixed(1);
                } else if (
                    report.totalRoundTripTime &&
                    report.responsesReceived
                ) {
                    rttMs = (
                        (report.totalRoundTripTime / report.responsesReceived) *
                        1000
                    ).toFixed(1);
                }
            }
        });

        log(
            `[AudioStats] RTT=${rttMs} ms | jitter=${jitterMs} ms | jitterBuffer=${jitterBufMs} ms | packetsLost=${packetsLost}`
        );
        log(
            `Estimated playout delay: Backend Queue: 10*2.5ms = 25ms + RTT/2: ${
                typeof rttMs === "number" ? rttMs / 2 : rttMs
            }ms + jitterBuffer: ${jitterBufMs}ms + Opus Codec Look ahead: 20ms + baseLatency: ${
                audioContext.baseLatency * 1000
            }ms + outputLatency: ${audioContext.outputLatency * 1000}ms = ${
                10 * 2.5 +
                (typeof rttMs === "number" ? rttMs / 2 : 0) +
                parseFloat(jitterBufMs) +
                20 +
                audioContext.baseLatency * 1000 +
                (isNaN(audioContext.outputLatency * 1000)
                    ? 40
                    : audioContext.outputLatency * 1000)
            }ms`
        );
    }

    setInterval(() => logAudioStats(pc), 2000);

    function handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);

        /* if (data.type === "devices") {
            populateDevices(data.devices);
        } else  */ if (data.type === "answer") {
            handleAnswer(data);
        } else {
            log("Received: " + data.type);
        }
    }

    /* function populateDevices(devices) {
        const select = document.getElementById("inputDevices");
        select.innerHTML = "";

        devices.forEach((device) => {
            const option = document.createElement("option");
            option.value = device.index;
            option.textContent = `${device.index}: ${device.name}`;
            select.appendChild(option);
        });

        log(`Loaded ${devices.length} input devices`);
    } */

    async function handleAnswer(data: any) {
        if (!pc) {
            console.warn("No PeerConnection for answer");
            return;
        }

        try {
            await pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: data.sdp_type,
                    sdp: data.sdp,
                })
            );
            log("Answer processed");
        } catch (error: any) {
            log("Answer error: " + error.message);
        }
    }

    /* async function listOutputs() {
        if (!("setSinkId" in HTMLMediaElement.prototype)) {
            console.warn("setSinkId not supported");
        } else {
            try {
                // Permission trick to get labels:
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            } catch {}
        }
        const devs = await navigator.mediaDevices.enumerateDevices();
        const outs = devs.filter((d) => d.kind === "audiooutput");
        const sel = document.getElementById("outputSelect");
        sel.innerHTML = "";
        outs.forEach((d) => {
            const opt = document.createElement("option");
            opt.value = d.deviceId;
            opt.textContent = d.label || `Output ${d.deviceId}`;
            sel.appendChild(opt);
        });
    } */

    /* async function applyOutput() {
        const id = document.getElementById("outputSelect").value;

        if (!audio) {
            console.warn("No audio element");
            return;
        }

        if ("setSinkId" in audio && id) {
            try {
                await audio.setSinkId(id);
            } catch (e) {
                console.warn("setSinkId failed:", e);
            }
        }
    } */

    /* async function start() {
        /* if (pcRef.current == null || pcRef.current == null) {
                return;
            } */
    // LOAD DATA FROM MIXER!
    // @ts-ignore
    /* if (window.sendJSONMessage === undefined) {
            alert("WS not connected! Can't setup WebRTC Stream");
            return;
        } */

    /* wsRef.current.onmessage = async (msg) => {
                const data = JSON.parse(msg.data);

                if (data.type === "answer") {
                    await pcRef.current.setRemoteDescription(data);
                } else if (data.type === "candidate") {
                    await pcRef.current.addIceCandidate(data.candidate);
                }
            }; */

    /* pcRef.current = new RTCPeerConnection();

        pcRef.current.ontrack = (event) => {
            console.warn("ON TRACK EVENT", event);
            console.log("Got remote track:", event.track.kind);
            if (event.streams && event.streams[0]) {
                audioRef.current.srcObject = event.streams[0];
            } else {
                // Fallback falls nur track geliefert wird
                const stream = new MediaStream([event.track]);
                audioRef.current.srcObject = stream;
            }
            audioRef.current.play().catch((e) => console.error);
        }; */

    // wir senden nichts, nur Empfänger
    /* pcRef.current.onicecandidate = (ev) => {
            if (ev.candidate) {
                window.sendJSONMessage({
                    id: "SOLO_AUDIO_STREAM_ICE_CANDIDATE",
                    data: ev.candidate,
                });
            }
        };

        const offer = await pcRef.current.createOffer({
            offerToReceiveAudio: true,
        });
        await pcRef.current.setLocalDescription(offer); */

    //@ts-ignore
    /* window.sendJSONMessage({
            id: "SOLO_AUDIO_STREAM_OFFER",
            data: offer,
        });
        console.log("SENT OFFER");
    } */

    /* window.onload = () => {
        connect();
    }; */

    setToggleSolo((status) => {
        if (status === SoloWebRTCStatus.DISCONNECTED) {
            connect();
        } else if (status === SoloWebRTCStatus.CONNECTED) {
            if (audio)
                audio.play().catch((e) => {
                    log("Audio play error: " + e.message);
                });
            setupWebRTC();
            handlePlay();
        } else if (status === SoloWebRTCStatus.STREAMING) {
            //handlePlay();
            disconnect();
        } else {
            console.warn("Unhandled status: " + status);
        }
    });

    useEffect(() => {
        if (ws === null || ws.readyState === ws.CLOSED) connect();

        console.log("RUNNING SOLO WEBRTC AUDIO EFFECT");

        return () => {
            console.log("CLOSED pcRef because of unmount");
            //if (pcRef.current) pcRef.current.close();
            //ws && ws.close();
            //cleanup();
        };
    }, []);

    return (
        <>
            {/* <audio ref={audioRef} autoPlay /> */}
            {/* <button
                onClick={() => {
                    console.log("CLICKED");
                    start();
                }}
            >
                START
            </button> */}
        </>
    );
}
