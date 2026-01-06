import { useState } from "react";

export enum PEAK_HOLD_MODE {
    DB_MODE,
    METER_MODE,
    GAIN_REDUCTION_MODE,
}

export default function usePeakHoldNode(mode: PEAK_HOLD_MODE) {
    const [node] = useState(() => new PeakHoldNode(mode));
    return node;
}

class PeakHoldNode {
    private holdMs = 500; // wie lange halten
    private decayDbPerSec = 6; // Abfallrate nach der Hold-Zeit (dB pro Sekunde)

    private peakHoldDb = -60;
    private lastNewPeakTime = 0;

    constructor(mode: PEAK_HOLD_MODE) {
        if (mode === PEAK_HOLD_MODE.METER_MODE) {
            this.decayDbPerSec = this.decayDbPerSec / 60;
        } else if (mode === PEAK_HOLD_MODE.GAIN_REDUCTION_MODE) {
            this.decayDbPerSec = this.decayDbPerSec / (21 * 6); // Wegen kleinerem scale
            this.holdMs = 1000;
        }
    }

    push(dbLevel: number, now?: number) {
        this.updatePeakHold(now ?? performance.now(), dbLevel);
        return this.peakHoldDb;
    }

    private updatePeakHold(nowMs: number, newPeakDb: number) {
        // Links
        if (newPeakDb > this.peakHoldDb) {
            this.peakHoldDb = newPeakDb;
            this.lastNewPeakTime = nowMs;
        } else {
            const elapsedL = nowMs - this.lastNewPeakTime;
            if (elapsedL > this.holdMs) {
                // Decay anwenden
                const decayDb =
                    (this.decayDbPerSec * (elapsedL - this.holdMs)) / 1000;
                this.peakHoldDb = Math.max(
                    newPeakDb,
                    this.peakHoldDb - decayDb
                );
                // lastNewPeakTimeL nicht jedes Mal zurücksetzen, nur Peak-Wert absenken
            }
        }
    }
}
