"use client";

import React, {
    CSSProperties,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Scatter,
    XAxis,
    YAxis,
} from "recharts";

import styles from "@/styles/ChannelPage/tabs/EqualizerTabStyles.module.scss";

interface FilterConfig {
    type: BiquadFilterType;
    frequency: number;
    Q: number;
    gain: number;
    color: string;
    filterID: string;
}

interface EQBandCircle {
    cx: number;
    cy: number;
}

interface DataPoint {
    freq: number;
    [key: string]: number; // Dynamische Felder für Magnitude und Phase
}

const EqualizerTab: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [showPhase, setShowPhase] = useState<boolean>(false); // State zum Ein-/Ausblenden der Phasen

    const sectionRef = useRef<HTMLElement | null>(null);

    const [draggingFilterID, setDraggingFilterID] = useState<null | string>(
        () => null
    );
    const [draggingOffset, setDraggingOffset] = useState(0);

    const chartRef = useRef<HTMLDivElement | null>(null);

    const [filters, setFilters] = useState<FilterConfig[]>([
        {
            type: "highpass",
            frequency: 100,
            Q: -2.5,
            gain: 0,
            /*color: "#246398",*/
            color: "#009fe1",
            filterID: "HP",
        },
        {
            type: "lowshelf",
            frequency: 50,
            Q: 0,
            gain: -6,
            color: "#00F300",
            filterID: "L",
        }, // Filter 2 // Filter 3
        {
            type: "peaking",
            frequency: 500,
            Q: 1,
            gain: -3,
            color: "#D996F6",
            filterID: "LM",
        }, // Filter 1
        {
            type: "peaking",
            frequency: 1000,
            Q: 1,
            gain: 5,
            color: "#F64545",
            filterID: "HM",
        }, // Filter 1
        {
            type: "highshelf",
            frequency: 3200,
            Q: 0,
            gain: 5,
            color: "#FFFF97",
            filterID: "H",
        }, // Filter 2 // Filter 3
        // Weitere Filter können hier hinzugefügt werden
    ]);

    const [eqBandCircles, setEQBandCircles] = useState<{
        [filterID: string]: EQBandCircle;
    }>({});

    const eqBandCircleElements = useMemo(() => {
        let result = [];
        for (const filterID in eqBandCircles) {
            const circles = eqBandCircles[filterID];
            const filter = filters.find(
                (filter) => filter.filterID == filterID
            );
            if (filter) {
                result.push(
                    <div
                        className={styles.equalizerBandCircle}
                        key={filterID}
                        id={filterID}
                        style={
                            {
                                left: `calc(2rem + ${circles.cx}px)`,
                                top: `calc(2rem + ${circles.cy}px)`,
                                "--color": filter.color,
                            } as CSSProperties
                        }
                        onTouchStart={(e) => {
                            if (draggingFilterID != null) return;

                            /*const bandCirclce =
                                /*e.currentTarget*/ /*document.getElementById("LM");
                            if (bandCirclce == null) return;*/
                            const bandCircle = e.currentTarget;

                            const bandCircleHeight = bandCircle.clientHeight;
                            const offset =
                                e.touches.item(0).pageY -
                                bandCircle.getBoundingClientRect().y +
                                32 -
                                bandCircleHeight / 2;

                            setDraggingFilterID(filterID);
                            setDraggingOffset(offset);

                            /* setFilters((filters) => {
                                    filters[0].gain++;
                                    return [...filters];
                                }); */

                            console.log("touchStart", "LM", offset, e);
                        }}
                        onMouseDown={(e) => {
                            const isTouchEvent =
                                // @ts-ignore
                                e.nativeEvent.sourceCapabilities
                                    ?.firesTouchEvents;
                            if (isTouchEvent) return;

                            console.log("mouseDown", filterID);
                            //@ts-ignore
                            onlyMouseDown(e, filter);
                        }}
                    >
                        <div
                            className={styles.circle}
                            //r={1 * 16}
                            //fill={`color-mix(in hsl, ${filter.color}, transparent 50%)`}
                            //stroke={filter.color}
                            //strokeWidth={2}
                            // MARK: TOUCH EVENTS

                            //pointerEvents={"auto"}
                            /* onTouchStart={(e) => {
                            if (draggingFilterID != null) return;
    
                            const bandCirclce = e.currentTarget;
                            const bandCircleHeight = bandCirclce.clientHeight;
                            const offset =
                                e.touches.item(0).pageY -
                                bandCirclce.getBoundingClientRect().y -
                                bandCircleHeight / 2;
    
                            setDraggingFilterID(payload.filterID);
                            setDraggingOffset(offset);
    
                            /* setFilters((filters) => {
                                    filters[0].gain++;
                                    return [...filters];
                                }); */

                            /*console.log("touchStart", payload.filterID);
                        }} */
                        >
                            <p
                                style={
                                    {
                                        left: `${circles.cx}px`,
                                        top: `${circles.cy}px + 7px`,
                                        "--color": filter.color,
                                    } as CSSProperties
                                }
                                //textAnchor="middle"
                                //fontSize={16}
                                //fill={"white"}
                                //fontWeight={600}
                                //pointerEvents={"none"}
                            >
                                {filterID}
                            </p>
                        </div>

                        {filterID != "HP" ? (
                            <p
                                style={
                                    {
                                        left: `${circles.cx}px`,
                                        top: `${circles.cy}px + 40px`,
                                        "--color": filter.color,
                                    } as CSSProperties
                                }
                                //textAnchor="middle"
                                //fontSize={16}
                                //fill={"lightgray"}
                                //fontWeight={500}
                            >
                                {filter.gain}dB
                            </p>
                        ) : null}
                    </div>
                );
            }
        }
        return result;
    }, [eqBandCircles]);

    useEffect(() => {
        console.log("FILTER ID CHANGED", draggingFilterID);
    }, [draggingFilterID]);

    useEffect(() => {
        console.log("RUN EFFECT");
        const audioContext = new window.AudioContext();

        // Frequenzpunkte erstellen
        const numPoints = 500;
        const frequencies = new Float32Array(numPoints);
        const fMin = 20;
        const fMax = 20000;
        for (let i = 0; i < numPoints; i++) {
            frequencies[i] = fMin * Math.pow(fMax / fMin, i / (numPoints - 1)); // Logarithmische Verteilung
        }

        // Berechnung der Frequenzantwort für jeden Filter
        const filterResponses = filters.map((filterProps, index) => {
            const filter = audioContext.createBiquadFilter();
            filter.type = filterProps.type;
            filter.frequency.value = filterProps.frequency;
            filter.Q.value = filterProps.Q;
            filter.gain.value = filterProps.gain;

            const magResponse = new Float32Array(numPoints);
            const phaseResponse = new Float32Array(numPoints);
            filter.getFrequencyResponse(
                frequencies,
                magResponse,
                phaseResponse
            );

            return { index, magResponse, phaseResponse };
        });

        // Daten formatieren
        const formattedData: DataPoint[] = [];
        // Berechnung der resultierenden Magnitude
        for (let i = 0; i < numPoints; i++) {
            const dataPoint: DataPoint = { freq: frequencies[i] };

            let combinedMagnitudeLinear = 0; // Für die lineare Summation der Magnitude
            let combinedPhase = 0;
            let combinedMagnitude = 0;

            filterResponses.forEach((response, idx) => {
                const magnitude = 20 * Math.log10(response.magResponse[i]);
                const phase = (response.phaseResponse[i] * 180) / Math.PI;

                // Speichern der einzelnen Magnitude und Phase
                dataPoint[`magnitude${idx + 1}`] = /*Math.max(
                    -15,
                    Math.min(15, */ magnitude; /*)
                );*/
                dataPoint[`phase${idx + 1}`] = phase;

                // Kombiniere Magnitude in linearen Werten
                const linearMagnitude = Math.pow(10, magnitude / 20);
                combinedMagnitudeLinear += linearMagnitude; // Summiere die linearen Werte

                // CUSTOM COMBINED MAGNITUDE
                combinedMagnitude += magnitude;

                // Für die Phase werden wir sie einfach addieren
                combinedPhase += response.phaseResponse[i];
            });

            // Resultierende Magnitude in dB berechnen (lineare Magnitude zurück in dB)
            /*const resultingMagnitude = 20 * Math.log10(combinedMagnitudeLinear);
            dataPoint["resultingMagnitude"] = Math.max(
                -15,
                Math.min(15, resultingMagnitude)
            );*/
            dataPoint["resultingMagnitude"] = combinedMagnitude;

            // Resultierende Phase berechnen
            dataPoint["resultingPhase"] = (combinedPhase * 180) / Math.PI;

            formattedData.push(dataPoint);
        }

        setData(formattedData);

        // AudioContext schließen
        return () => {
            audioContext.close();
        };
    }, [filters]);

    // Toggle-Funktion zum Ein- und Ausblenden der Phasenkurven
    const togglePhaseVisibility = () => {
        setShowPhase((prev) => !prev);
    };

    function onlyMouseDown(
        e: React.MouseEvent<SVGCircleElement, MouseEvent>,
        payload: any
    ) {
        if (draggingFilterID != null) return;

        const bandCirclce = e.currentTarget;
        const bandCircleHeight = bandCirclce.clientHeight;
        const offset =
            e.pageY -
            bandCirclce.getBoundingClientRect().y +
            32 -
            bandCircleHeight / 2;

        console.log("OFFSET", offset);

        setDraggingOffset(offset);
        setDraggingFilterID(payload.filterID);
    }

    function mouseMove(
        e: React.MouseEvent<SVGCircleElement, MouseEvent> | any
    ) {
        if (draggingFilterID == null || !chartRef.current) return;

        console.log("MOVE");

        const y = e.pageY ? e.pageY : e.changedTouches.item(0)?.pageY;

        console.log(chartRef.current);

        const offsetTop = chartRef.current.getBoundingClientRect().y - 15;

        const height = chartRef.current.offsetHeight - 30; // -30 wegen Label Tick Bar

        const dY = y - offsetTop - draggingOffset;
        const percentage = Math.max(Math.min(1 - dY / height, 1), 0);

        const db = Math.round(percentage * 30 - 15);

        //console.log(y, offsetTop, height, dY, percentage);

        //setValue(percentage);
        //value = percentage;
        //thumbRef.current.style.setProperty("--value", `${percentage}`);
        //sliderValueRef.current.innerText = `${(percentage * 100).toFixed(2)}%`;

        console.log(draggingFilterID + ": " + percentage);

        /*setFilters((filters) => {
            const filter = filters.find(
                (filter) => filter.filterID == draggingFilterID
            );
            if (filter != null) {
                filter.gain = db;
            }
            return [...filters];
        });*/

        setFilters((filters) => {
            return filters.map((filter) => {
                if (filter.filterID === draggingFilterID) {
                    return { ...filter, gain: db }; // Create a new object with updated gain
                }
                return filter; // Return the existing filter object
            });
        });

        console.log(
            "SET NEW VALUE",
            draggingFilterID,
            draggingOffset,
            db + "db"
        );
    }

    function mouseUp(e: React.MouseEvent<any, MouseEvent>) {
        console.log("UP PRE");
        if (draggingFilterID == null) return;
        console.log("UP");

        mouseMove(e);
        setDraggingFilterID(() => null);
    }

    // MARK: SECTION
    return (
        <section
            ref={sectionRef}
            id={styles.equalizerTab}
            onMouseMove={(e) => {
                const isTouchEvent =
                    // @ts-ignore
                    e.nativeEvent.sourceCapabilities?.firesTouchEvents;
                if (isTouchEvent) return;

                mouseMove(e);
            }}
            onMouseUp={(e) => {
                const isTouchEvent =
                    // @ts-ignore
                    e.nativeEvent.sourceCapabilities?.firesTouchEvents;
                if (isTouchEvent) return;

                console.log("mouseUp");
                mouseUp(e);
            }}
            onTouchMove={(e) => {
                console.log("touchMove Section", e.currentTarget);
                mouseMove(e);
            }}
            onTouchEnd={(e) => {
                console.log("touchStop Section");
                // @ts-ignore
                mouseUp(e);
            }}
        >
            {/* <button onClick={togglePhaseVisibility}>
                {showPhase ? "Phasen ausblenden" : "Phasen einblenden"}
            </button> */}

            {useMemo(
                () => (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        ref={chartRef}
                    >
                        <ComposedChart
                            data={data}
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
                                    20, 50, 100, 200, 500, 1000, 2000, 5000,
                                    10000, 15000, 20000,
                                ]}
                                tickMargin={0.5 * 16}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[-15, 15]} // Magnitude-Bereich begrenzen
                                /* label={{
                            value: "Magnitude (dB)",
                            angle: -90,
                            position: "insideLeft",
                        }} */
                                dataKey={"gain"}
                                allowDataOverflow
                                ticks={[-15, -10, -5, 0, 5, 10, 15]}
                                tickFormatter={(tick) => {
                                    return `${tick}dB`;
                                }}
                                tickMargin={0.5 * 16}
                            />
                            {/* <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[-180, 180]} // Phase-Bereich begrenzen
                        label={{
                            value: "Phase (°)",
                            angle: 90,
                            position: "insideRight",
                        }}
                    /> */}
                            {/* <Tooltip /> */}
                            {/* Einzelne Filterkurven */}
                            {filters.map((filter, index) => (
                                <React.Fragment key={index}>
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey={`magnitude${index + 1}`}
                                        /* stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`} // Dynamische Farbe
                                         */
                                        stroke={filter.color}
                                        fill={`color-mix(in hsl, ${filter.color}, transparent 70%)`}
                                        strokeWidth={2}
                                        name={`Filter ${index + 1} Magnitude`}
                                        dot={false}
                                        isAnimationActive={false}
                                    />

                                    {showPhase && (
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey={`phase${index + 1}`}
                                            stroke={`hsl(${
                                                (index * 60 + 30) % 360
                                            }, 70%, 50%)`} // Dynamische Farbe
                                            name={`Filter ${index + 1} Phase`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                            {/* Resultierende Kurven */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="resultingMagnitude"
                                stroke="#ddd" // Schwarz für Resultierende Magnitude
                                /* strokeWidth={4} */
                                strokeWidth={3}
                                /* strokeDasharray={"15 15"} */
                                name="Resultierende Magnitude"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Scatter
                                yAxisId="left"
                                data={filters.map((filter) => {
                                    return {
                                        filterID: filter.filterID,
                                        freq: filter.frequency,
                                        gain: filter.gain,
                                        color: filter.color,
                                    };
                                })}
                                fill="red"
                                r={6} // Adjust the size of the dot
                                shape={CustomCircle} // Use custom circle component
                                isAnimationActive={false}
                            />
                            {showPhase && (
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="resultingPhase"
                                    stroke="#666666" // Grau für Resultierende Phase
                                    strokeWidth={2}
                                    name="Resultierende Phase"
                                    dot={false}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                ),
                [filters, data]
            )}

            {eqBandCircleElements}
        </section>
    );

    function CustomCircle(props: any) {
        //const circleRef = useRef<SVGGElement | null>(null);

        const { cx, cy, payload } = props; // Access `cx` and `cy` for positioning

        //console.log("PAYLOAD FILTERID", payload.filterID, cx, cy);

        setEQBandCircles((circles) => {
            circles[payload.filterID] = {
                cx,
                cy,
            };
            return { ...circles };
        });

        return <></>;

        return (
            <g
                className={styles.equalizerBandCircle}
                key={payload.filterID}
                ref={(node) => {
                    const circle = node?.querySelector("circle");
                    console.log("NODE CLEANUP", circle);
                    if (circle != undefined) {
                        //document.body.appendChild(circle);
                    }
                }}
                id={payload.filterID}
            >
                <circle
                    cx={cx}
                    cy={cy}
                    r={1 * 16}
                    fill={`color-mix(in hsl, ${payload.color}, transparent 50%)`}
                    stroke={payload.color}
                    strokeWidth={2}
                    // MARK: TOUCH EVENTS
                    onMouseDown={(e) => {
                        const isTouchEvent =
                            // @ts-ignore
                            e.nativeEvent.sourceCapabilities?.firesTouchEvents;
                        if (isTouchEvent) return;

                        console.log("mouseDown", payload.filterID);
                        onlyMouseDown(e, payload);
                    }}
                    pointerEvents={"auto"}
                    /* onTouchStart={(e) => {
                        if (draggingFilterID != null) return;

                        const bandCirclce = e.currentTarget;
                        const bandCircleHeight = bandCirclce.clientHeight;
                        const offset =
                            e.touches.item(0).pageY -
                            bandCirclce.getBoundingClientRect().y -
                            bandCircleHeight / 2;

                        setDraggingFilterID(payload.filterID);
                        setDraggingOffset(offset);

                        /* setFilters((filters) => {
                                filters[0].gain++;
                                return [...filters];
                            }); */

                    /*console.log("touchStart", payload.filterID);
                    }} */
                />
                <text
                    x={cx}
                    y={cy + 7}
                    textAnchor="middle"
                    fontSize={16}
                    fill={"white"}
                    fontWeight={600}
                    pointerEvents={"none"}
                >
                    {payload.filterID}
                </text>

                {payload.filterID != "HP" ? (
                    <text
                        x={cx}
                        y={cy + 40}
                        textAnchor="middle"
                        fontSize={16}
                        fill={"lightgray"}
                        fontWeight={500}
                    >
                        {payload.gain}dB
                    </text>
                ) : null}
            </g>
        );
    }
};

export default EqualizerTab;
