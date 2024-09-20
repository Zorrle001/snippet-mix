import { FontClassName } from "@/app/layout";
import styles from "@/styles/FaderStyles.module.scss";
import { cn } from "@/utils/Utils";
import { useRef, useState } from "react";
import { SnippetObjOutputChannelObjType } from "./PopUps/CreateSnippetPopUp";
import SlimChannelCard from "./SlimChannelCard";

type Props = {
    outputChannelID: number;
    outputChannelObj: SnippetObjOutputChannelObjType;
    onChange: (value: number) => void;
    onOutputChannelObjUpdate: () => void;
};

let lastTime = new Date().getTime();

export default function OutputFader({
    outputChannelID,
    outputChannelObj,
    onChange,
    onOutputChannelObjUpdate,
}: Props) {
    /*const [value, setValue] = useState(
        channelObj.fader.value ? channelObj.fader.value : 0
    );*/
    let value = outputChannelObj.fader.value ? outputChannelObj.fader.value : 0;
    const [moving, setMoving] = useState(false);

    const trackRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const sliderValueRef = useRef<HTMLParagraphElement | null>(null);

    const [thumbOffset, setThumbOffset] = useState(0);

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
                className={false ? "" : styles.disabled}
            >
                <button
                    id={styles.propertySelBtn}
                    onClick={() => {
                        //false = !false;
                        onOutputChannelObjUpdate();
                    }}
                >
                    {false ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
            </section>
            <section
                id={styles.buttonSection}
                className={
                    outputChannelObj.muted.enabled ? "" : styles.disabled
                }
            >
                <button
                    id={styles.mutePropertySelBtn}
                    onClick={() => {
                        outputChannelObj.muted.enabled =
                            !outputChannelObj.muted.enabled;
                        onOutputChannelObjUpdate();
                    }}
                >
                    {outputChannelObj.muted.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
                <button
                    id={styles.onButton}
                    className={cn(
                        FontClassName,
                        outputChannelObj.muted.value != true ? styles.muted : ""
                    )}
                    onClick={() => {
                        outputChannelObj.muted.value =
                            !outputChannelObj.muted.value;
                        onOutputChannelObjUpdate();
                    }}
                >
                    ON
                </button>
            </section>
            <div id={styles.faderPropertySelBtn}>
                <button
                    className={
                        outputChannelObj.fader.enabled ? "" : styles.disabled
                    }
                    onClick={() => {
                        outputChannelObj.fader.enabled =
                            !outputChannelObj.fader.enabled;
                        onOutputChannelObjUpdate();
                    }}
                >
                    {outputChannelObj.fader.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
            </div>
            <section
                id={styles.sliderSection}
                className={
                    outputChannelObj.fader.enabled ? "" : styles.disabled
                }
            >
                <div id={styles.sliderTrack} ref={trackRef}>
                    <div
                        id={styles.sliderThumb}
                        onMouseDown={(e) => {
                            if (thumbRef.current) {
                                const thumbHeight =
                                    thumbRef.current.offsetHeight;
                                const thumbOffset =
                                    e.pageY -
                                    thumbRef.current.getBoundingClientRect().y -
                                    thumbHeight / 2;
                                setThumbOffset(thumbOffset);
                                console.log(
                                    "SET OFFSET",
                                    thumbOffset,
                                    thumbHeight
                                );
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
                                console.log(
                                    "SET OFFSET",
                                    thumbOffset,
                                    thumbHeight
                                );
                            }
                            setMoving(true);
                        }}
                        onTouchMove={move}
                        onTouchEnd={(e) => {
                            console.log(e);
                            if (moving && trackRef.current) {
                                move(e);
                                setMoving(false);
                                onChange(value);
                            }
                        }}
                        style={
                            {
                                "--value": value,
                            } as React.CSSProperties
                        }
                        ref={thumbRef}
                    ></div>
                    <ul id={styles.sliderTrackLabels}>
                        <li>10</li>
                        <li>0</li>
                        <li>10</li>
                        <li>20</li>
                        <li>40</li>
                        <li>60</li>
                        <li>
                            <i className="fa-solid fa-infinity"></i>
                        </li>
                    </ul>
                </div>
                <p id={styles.sliderValue} ref={sliderValueRef}>
                    {(value * 100).toFixed(2)}%
                </p>
            </section>
            <section
                id={styles.channelCardSection}
                className={
                    !outputChannelObj.muted.enabled &&
                    !false &&
                    !outputChannelObj.fader.enabled
                        ? styles.disabled
                        : ""
                }
            >
                <SlimChannelCard
                    id={outputChannelID}
                    name={`CH ${outputChannelID}`}
                    onClick={() => {}}
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

            //console.log(e);
            // @ts-ignore
            const y = e.pageY ? e.pageY : e.changedTouches.item(0)?.pageY;

            const offsetTop = trackRef.current.getBoundingClientRect().y;

            const height = trackRef.current.offsetHeight;

            const dY = y - offsetTop - thumbOffset;
            const percentage = Math.max(Math.min(1 - dY / height, 1), 0);

            //console.log(y, offsetTop, height, dY, percentage);

            //setValue(percentage);
            value = percentage;
            thumbRef.current.style.setProperty("--value", `${percentage}`);
            sliderValueRef.current.innerHTML = `${(percentage * 100).toFixed(
                2
            )}%`;
            /* sliderValueRef.current.style.setProperty(
                "background",
                `rgb(${percentage * 250}, 0, 0)`
            ); */

            console.log(new Date().getTime() - lastTime + "ms");
            lastTime = new Date().getTime();
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
