import { FontClassName } from "@/app/layout";
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
    let value = channelObj.fader.value ? channelObj.fader.value : 0;
    const [moving, setMoving] = useState(false);

    const trackRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const sliderValueRef = useRef<HTMLParagraphElement | null>(null);

    const [thumbOffset, setThumbOffset] = useState(0);

    useEffect(() => {
        // TO PREVENT STUCK PERCENTAGE AFTER MANUAL CHANGE AND THEN SERVER RECIEVED CHANGE
        const newValue = channelObj.fader.value ? channelObj.fader.value : 0;

        if (!sliderValueRef.current) {
            value = newValue;
            return;
        }

        if (value !== newValue) {
            sliderValueRef.current.innerText = `${(value * 100).toFixed(2)}%`;
        }

        value = newValue;
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
                className={channelObj.gain.enabled ? "" : styles.disabled}
            >
                <button
                    id={styles.propertySelBtn}
                    onClick={() => {
                        channelObj.gain.enabled = !channelObj.gain.enabled;
                        onChannelObjUpdate();
                    }}
                >
                    {channelObj.gain.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
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
                className={channelObj.muted.enabled ? "" : styles.disabled}
            >
                <button
                    id={styles.mutePropertySelBtn}
                    onClick={() => {
                        channelObj.muted.enabled = !channelObj.muted.enabled;
                        onChannelObjUpdate();
                    }}
                >
                    {channelObj.muted.enabled ? (
                        <i className="fa-regular fa-circle-check"></i>
                    ) : (
                        <i className="fa-regular fa-circle"></i>
                    )}
                </button>
                <button
                    id={styles.onButton}
                    className={cn(
                        FontClassName,
                        channelObj.muted.value != true ? styles.muted : ""
                    )}
                    onClick={() => {
                        channelObj.muted.value = !channelObj.muted.value;
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
                    !channelObj.muted.enabled &&
                    !channelObj.gain.enabled &&
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
            value = percentage;
            thumbRef.current.style.setProperty("--value", `${percentage}`);
            sliderValueRef.current.innerText = `${(percentage * 100).toFixed(
                2
            )}%`;

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
