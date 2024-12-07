"use client";

import { useEffect, useRef } from "react";

type FilterType = "lowShelf" | "highShelf" | "peaking" | "highPass";

interface Filter {
    filterType: FilterType;
    f0: number; // Center frequency in Hz
    G?: number; // Gain in dB (optional for High Pass)
    Q?: number; // Quality factor (optional for Low and High Shelf)
}

interface EqualizerCurveProps {
    lowShelf: Filter;
    lowMid: Filter;
    highMid: Filter;
    highShelf: Filter;
    highPass: Filter;
    fs: number; // Sampling Rate (e.g., 44100 Hz)
}

const EqualizerCurve: React.FC<EqualizerCurveProps> = ({
    lowShelf,
    lowMid,
    highMid,
    highShelf,
    highPass,
    fs,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const calculateDBGain = (f: number, filter: Filter): number => {
        const { f0, G = 0, Q = 1, filterType } = filter;
        const A = Math.pow(10, G / 40); // Gain factor
        const omega = (2 * Math.PI * f) / fs;
        const sin_omega = Math.sin(omega);
        const cos_omega = Math.cos(omega);

        switch (filterType) {
            case "lowShelf":
                const alpha_ls = sin_omega / (2 * Math.sqrt(A));
                const b0_ls =
                    A *
                    (A + 1 - (A - 1) * cos_omega + 2 * Math.sqrt(A) * alpha_ls);
                const b1_ls = 2 * A * (A - 1 - (A + 1) * cos_omega);
                const b2_ls =
                    A *
                    (A + 1 - (A - 1) * cos_omega - 2 * Math.sqrt(A) * alpha_ls);
                const a0_ls =
                    A + 1 + (A - 1) * cos_omega + 2 * Math.sqrt(A) * alpha_ls;
                const a1_ls = -2 * (A - 1 + (A + 1) * cos_omega);
                const a2_ls =
                    A + 1 + (A - 1) * cos_omega - 2 * Math.sqrt(A) * alpha_ls;
                return (
                    20 *
                    Math.log10(
                        Math.sqrt(
                            (b0_ls * b0_ls + b1_ls * b1_ls + b2_ls * b2_ls) /
                                (a0_ls * a0_ls + a1_ls * a1_ls + a2_ls * a2_ls)
                        )
                    )
                );

            case "highShelf":
                const alpha_hs = sin_omega / (2 * Math.sqrt(A));
                const b0_hs =
                    A *
                    (A + 1 + (A - 1) * cos_omega + 2 * Math.sqrt(A) * alpha_hs);
                const b1_hs = -2 * A * (A - 1 + (A + 1) * cos_omega);
                const b2_hs =
                    A *
                    (A + 1 + (A - 1) * cos_omega - 2 * Math.sqrt(A) * alpha_hs);
                const a0_hs =
                    A + 1 - (A - 1) * cos_omega + 2 * Math.sqrt(A) * alpha_hs;
                const a1_hs = 2 * (A - 1 - (A + 1) * cos_omega);
                const a2_hs =
                    A + 1 - (A - 1) * cos_omega - 2 * Math.sqrt(A) * alpha_hs;
                return (
                    20 *
                    Math.log10(
                        Math.sqrt(
                            (b0_hs * b0_hs + b1_hs * b1_hs + b2_hs * b2_hs) /
                                (a0_hs * a0_hs + a1_hs * a1_hs + a2_hs * a2_hs)
                        )
                    )
                );

            case "peaking":
                const alpha_pk = sin_omega / (2 * Q);
                const b0_pk = 1 + alpha_pk * A;
                const b1_pk = -2 * cos_omega;
                const b2_pk = 1 - alpha_pk * A;
                const a0_pk = 1 + alpha_pk / A;
                const a1_pk = -2 * cos_omega;
                const a2_pk = 1 - alpha_pk / A;
                return (
                    20 *
                    Math.log10(
                        Math.sqrt(
                            (b0_pk * b0_pk + b1_pk * b1_pk + b2_pk * b2_pk) /
                                (a0_pk * a0_pk + a1_pk * a1_pk + a2_pk * a2_pk)
                        )
                    )
                );

            case "highPass":
                const Q_hp = Q || 0.707; // Default Q for high pass if not specified
                const alpha_hp = sin_omega / (2 * Q_hp);
                const b0_hp = (1 + cos_omega) / 2;
                const b1_hp = -(1 + cos_omega);
                const b2_hp = (1 + cos_omega) / 2;
                const a0_hp = 1 + alpha_hp;
                const a1_hp = -2 * cos_omega;
                const a2_hp = 1 - alpha_hp;
                return (
                    20 *
                    Math.log10(
                        Math.sqrt(
                            (b0_hp * b0_hp + b1_hp * b1_hp + b2_hp * b2_hp) /
                                (a0_hp * a0_hp + a1_hp * a1_hp + a2_hp * a2_hp)
                        )
                    )
                );

            default:
                return 0;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x < width; x++) {
            const f = 20 * Math.pow(10, (x / width) * 3.5);
            let totalDBGain = 0;

            [lowShelf, lowMid, highMid, highShelf, highPass].forEach(
                (filter) => {
                    totalDBGain += calculateDBGain(f, filter);
                }
            );

            const amplitude = Math.pow(10, totalDBGain / 20);
            const y = height / 2 - (amplitude * (height / 2)) / 2;

            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }, [lowShelf, lowMid, highMid, highShelf, highPass, fs]);

    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={200}
            style={{ background: "#1e1e1e" }}
        />
    );
};

export default function Page() {
    return (
        <EqualizerCurve
            fs={44100}
            lowShelf={{ filterType: "lowShelf", f0: 100, G: 0 }}
            lowMid={{ filterType: "peaking", f0: 500, G: -12, Q: 1 }}
            highMid={{ filterType: "peaking", f0: 3000, G: 0, Q: 1 }}
            highShelf={{ filterType: "highShelf", f0: 10000, G: 0 }}
            highPass={{ filterType: "highPass", f0: 50 }}
        />
    );
}
