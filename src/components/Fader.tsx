import { FontClassName } from "@/app/layout";
import { useChannelPageStore } from "@/hooks/useChannelPageStore";
import styles from "@/styles/FaderStyles.module.scss";
import { cn } from "@/utils/Utils";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { SnippetObjChannelObjType } from "./PopUps/CreateSnippetPopUp";
import SlimChannelCard from "./SlimChannelCard";

type Props = {
    channelID: string;
    channelObj: SnippetObjChannelObjType;
    onChange: (value: number) => void;
    onChannelObjUpdate: () => void;
    sendsActive?: boolean;
    glowColor?: string;
    sendsActiveStartingStyle?: boolean;
};

export default function Fader({
    channelID,
    channelObj,
    onChange,
    onChannelObjUpdate,
    sendsActive = false,
    glowColor = undefined,
    sendsActiveStartingStyle,
}: Props) {
    /*const [value, setValue] = useState(
        channelObj.fader.value ? channelObj.fader.value : 0
    );*/

    // RANGE:
    // -inf db: −8832
    // 0 db: 0
    // +10db: 640

    let value = channelObj.fader.value ? channelObj.fader.value : -8832;
    let pos = valueToFaderPos(value);

    console.log("FADER", channelID, value, pos);

    const [moving, setMoving] = useState(false);

    const trackRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const sliderValueRef = useRef<HTMLParagraphElement | null>(null);

    const [thumbOffset, setThumbOffset] = useState(0);

    const setSelectedChannelID = useChannelPageStore(
        (state) => state.setSelectedChannelID
    );
    const setSelectedChannelObj = useChannelPageStore(
        (state) => state.setSelectedChannelObj
    );

    useEffect(() => {
        // TO PREVENT STUCK PERCENTAGE AFTER MANUAL CHANGE AND THEN SERVER RECIEVED CHANGE
        const newValue = channelObj.fader.value
            ? channelObj.fader.value
            : -8832;

        const newPos = valueToFaderPos(newValue);
        const db = faderPosToQuantizedDb(newPos).toFixed(1);

        if (!sliderValueRef.current) {
            value = newValue;
            pos = newPos;
            return;
        }

        if (value !== newValue) {
            sliderValueRef.current.innerText = `${db}db`;
        }

        value = newValue;
        pos = newPos;
    }, [channelObj]);

    return (
        <article
            id={styles.fader}
            onMouseMove={move}
            onMouseUp={(e) => {
                if (moving && trackRef.current) {
                    move(e);
                    setMoving(false);
                    onChange(value);
                }
            }}
        >
            <section
                id={styles.propertySection}
                /* className={channelObj.gain.enabled ? "" : styles.disabled} */
                className={styles.disabled}
                onClick={() => {
                    setSelectedChannelID(channelID);
                    setSelectedChannelObj(channelObj);
                }}
            >
                <button
                    id={styles.propertySelBtn}
                    onClick={() => {
                        /* channelObj.gain.enabled = !channelObj.gain.enabled;
                        onChannelObjUpdate(); */
                    }}
                >
                    {
                        /* channelObj.gain.enabled */ false ? (
                            <i className="fa-regular fa-circle-check"></i>
                        ) : (
                            <i className="fa-regular fa-circle"></i>
                        )
                    }
                </button>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="37 -5 120 100"
                    width="120"
                    height="100"
                >
                    <path
                        className={styles.grey}
                        d="M55,90
               A55,55 0 1,1 140,90"
                        style={{ fill: "none" }}
                    />
                    <path
                        className={styles.red}
                        d="M55,90
               A55,55 0 1,1 140,90"
                        style={{ fill: "none" }}
                    />
                </svg>
                <p id={styles.gainValue}>+28</p>
            </section>
            <section
                id={styles.buttonSection}
                className={channelObj.state.enabled ? "" : styles.disabled}
            >
                <button
                    id={styles.mutePropertySelBtn}
                    onClick={() => {
                        channelObj.state.enabled = !channelObj.state.enabled;
                        onChannelObjUpdate();
                    }}
                >
                    {channelObj.state.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
                <button
                    id={styles.onButton}
                    className={cn(
                        FontClassName,
                        channelObj.state.value != true ? styles.muted : ""
                    )}
                    onClick={() => {
                        channelObj.state.value = !channelObj.state.value;
                        onChannelObjUpdate();
                    }}
                >
                    ON
                </button>
            </section>
            <div id={styles.faderPropertySelBtn}>
                <button
                    className={channelObj.fader.enabled ? "" : styles.disabled}
                    onClick={() => {
                        channelObj.fader.enabled = !channelObj.fader.enabled;
                        onChannelObjUpdate();
                    }}
                >
                    {channelObj.fader.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
            </div>
            <section
                id={styles.sliderSection}
                className={channelObj.fader.enabled ? "" : styles.disabled}
            >
                <div
                    id={styles.sliderTrack}
                    ref={trackRef}
                    style={
                        {
                            "--glowColor": glowColor
                                ? glowColor
                                : "transparent",
                        } as CSSProperties
                    }
                >
                    <div
                        id={styles.sliderThumb}
                        className={moving ? styles.noTransition : ""}
                        onMouseDown={(e) => {
                            if (thumbRef.current) {
                                const thumbHeight =
                                    thumbRef.current.offsetHeight;
                                const thumbOffset =
                                    e.pageY -
                                    thumbRef.current.getBoundingClientRect().y -
                                    thumbHeight / 2;
                                setThumbOffset(thumbOffset);
                            }
                            setMoving(true);
                        }}
                        onTouchStart={(e) => {
                            if (thumbRef.current) {
                                const thumbHeight =
                                    thumbRef.current.offsetHeight;
                                const thumbOffset =
                                    e.changedTouches.item(0).pageY -
                                    thumbRef.current.getBoundingClientRect().y -
                                    thumbHeight / 2;
                                setThumbOffset(thumbOffset);
                            }
                            setMoving(true);
                        }}
                        onTouchMove={move}
                        onTouchEnd={(e) => {
                            if (moving && trackRef.current) {
                                move(e);
                                setMoving(false);
                                onChange(value);
                            }
                        }}
                        style={
                            {
                                "--value": pos,
                            } as React.CSSProperties
                        }
                        ref={thumbRef}
                    ></div>
                    <ul id={styles.sliderTrackLabels}>
                        <li
                            style={{
                                top: 0 + "%",
                            }}
                        >
                            10
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(5) * 100 + "%",
                            }}
                        >
                            5
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(0) * 100 + "%",
                            }}
                        >
                            0
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-5) * 100 + "%",
                            }}
                        >
                            5
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-10) * 100 + "%",
                            }}
                        >
                            10
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-15) * 100 + "%",
                            }}
                        >
                            15
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-20) * 100 + "%",
                            }}
                        >
                            20
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-30) * 100 + "%",
                            }}
                        >
                            30
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-40) * 100 + "%",
                            }}
                        >
                            40
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-60) * 100 + "%",
                            }}
                        >
                            60
                        </li>
                        <li
                            style={{
                                top: 100 - dbToFaderPos(-138) * 100 + "%",
                            }}
                        >
                            <i className="fa-solid fa-infinity"></i>
                        </li>
                    </ul>
                </div>
                <p id={styles.sliderValue} ref={sliderValueRef}>
                    {faderPosToQuantizedDb(pos).toFixed(1)}db
                </p>
            </section>
            <section
                id={styles.channelCardSection}
                className={
                    !channelObj.state.enabled &&
                    /* !channelObj.gain.enabled && */
                    !channelObj.fader.enabled
                        ? styles.disabled
                        : ""
                }
            >
                <SlimChannelCard
                    id={channelID}
                    name={channelID}
                    onClick={() => {}}
                    sendsActive={sendsActive}
                    sendsActiveStartingStyle={sendsActiveStartingStyle}
                />
            </section>
        </article>
    );

    function move(e: TouchEvent | any) {
        if (
            moving &&
            trackRef.current &&
            thumbRef.current &&
            sliderValueRef.current
        ) {
            //e.preventDefault();

            // @ts-ignore
            const y = e.pageY ? e.pageY : e.changedTouches.item(0)?.pageY;

            const offsetTop = trackRef.current.getBoundingClientRect().y;

            const height = trackRef.current.offsetHeight;

            const dY = y - offsetTop - thumbOffset;
            const percentage = Math.max(Math.min(1 - dY / height, 1), 0);

            //console.log(y, offsetTop, height, dY, percentage);

            //setValue(percentage);
            value = faderPosToValue(percentage);
            pos = faderPosToValue(percentage);
            thumbRef.current.style.setProperty("--value", `${percentage}`);
            sliderValueRef.current.innerText = `${faderPosToQuantizedDb(
                percentage
            ).toFixed(1)}db`;

            console.log("SET NEW VALUE");
            /*sliderValueRef.current.dataset.value = (percentage * 100).toFixed(
                2
            );*/

            /* sliderValueRef.current.style.setProperty(
                "background",
                `rgb(${percentage * 250}, 0, 0)`
            ); */
        }
    }
}

function percentToDb(percent: number) {
    if (percent <= 0) return -Infinity; // -∞ dB
    if (percent >= 100) return 10; // Max is 10 dB

    // Define the range of dB values based on the image
    const minDb = -60;
    const maxDb = 10;

    // Apply a logarithmic formula to scale the percentage to dB
    const dbValue =
        minDb +
        (Math.log10(percent / 100) / Math.log10(0.01)) * (maxDb - minDb);

    return dbValue;
}

// CLAUDE STUFF
// Audio Fader Conversion Functions
// Based on pixel-accurate analysis of fader scale
// pos=0 (bottom) = -138dB (-∞), pos=1 (top) = +10dB
// -∞ to 0dB: Logarithmic curve
// 0dB to +10dB: Linear

const MIN_DB = -138; // -∞ dB represented as -138dB
const MAX_DB = 10; // +10 dB
const UNITY_DB = 0; // 0 dB (unity gain)

// Pixel-accurate positions extracted from better image
const FADER_SCALE_POINTS = [
    { pos: 0.0, db: -138 }, // -∞ (bottom)
    { pos: 0.06, db: -60 }, // -60dB
    { pos: 0.14, db: -40 }, // -40dB
    { pos: 0.25, db: -30 }, // -30dB
    { pos: 0.32, db: -25 }, // -25dB
    { pos: 0.4, db: -20 }, // -20dB
    { pos: 0.51, db: -15 }, // -15dB
    { pos: 0.63, db: -10 }, // -10dB
    { pos: 0.74, db: -5 }, // -5dB
    { pos: 0.84, db: 0 }, // 0dB (unity gain)
    { pos: 0.92, db: 5 }, // +5dB
    { pos: 1.0, db: 10 }, // +10dB (top)
];

// Find unity gain position (0dB)
const UNITY_POS = 0.84;

/**
 * Converts fader position (0-1) to decibel value using pixel-accurate interpolation
 * @param pos - Fader position from 0 (bottom) to 1 (top)
 * @returns Decibel value from -138dB to +10dB
 */
function faderPosToDb(pos: number): number {
    // Clamp position to valid range
    pos = Math.max(0, Math.min(1, pos));

    // Find the two closest scale points and interpolate
    for (let i = 0; i < FADER_SCALE_POINTS.length - 1; i++) {
        const current = FADER_SCALE_POINTS[i];
        const next = FADER_SCALE_POINTS[i + 1];

        if (pos >= current.pos && pos <= next.pos) {
            // Linear interpolation between the two points
            const ratio = (pos - current.pos) / (next.pos - current.pos);
            return current.db + ratio * (next.db - current.db);
        }
    }

    // Fallback (shouldn't happen with proper clamping)
    return pos === 0 ? MIN_DB : MAX_DB;
}

/**
 * Converts decibel value to fader position using pixel-accurate interpolation
 * @param db - Decibel value from -138dB to +10dB
 * @returns Fader position from 0 to 1
 */
function dbToFaderPos(db: number): number {
    // Clamp dB to valid range
    db = Math.max(MIN_DB, Math.min(MAX_DB, db));

    // Find the two closest scale points and interpolate
    for (let i = 0; i < FADER_SCALE_POINTS.length - 1; i++) {
        const current = FADER_SCALE_POINTS[i];
        const next = FADER_SCALE_POINTS[i + 1];

        if (db >= current.db && db <= next.db) {
            // Linear interpolation between the two points
            const ratio = (db - current.db) / (next.db - current.db);
            return current.pos + ratio * (next.pos - current.pos);
        }
    }

    // Fallback (shouldn't happen with proper clamping)
    return db <= MIN_DB ? 0 : 1;
}

/**
 * Converts raw audio value back to fader position (0-1)
 * @param value - Raw value from -8832 to 640 (must be integer)
 * @returns Fader position from 0 to 1
 */
function valueToFaderPos(value: number): number {
    // Ensure value is integer and clamp to valid range
    value = Math.round(value);
    value = Math.max(-8832, Math.min(640, value));

    // Convert raw value to dB first
    let db: number;
    if (value <= -8832) {
        db = MIN_DB;
    } else if (value >= 640) {
        db = MAX_DB;
    } else if (value === 0) {
        db = 0;
    } else if (value > 0) {
        // Between 0 and +10dB
        db = (value / 640) * 10;
    } else {
        // Between -138dB and 0dB
        db = MIN_DB + ((value + 8832) / 8832) * 138;
    }

    // Convert dB to position using pixel-accurate interpolation
    return dbToFaderPos(db);
}

/**
 * Converts fader position to quantized raw value (integer only)
 * @param pos - Fader position from 0 (bottom/-∞) to 1 (top/+10dB)
 * @returns Integer raw value from -8832 to 640
 */
function faderPosToValue(pos: number): number {
    // Clamp position to valid range
    pos = Math.max(0, Math.min(1, pos));

    const db = faderPosToDb(pos);

    // Convert dB to raw value based on your original mapping
    let rawValue: number;
    if (db <= MIN_DB) {
        rawValue = -8832;
    } else if (db >= MAX_DB) {
        rawValue = 640;
    } else if (db === 0) {
        rawValue = 0;
    } else if (db > 0) {
        // Between 0dB and +10dB: linear interpolation
        rawValue = (db / 10) * 640;
    } else {
        // Between -138dB and 0dB: linear interpolation
        rawValue = -8832 + ((db + 138) / 138) * 8832;
    }

    // QUANTIZE to integer
    return Math.round(rawValue);
}

/**
 * Converts fader position to quantized dB value (based on integer raw values)
 * @param pos - Fader position from 0 (bottom) to 1 (top)
 * @returns dB value that corresponds to an integer raw value
 */
function faderPosToQuantizedDb(pos: number): number {
    const quantizedValue = faderPosToValue(pos);

    // Convert quantized raw value back to dB
    if (quantizedValue <= -8832) {
        return MIN_DB;
    } else if (quantizedValue >= 640) {
        return MAX_DB;
    } else if (quantizedValue === 0) {
        return 0;
    } else if (quantizedValue > 0) {
        // Between 0 and +10dB
        return (quantizedValue / 640) * 10;
    } else {
        // Between -138dB and 0dB
        return MIN_DB + ((quantizedValue + 8832) / 8832) * 138;
    }
}

/**
 * Converts any dB value to the nearest quantized dB value (based on integer raw values)
 * @param db - Any dB value
 * @returns Quantized dB value that corresponds to an integer raw value
 */
function quantizeDb(db: number): number {
    // Convert dB to raw value
    let rawValue: number;
    if (db <= MIN_DB) {
        rawValue = -8832;
    } else if (db >= MAX_DB) {
        rawValue = 640;
    } else if (db === 0) {
        rawValue = 0;
    } else if (db > 0) {
        rawValue = (db / 10) * 640;
    } else {
        rawValue = -8832 + ((db + 138) / 138) * 8832;
    }

    // Quantize to integer
    const quantizedValue = Math.round(rawValue);

    // Convert back to dB
    return faderPosToQuantizedDb(valueToFaderPos(quantizedValue));
}

// Example usage and verification:
console.log("=== Quantized Integer Values ===");
console.log(
    "Position 0.5 -> Value:",
    faderPosToValue(0.5),
    "-> dB:",
    faderPosToQuantizedDb(0.5)
);
console.log(
    "Position 0.84 -> Value:",
    faderPosToValue(0.84),
    "-> dB:",
    faderPosToQuantizedDb(0.84)
);
console.log(
    "Position 0.92 -> Value:",
    faderPosToValue(0.92),
    "-> dB:",
    faderPosToQuantizedDb(0.92)
);

console.log("\n=== Value to Position (Integer Values) ===");
console.log(
    "Value -8832 -> Position:",
    valueToFaderPos(-8832),
    "-> dB:",
    faderPosToQuantizedDb(valueToFaderPos(-8832))
);
console.log(
    "Value 0 -> Position:",
    valueToFaderPos(0),
    "-> dB:",
    faderPosToQuantizedDb(valueToFaderPos(0))
);
console.log(
    "Value 320 -> Position:",
    valueToFaderPos(320),
    "-> dB:",
    faderPosToQuantizedDb(valueToFaderPos(320))
);
console.log(
    "Value 640 -> Position:",
    valueToFaderPos(640),
    "-> dB:",
    faderPosToQuantizedDb(valueToFaderPos(640))
);

console.log("\n=== Quantized dB Examples ===");
console.log("Quantize -15.5dB:", quantizeDb(-15.5));
console.log("Quantize 2.7dB:", quantizeDb(2.7));
console.log("Quantize -45.2dB:", quantizeDb(-45.2));
