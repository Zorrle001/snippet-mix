"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
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

const T_SECONDS = 5; // Zeitfenster = 5 s

let lastTime = performance.now(); // ms

const RTATab: React.FC = () => {
    const [freqPoints, setFreqPoints] = useState<DataPoint[]>([
        /* { freq: 20, level: -70 },
        { freq: 20000, level: -50 }, */
    ]);

    const [maxFreqPoints, setMaxFreqPoints] = useState<DataPoint[]>([
        /* { freq: 20, level: -70 },
        { freq: 20000, level: -50 }, */
    ]);

    const sectionRef = useRef<HTMLElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const meterAnalyser = useSoloWebRTCStore((state) => state.meterAnalyser);
    const status = useSoloWebRTCStore((state) => state.status);

    useEffect(() => {
        if (
            status !== SoloWebRTCStatus.STREAMING ||
            !meterAnalyser ||
            !canvasRef.current
        ) {
            return;
        }

        //@ts-ignore
        window.meterAnalyser = meterAnalyser;

        let rafId: NodeJS.Timeout | null = null;
        let stopped = false;

        // Allocate buffer once for this run
        const buf = new Float32Array(meterAnalyser.fftSize);

        function dbToAmp(db: number) {
            return Math.pow(10, db / 20);
        }
        function ampToDb(a: number) {
            return a <= 1e-12 ? -120 : 20 * Math.log10(a);
        }

        /**
         * Glattes log-Resampling des Analyser-Spektrums:
         * - Log-spaced Frequenzen
         * - Interpolation im Amplitudenraum (nicht direkt in dB)
         * - Optional leichtes räumliches Glätten über Nachbarpunkte
         */
        function getLogFrequencyPointsSmooth(
            analyser: AnalyserNode,
            opts?: {
                points?: number; // z. B. 512 für sehr glatt
                fMin?: number; // z. B. 20
                fMax?: number; // default sr/2
                spatialSmoothRadius?: number; // 0..N, z. B. 1..2 für leichte Glättung
                clampDb?: { min: number; max: number }; // optional
            }
        ): FreqPoint[] {
            const sr = analyser.context.sampleRate;
            const bins = analyser.frequencyBinCount;
            const fftSize = analyser.fftSize;
            const binWidth = sr / fftSize;

            const points = opts?.points ?? 512;
            const fMin = Math.max(1, opts?.fMin ?? 20);
            const fMax = Math.min(sr / 2, opts?.fMax ?? sr / 2);
            const radius = Math.max(
                0,
                Math.floor(opts?.spatialSmoothRadius ?? 0)
            );

            // 1) Rohspektrum in dB holen
            const specDb = new Float32Array(bins);
            analyser.getFloatFrequencyData(specDb);

            if (opts?.clampDb) {
                const { min, max } = opts.clampDb;
                for (let i = 0; i < specDb.length; i++) {
                    if (specDb[i] < min) specDb[i] = min;
                    else if (specDb[i] > max) specDb[i] = max;
                }
            }

            // 2) Für Interpolation in Amplitude umwandeln
            const specAmp = new Float32Array(bins);
            for (let i = 0; i < bins; i++) specAmp[i] = dbToAmp(specDb[i]);

            // 3) Log-spaced Frequenzen erzeugen und amplitudenlinear interpolieren
            const out: FreqPoint[] = new Array(points);
            const logMin = Math.log10(fMin);
            const logMax = Math.log10(fMax);

            for (let i = 0; i < points; i++) {
                const t = points > 1 ? i / (points - 1) : 0;
                const freq = Math.pow(10, logMin + t * (logMax - logMin));

                const binPos = freq / binWidth;
                const i0 = Math.min(Math.max(Math.floor(binPos), 0), bins - 1);
                const i1 = Math.min(i0 + 1, bins - 1);
                const frac = Math.min(Math.max(binPos - i0, 0), 1);

                const amp = specAmp[i0] * (1 - frac) + specAmp[i1] * frac;
                const db = ampToDb(amp);

                out[i] = { freq, level: db };
            }

            // 4) Optionale leichte räumliche Glättung über die log-Punkte (kein Banding)
            if (radius > 0) {
                const smoothed = new Array<FreqPoint>(points);
                for (let i = 0; i < points; i++) {
                    let sum = 0;
                    let wsum = 0;
                    // einfacher dreieckiger Kernel (1D)
                    for (let k = -radius; k <= radius; k++) {
                        const j = i + k;
                        if (j < 0 || j >= points) continue;
                        const w = radius + 1 - Math.abs(k); // 3,2,1... Gewichte
                        sum += out[j].level * w;
                        wsum += w;
                    }
                    smoothed[i] = { freq: out[i].freq, level: sum / wsum };
                }
                return smoothed;
            }

            return out;
        }

        function getFreqPoints(analyser: AnalyserNode): FreqPoint[] {
            const sr = analyser.context.sampleRate;
            const binCount = analyser.frequencyBinCount;
            const fftSize = analyser.fftSize;
            const binWidth = sr / fftSize;

            // 1) Rohspektrum in dB holen
            const specDb = new Float32Array(binCount);
            analyser.getFloatFrequencyData(specDb);

            // In Array von Objekten umwandeln
            const result = new Array(binCount);
            for (let i = 0; i < binCount; i++) {
                const freq = i * binWidth;
                const levelDB = specDb[i]; // dBFS
                const levelPower = Math.pow(10, levelDB / 10);
                result[i] = { freq, level: levelPower };
            }

            const newResult = [];
            let avgStack = [];
            for (const point of result) {
                //newResult.push(point);
                //continue;
                const avgCount = Math.floor(point.freq / 500);
                //const avgCount = 2 * Math.floor(point.freq / 500);

                if (avgCount === 0) {
                    newResult.push(point);
                } else {
                    if (avgStack.length < avgCount) {
                        avgStack.push(point);
                    } else {
                        let avgLevel = undefined;
                        for (const p of [...avgStack, point]) {
                            if (!avgLevel) avgLevel = p.level;
                            else avgLevel += p.level;
                        }
                        avgLevel = avgLevel / (avgCount + 1);

                        let avgFreq = undefined;
                        for (const p of [...avgStack, point]) {
                            if (!avgFreq) avgFreq = p.freq;
                            else avgFreq += p.freq;
                        }
                        avgFreq = avgFreq / (avgCount + 1);

                        newResult.push({ freq: avgFreq, level: avgLevel });

                        avgStack = [];
                    }
                }
            }

            let avgLevel = undefined;
            for (const p of avgStack) {
                if (!avgLevel) avgLevel = p.level;
                else avgLevel += p.level;
            }
            avgLevel = avgLevel / avgStack.length;

            let avgFreq = undefined;
            for (const p of avgStack) {
                if (!avgFreq) avgFreq = p.freq;
                else avgFreq += p.freq;
            }
            avgFreq = avgFreq / avgStack.length;

            newResult.push({ freq: avgFreq, level: avgLevel });

            avgStack = [];

            for (const r of newResult) {
                r.level = 10 * Math.log10(r.level);
            }

            return newResult;
        }

        const loop = () => {
            if (stopped) return;

            /* const freqPoints = getLogFrequencyPoints(meterAnalyser, {
                smoothAlpha: computeAlpha(0.05),
            }); */
            /* const freqPoints = getLogFrequencyPointsSmooth(meterAnalyser, {
                //points: 256,
                fMin: 20,
                fMax: meterAnalyser.context.sampleRate / 2,
                //smoothTauSec: 0.12, // ≈ 120 ms “Trägheit”
                clampDb: { min: -100, max: 0 },
            }); */
            const freqPoints = getFreqPoints(meterAnalyser);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const rect = canvas.getBoundingClientRect();

            const needResize =
                canvas.width !== Math.floor(rect.width) ||
                canvas.height !== Math.floor(rect.height);

            if (needResize) {
                // Achtung: Das löscht den Inhalt. Danach neu zeichnen oder initialisieren.
                canvas.width = Math.floor(rect.width);
                canvas.height = Math.floor(rect.height);
            }

            // Jetzt verschieben (nur sinnvoll, wenn Inhalt vorhanden ist)
            const w = canvas.width;
            const h = canvas.height;

            const now = performance.now();
            const deltaMs = now - lastTime;

            // Wieviele Pixel scrollen?
            const deltaPxFloat = (deltaMs / 1000) * (h / T_SECONDS);
            const deltaPx = Math.floor(deltaPxFloat); // ganzzahlige Zeilen

            if (deltaPx <= 0) {
                // Noch nicht genug Zeit vergangen, um 1px zu scrollen
                // Du kannst optional subpixel akkumulieren.
                return;
            }
            lastTime = now;

            if (w > 0 && h > 1) {
                ctx.drawImage(
                    canvas,
                    0,
                    0,
                    w,
                    h - deltaPx,
                    0,
                    deltaPx,
                    w,
                    h - deltaPx
                );
                // optional: oberste Zeile leeren/färben
                // ctx.clearRect(0, 0, w, 1);
            }

            function freqToX(
                f: number,
                width: number,
                fMin = 20,
                fMax = 20000
            ) {
                if (f <= 0) return 0; // Schutz
                const ln = Math.log;
                const a = ln(fMin);
                const b = ln(fMax);
                const t = (ln(f) - a) / (b - a); // 0..1
                return Math.max(0, Math.min(width, t * width));
            }

            setMaxFreqPoints((maxFreqPoints) => {
                const newMaxFrequencyPoints = [];
                let lastPoint = undefined;
                for (const p of freqPoints) {
                    if (ctx) {
                        if (!lastPoint) {
                            ctx.fillStyle = gradientMultiGamma(
                                mapDbToUnit(p.level)
                            );
                            ctx.fillRect(freqToX(p.freq, w), 0, 1, 1);
                        } else {
                            const x0 = Math.floor(freqToX(lastPoint.freq, w));
                            const y0 = lastPoint.level;
                            const x1 = Math.floor(freqToX(p.freq, w));
                            const y1 = p.level;

                            if (x1 > x0) {
                                const dx = x1 - x0;
                                const dy = y1 - y0;
                                const m = dy / dx; // Steigung
                                for (let x = x0; x <= x1; x++) {
                                    const levelY = y0 + m * (x - x0); // y = y0 + m*(x - x0)
                                    ctx.fillStyle = gradientMultiGamma(
                                        mapDbToUnit(levelY)
                                    );
                                    ctx.fillRect(x, 0, 1, 1);
                                }
                            }
                        }
                    }

                    const mfp = maxFreqPoints.find(
                        (mfp) => mfp.freq === p.freq
                    );
                    if (mfp === undefined || mfp.level < p.level) {
                        newMaxFrequencyPoints.push(p);
                    } else {
                        newMaxFrequencyPoints.push(mfp);
                    }

                    lastPoint = p;
                }
                return newMaxFrequencyPoints;
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
    }, [meterAnalyser, status, canvasRef]);

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
                        scale={"log"}
                        dataKey={"level"}
                        stroke={"orange"}
                        fill={`color-mix(in hsl, ${"orange"}, transparent 70%)`}
                        strokeWidth={1}
                        name={`RTA`}
                        dot={false}
                        data={freqPoints}
                        isAnimationActive={false}
                        baseValue={-100}
                        /* connectNulls={false} */
                    />
                    <Line
                        yAxisId="left"
                        type="linear"
                        dataKey={"level"}
                        stroke={"red"}
                        fill={"red"}
                        strokeWidth={1}
                        name={`max Level`}
                        dot={false}
                        data={maxFreqPoints}
                        isAnimationActive={false}
                        //baseValue={-100}
                        /* connectNulls={false} */
                    />
                </ComposedChart>
            </ResponsiveContainer>
        ),
        [freqPoints, maxFreqPoints]
    );

    // MARK: SECTION
    return (
        <section ref={sectionRef} id={styles.equalizerTab}>
            {RTAGraph}

            <canvas ref={canvasRef}></canvas>
            <button
                onClick={() => {
                    setMaxFreqPoints([]);
                }}
            >
                RESET MAX
            </button>
        </section>
    );
};

export default RTATab;

function srgbToLinear(c: number) {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function gradientMultiGamma(t: number) {
    t = Math.min(1, Math.max(0, t));

    const stops = [
        { t: 0.0, color: [0x00, 0x00, 0x8b] },
        { t: 0.25, color: [0x80, 0x00, 0xff] },
        { t: 0.5, color: [0xff, 0x66, 0xb2] },
        { t: 0.75, color: [0xff, 0xff, 0x00] },
        { t: 1.0, color: [0xff, 0xff, 0xff] },
    ];

    // Segment bestimmen
    let i = 0;
    while (i < stops.length - 1 && t > stops[i + 1].t) i++;
    const A = stops[i];
    const B = stops[Math.min(i + 1, stops.length - 1)];
    const u = A.t === B.t ? 0 : (t - A.t) / (B.t - A.t);

    // sRGB -> linear, interpolieren, zurück
    const Alin = A.color.map(srgbToLinear);
    const Blin = B.color.map(srgbToLinear);
    const r = Math.round(
        Math.max(
            0,
            Math.min(255, linearToSrgb(lerp(Alin[0], Blin[0], u)) * 255)
        )
    );
    const g = Math.round(
        Math.max(
            0,
            Math.min(255, linearToSrgb(lerp(Alin[1], Blin[1], u)) * 255)
        )
    );
    const b = Math.round(
        Math.max(
            0,
            Math.min(255, linearToSrgb(lerp(Alin[2], Blin[2], u)) * 255)
        )
    );

    return `rgb(${r}, ${g}, ${b})`;
}

function mapDbToUnit(x: number) {
    // x in dB, erwartet in [-130, 0]
    const y = (x + 100) / 100;
    return Math.min(1, Math.max(0, y));
}
