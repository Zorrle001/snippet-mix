import { FontClassName } from "@/app/layout";
import { useLocalStorageStore } from "@/hooks/useLocalStorageStore";
import {
    SoloWebRTCStatus,
    useSoloWebRTCStore,
} from "@/hooks/useSoloWebRTCAudioStore";

import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/Live/LivePageStyles.module.scss";
import { CN } from "@/utils/Utils";
import { useEffect, useRef } from "react";

type Props = {
    hideSettings?: boolean;
};
export default function SoloControls({ hideSettings = false }: Props) {
    const status = useSoloWebRTCStore((state) => state.status);

    const toggleSolo = useSoloWebRTCStore((state) => state.toggleSolo);
    const soloMuted = useLocalStorageStore((state) => state.soloMuted);
    const setSoloMuted = useLocalStorageStore((state) => state.setSoloMuted);

    const setSoloMonoLevel = useSoloWebRTCStore(
        (state) => state.setSoloMonoLevel
    );

    const meterAnalyser = useSoloWebRTCStore((state) => state.meterAnalyser);

    const leftSoloMeterRef = useRef<HTMLDivElement>(null);
    const rightSoloMeterRef = useRef<HTMLDivElement>(null);

    /* useEffect(() => {
        if (status === SoloWebRTCStatus.STREAMING) {
            console.warn("MAYBE MORE THEN ONE LOOP RUNNING?");
            drawSoloMeter();
        }
    }, [status]); */

    useEffect(() => {
        if (status !== SoloWebRTCStatus.STREAMING || !meterAnalyser) {
            leftSoloMeterRef.current &&
                leftSoloMeterRef.current.style.setProperty("--level", "0");
            rightSoloMeterRef.current &&
                rightSoloMeterRef.current.style.setProperty("--level", "0");
            return;
        }

        let rafId: number | null = null;
        let stopped = false;

        // Allocate buffer once for this run
        const buf = new Float32Array(meterAnalyser.fftSize);
        // Peak-Hold Parameter
        const holdMs = 500; // wie lange halten
        const decayDbPerSec = 6; // Abfallrate nach der Hold-Zeit (dB pro Sekunde)

        // Zustände für Peak-Hold (pro "Kanal" – du nutzt hier zwei gleiche Meter)
        let peakHoldDbL = -60;
        let peakHoldDbR = -60; // du nutzt aktuell Mono -> beide gleich, aber lassen wir getrennt
        let lastNewPeakTimeL = 0;
        let lastNewPeakTimeR = 0;

        const normFromDb = (db: number, minDb = -60) => {
            const norm = (db - minDb) / -minDb;
            // clamp
            return Math.min(1, Math.max(0, norm));
        };

        const rmsToDbfs = (rms: number) => {
            const minDb = -100;
            if (!isFinite(rms) || rms <= 1e-12) return minDb;
            return Math.max(minDb, 20 * Math.log10(rms));
        };

        const getRmsDbfs = () => {
            meterAnalyser.getFloatTimeDomainData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
            return rmsToDbfs(Math.sqrt(sum / buf.length));
        };

        const getPeakDbfs = () => {
            meterAnalyser.getFloatTimeDomainData(buf);
            let peak = 0;
            for (let i = 0; i < buf.length; i++) {
                const v = Math.abs(buf[i]);
                if (v > peak) peak = v;
            }
            return peak <= 1e-12 ? -100 : 20 * Math.log10(peak);
        };

        // Hilfsfunktion: Peak-Hold aktualisieren (Mono -> L/R identisch)
        const updatePeakHold = (nowMs: number, newPeakDb: number) => {
            // Links
            if (newPeakDb > peakHoldDbL) {
                peakHoldDbL = newPeakDb;
                lastNewPeakTimeL = nowMs;
            } else {
                const elapsedL = nowMs - lastNewPeakTimeL;
                if (elapsedL > holdMs) {
                    // Decay anwenden
                    const decayDb =
                        (decayDbPerSec * (elapsedL - holdMs)) / 1000;
                    peakHoldDbL = Math.max(newPeakDb, peakHoldDbL - decayDb);
                    // lastNewPeakTimeL nicht jedes Mal zurücksetzen, nur Peak-Wert absenken
                }
            }

            // Rechts (gleich, da du mono auf beide anzeigst)
            if (newPeakDb > peakHoldDbR) {
                peakHoldDbR = newPeakDb;
                lastNewPeakTimeR = nowMs;
            } else {
                const elapsedR = nowMs - lastNewPeakTimeR;
                if (elapsedR > holdMs) {
                    const decayDb =
                        (decayDbPerSec * (elapsedR - holdMs)) / 1000;
                    peakHoldDbR = Math.max(newPeakDb, peakHoldDbR - decayDb);
                }
            }
        };

        const loop = () => {
            if (stopped) return;

            const now = performance.now();

            const rmsDb = getRmsDbfs();
            const peakDb = getPeakDbfs();

            // Peak-Hold aktualisieren
            updatePeakHold(now, peakDb);

            // Normieren
            const rmsNorm = normFromDb(rmsDb);
            const peakNorm = normFromDb(peakDb);
            const peakHoldNormL = normFromDb(peakHoldDbL);
            const peakHoldNormR = normFromDb(peakHoldDbR);

            setSoloMonoLevel([peakNorm, performance.now()]);

            // CSS aktualisieren
            if (leftSoloMeterRef.current) {
                leftSoloMeterRef.current.style.setProperty(
                    "--level",
                    String(peakNorm)
                );
                leftSoloMeterRef.current.style.setProperty(
                    "--peak",
                    String(peakHoldNormL)
                );
                /* leftSoloMeterRef.current.style.setProperty(
                    "--peakHold",
                    String(peakHoldNormL)
                ); */
            }
            if (rightSoloMeterRef.current) {
                rightSoloMeterRef.current.style.setProperty(
                    "--level",
                    String(peakNorm)
                );
                rightSoloMeterRef.current.style.setProperty(
                    "--peak",
                    String(peakHoldNormR)
                );
                /* rightSoloMeterRef.current.style.setProperty(
                    "--peakHold",
                    String(peakHoldNormR)
                ); */
            }

            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);

        // Cleanup when status/analyser changes or on unmount
        return () => {
            stopped = true;
            if (rafId != null) cancelAnimationFrame(rafId);
        };
    }, [status, meterAnalyser, leftSoloMeterRef, rightSoloMeterRef]);

    return (
        <>
            <button
                onClick={() => {
                    setSoloMuted((prev) => !prev);
                }}
                id={styles.soloMuteBtn}
                className={CN(
                    homeStyles.smallBtn,
                    soloMuted ? styles.enabled : ""
                )}
            >
                <i className="fa-solid fa-volume-xmark"></i>
            </button>
            <section id={styles.soloUtilsContainer}>
                <p>0 CH</p>
                <button>CLR</button>
            </section>
            <section id={styles.soloMeterContainer}>
                <div
                    id={styles.soloMeter}
                    className={CN(styles.meter, soloMuted ? styles.muted : "")}
                    ref={leftSoloMeterRef}
                >
                    <b>L</b>
                </div>
                <div
                    id={styles.soloMeter}
                    className={CN(styles.meter, soloMuted ? styles.muted : "")}
                    ref={rightSoloMeterRef}
                >
                    <b>R</b>
                </div>
            </section>
            <button
                id={homeStyles.deleteBtn}
                onClick={() => {
                    toggleSolo(status);
                }}
                className={[
                    FontClassName,
                    styles.soloBtn,
                    status === SoloWebRTCStatus.STREAMING && styles.enabled,
                ].join(" ")}
            >
                {status === SoloWebRTCStatus.CONNECTED ? (
                    <i className="fa-solid fa-headphones"></i>
                ) : status === SoloWebRTCStatus.CONNECTING ? (
                    <i className="fa-solid fa-spinner"></i>
                ) : status === SoloWebRTCStatus.INITIALIZE_STREAM ? (
                    <i className="fa-solid fa-hourglass-half"></i>
                ) : status === SoloWebRTCStatus.STREAMING ? (
                    <i className="fa-solid fa-ear-listen"></i>
                ) : (
                    /* <i className="fa-solid fa-triangle-exclamation"></i> */
                    <i className="fa-solid fa-link-slash"></i>
                )}
                RTA/SOLO
            </button>
            {/*<h2 id={homeStyles.soloTitle}>
                            <i className="fa-solid fa-headphones"></i>RTA/SOLO
                        </h2>*/}
            {!hideSettings && (
                <button
                    className={homeStyles.smallBtn}
                    id={styles.pageSettingsBtn}
                    onClick={() => {
                        alert("Button currently disabled");
                        return;
                    }}
                >
                    <i className="fa-solid fa-gear"></i>
                </button>
            )}
        </>
    );
}
