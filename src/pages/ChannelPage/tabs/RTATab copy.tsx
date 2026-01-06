"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import {
    SoloWebRTCStatus,
    useSoloWebRTCStore,
} from "@/hooks/useSoloWebRTCAudioStore";
import styles from "@/styles/ChannelPage/tabs/EqualizerTabStyles.module.scss";

interface DataPoint {
    freq: number;
    [key: string]: number; // Dynamische Felder für Magnitude und Phase
}

type FreqPoint = { freq: number; level: number };

const RTATab: React.FC = () => {
    const [freqPoints, setFreqPoints] = useState<DataPoint[]>([]);

    const sectionRef = useRef<HTMLElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);

    const meterAnalyser = useSoloWebRTCStore((state) => state.meterAnalyser);
    const status = useSoloWebRTCStore((state) => state.status);

    useEffect(() => {
        if (status !== SoloWebRTCStatus.STREAMING || !meterAnalyser) {
            return;
        }

        //@ts-ignore
        window.meterAnalyser = meterAnalyser;

        let rafId: NodeJS.Timeout | null = null;
        let stopped = false;

        // Allocate buffer once for this run
        const buf = new Float32Array(meterAnalyser.fftSize);

        const normFromDb = (db: number, minDb = -60) => {
            const norm = (db - minDb) / -minDb;
            // clamp
            return Math.min(1, Math.max(0, norm));
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

        function getFrequencyPoints(
            analyser: AnalyserNode,
            sampleRate = analyser.context.sampleRate
        ): FreqPoint[] {
            const bins = analyser.frequencyBinCount; // = fftSize / 2
            const data = new Float32Array(bins);
            analyser.getFloatFrequencyData(data); // dB-Werte

            const binWidthHz = sampleRate / analyser.fftSize; // Frequenzauflösung pro Bin
            const points: FreqPoint[] = new Array(bins);

            for (let i = 0; i < bins; i++) {
                const freq = i * binWidthHz;
                const level = data[i]; // dBFS
                points[i] = { freq, level };
            }
            return points;
        }

        function getLogBandedSpectrum(
            analyser: AnalyserNode,
            options?: {
                bandsPerOctave?: number; // z. B. 24
                fMin?: number; // z. B. 20 Hz
                fMax?: number; // z. B. sampleRate/2
                energyAverage?: boolean; // true = Energie-Mittel (empfohlen), false = dB-Mittel
            }
        ): FreqPoint[] {
            const sr = analyser.context.sampleRate;
            const specBins = analyser.frequencyBinCount;
            const fftSize = analyser.fftSize;
            const binWidth = sr / fftSize;

            const fMin = Math.max(1, options?.fMin ?? 20);
            const fMax = Math.min(sr / 2, options?.fMax ?? sr / 2);
            const bpo = options?.bandsPerOctave ?? 24;
            const energyAvg = options?.energyAverage ?? true;

            // Rohdaten holen
            const spec = new Float32Array(specBins);
            analyser.getFloatFrequencyData(spec); // dBFS

            // Bänder aufbauen
            const bands: FreqPoint[] = [];
            const log2 = Math.log(2);
            const step = Math.pow(2, 1 / bpo); // Frequenzfaktor pro Band

            // Starte bei fMin, gehe in Schritten von step bis fMax
            for (let fLo = fMin; fLo < fMax; fLo *= step) {
                const fHi = Math.min(fLo * step, fMax);
                const fCenter = Math.sqrt(fLo * fHi); // geometrisches Mittel

                // Bin-Range
                const iStart = Math.max(0, Math.floor(fLo / binWidth));
                const iEnd = Math.min(specBins - 1, Math.floor(fHi / binWidth));

                if (iEnd < iStart) continue;

                if (energyAvg) {
                    // Energie-Mittelung (dB -> linear, Mittel, zurück zu dB)
                    let sumLin = 0;
                    let count = 0;
                    for (let i = iStart; i <= iEnd; i++) {
                        const lin = Math.pow(10, spec[i] / 20);
                        sumLin += lin * lin; // Leistung
                        count++;
                    }
                    const meanLin = count > 0 ? Math.sqrt(sumLin / count) : 0;
                    const level =
                        meanLin > 1e-12 ? 20 * Math.log10(meanLin) : -120;
                    bands.push({ freq: fCenter, level });
                } else {
                    // Einfaches dB-Mittel
                    let sum = 0;
                    let count = 0;
                    for (let i = iStart; i <= iEnd; i++) {
                        sum += spec[i];
                        count++;
                    }
                    const level = count > 0 ? sum / count : -120;
                    bands.push({ freq: fCenter, level });
                }
            }

            return bands;
        }

        // außerhalb der Funktion persistieren:
        let prevSpec: Float32Array | null = null;

        function smoothSpectrumExp(
            prev: Float32Array | null,
            cur: Float32Array,
            alpha: number
        ): Float32Array {
            if (!prev || prev.length !== cur.length) return cur.slice();
            const out = new Float32Array(cur.length);
            for (let i = 0; i < cur.length; i++) {
                out[i] = prev[i] + alpha * (cur[i] - prev[i]);
            }
            return out;
        }

        function getLogFrequencyPoints(
            analyser: AnalyserNode,
            options?: {
                points?: number;
                fMin?: number;
                fMax?: number;
                smoothAlpha?: number; // 0..1, z. B. 0.15
            }
        ): FreqPoint[] {
            const sr = analyser.context.sampleRate;
            const bins = analyser.frequencyBinCount;
            const fftSize = analyser.fftSize;
            const binWidth = sr / fftSize;

            const pts = options?.points ?? 256;
            const fMin = Math.max(1, options?.fMin ?? 20);
            const fMax = Math.min(sr / 2, options?.fMax ?? sr / 2);
            const alpha = options?.smoothAlpha ?? 0; // 0 = keine Glättung

            // 1) Spektrum holen
            let spec = new Float32Array(bins);
            analyser.getFloatFrequencyData(spec); // dBFS

            // 2) zeitliche Glättung der Bins (optional)
            if (alpha > 0) {
                spec = smoothSpectrumExp(prevSpec, spec, alpha);
                prevSpec = spec;
            } else {
                prevSpec = spec;
            }

            // 3) Log-Resampling
            const logPoints: FreqPoint[] = new Array(pts);
            const logMin = Math.log10(fMin);
            const logMax = Math.log10(fMax);

            for (let i = 0; i < pts; i++) {
                const t = i / (pts - 1);
                const freq = Math.pow(10, logMin + t * (logMax - logMin));

                const binPos = freq / binWidth;
                const i0 = Math.min(Math.max(Math.floor(binPos), 0), bins - 1);
                const i1 = Math.min(i0 + 1, bins - 1);
                const frac = Math.min(Math.max(binPos - i0, 0), 1);

                const level = spec[i0] * (1 - frac) + spec[i1] * frac;
                logPoints[i] = { freq, level };
            }

            return logPoints;
        }

        let lastTs = performance.now();
        function computeAlpha(tauSec: number) {
            const now = performance.now();
            const dt = (now - lastTs) / 1000;
            lastTs = now;
            return 1 - Math.exp(-dt / tauSec);
        }

        const loop = () => {
            if (stopped) return;

            const freqPoints = getLogFrequencyPoints(meterAnalyser, {
                smoothAlpha: computeAlpha(0.05),
            });
            setFreqPoints(freqPoints);
        };

        rafId = setInterval(loop, 0);

        // Cleanup when status/analyser changes or on unmount
        return () => {
            stopped = true;
            if (rafId != null) clearInterval(rafId);

            setFreqPoints([]);
        };
    }, [meterAnalyser, status]);

    const RTAGraph = useMemo(
        () => (
            <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
                <ComposedChart
                    data={freqPoints}
                    margin={{
                        left: 0.5 * 16,
                        right: 2 * 16,
                    }}
                >
                    <CartesianGrid
                        /* strokeDasharray="3 3" */
                        stroke={"#333"}
                    />
                    <XAxis
                        dataKey="freq"
                        scale="log"
                        domain={[20, 20000]}
                        type="number"
                        tickFormatter={(tick) => {
                            if (tick >= 1000) {
                                return `${(tick / 1000).toFixed(0)}kHz`;
                            }
                            return `${tick.toFixed(0)}Hz`;
                        }}
                        ticks={[
                            20, 50, 100, 200, 500, 1000, 2000, 5000, 10000,
                            15000, 20000,
                        ]}
                        tickMargin={0.5 * 16}
                        allowDataOverflow
                    />
                    <YAxis
                        yAxisId="left"
                        domain={[-100, 0]} // Magnitude-Bereich begrenzen
                        /* label={{
                            value: "Magnitude (dB)",
                            angle: -90,
                            position: "insideLeft",
                        }} */
                        dataKey={"level"}
                        allowDataOverflow
                        ticks={[
                            -100, -90, -80, -70, -60, -50, -40, -30, -20, -10,
                            0,
                        ]}
                        tickFormatter={(tick) => {
                            return `${tick}dB`;
                        }}
                        tickMargin={0.5 * 16}
                    />
                    {
                        /* <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="level"
                        stroke="blue" // Schwarz für Resultierende Magnitude
                        /* strokeWidth={4} */
                        //strokeWidth={3}
                        /* strokeDasharray={"15 15"} */
                        //name="RTA"
                        //dot={false}
                        //isAnimationActive={false}
                        ///> */}*/}
                    }
                    <Area
                        yAxisId="left"
                        type="linear"
                        dataKey={"level"}
                        stroke={"orange"}
                        fill={`color-mix(in hsl, ${"orange"}, transparent 70%)`}
                        strokeWidth={1}
                        name={`Gain Reduction Curve`}
                        dot={false}
                        data={freqPoints}
                        isAnimationActive={false}
                        baseValue={-100}
                        /* connectNulls={false} */
                    />
                </ComposedChart>
            </ResponsiveContainer>
        ),
        [freqPoints]
    );

    // MARK: SECTION
    return (
        <section ref={sectionRef} id={styles.equalizerTab}>
            {RTAGraph}
        </section>
    );
};

export default RTATab;
