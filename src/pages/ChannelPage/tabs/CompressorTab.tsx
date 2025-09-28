import {
    SoloWebRTCStatus,
    useSoloWebRTCStore,
} from "@/hooks/useSoloWebRTCAudioStore";
import styles from "@/styles/ChannelPage/tabs/CompressorTabStyles.module.scss";
import { cn } from "@/utils/Utils";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
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

let inputLevelData: Array<{
    time: number;
    timestamp: number;
    dbLevel: number;
}> = [];

type Props = {};
export default function CompressorTab({}: Props) {
    enum CompressorDotType {
        FIX = "F",
        THRESHOLD = "T",
        RATIO = "R",
    }

    const [threshold, setThreshold] = useState(-35);
    const [ratio, setRatio] = useState(2);
    const [attack, setAttack] = useState(50);
    const [release, setRelease] = useState(80);
    const [makeupGain, setMakeupGain] = useState(0);

    const chartRef = useRef<HTMLDivElement | null>(null);
    const mouseDraggingElementRef = useRef<HTMLElement | null>(null);
    const mouseDraggingDotTypeRef = useRef<CompressorDotType | null>(null);

    // TODO: CHANGE TO CHANNEL INPUT LEVEL
    const soloMonoLevel = useSoloWebRTCStore((state) => state.soloMonoLevel);
    const [realtimeMonoLevel, setRealtimeMonoLevel] = useState([
        0,
        performance.now(),
    ]);

    const realtimeAnalyser = useSoloWebRTCStore(
        (state) => state.realtimeAnalyser
    );
    const status = useSoloWebRTCStore((state) => state.status);

    const newInputLevelData: Array<{
        time: number;
        timestamp: number;
        dbLevel: number;
    }> = [];

    //const now = performance.now();

    useEffect(() => {
        if (status !== SoloWebRTCStatus.STREAMING || !realtimeAnalyser) {
            return;
        }

        let rafId: NodeJS.Timeout | null = null;
        let stopped = false;

        // Allocate buffer once for this run
        const buf = new Float32Array(realtimeAnalyser.fftSize);

        const normFromDb = (db: number, minDb = -60) => {
            const norm = (db - minDb) / -minDb;
            // clamp
            return Math.min(1, Math.max(0, norm));
        };

        const getPeakDbfs = () => {
            realtimeAnalyser.getFloatTimeDomainData(buf);
            let peak = 0;
            for (let i = 0; i < buf.length; i++) {
                const v = Math.abs(buf[i]);
                if (v > peak) peak = v;
            }
            return peak <= 1e-12 ? -100 : 20 * Math.log10(peak);
        };

        const loop = () => {
            if (stopped) return;

            //console.log("REALTIME LEVEL LOOP");

            //const now = performance.now();

            const peakDb = getPeakDbfs();

            // Normieren
            const peakNorm = normFromDb(peakDb);

            setRealtimeMonoLevel([peakNorm, performance.now()]);

            //rafId = requestAnimationFrame(loop);
        };

        rafId = setInterval(loop, 0);

        // Cleanup when status/analyser changes or on unmount
        return () => {
            stopped = true;
            if (rafId != null) clearInterval(rafId);

            let unmountZeroDataPoint: [number, number] = [0, performance.now()];
            //setRealtimeMonoLevel(unmountZeroDataPoint);
            //shift_and_custum_fill_graph(unmountZeroDataPoint);
            inputLevelData = [
                {
                    time: 0,
                    timestamp: performance.now(),
                    dbLevel: -60,
                },
            ];
        };
    }, [realtimeAnalyser, status]);

    function shift_and_fill_graph() {
        const newInputLevelData = [];

        for (const inputLevelDataPoint of inputLevelData) {
            newInputLevelData.push({
                time:
                    (inputLevelDataPoint.timestamp - realtimeMonoLevel[1]) /
                    1000.0,
                timestamp: inputLevelDataPoint.timestamp,
                dbLevel: inputLevelDataPoint.dbLevel,
            });
        }

        newInputLevelData.push({
            time: 0,
            timestamp: realtimeMonoLevel[1],
            dbLevel: (1 - realtimeMonoLevel[0]) * -60,
        });

        inputLevelData = [
            ...newInputLevelData.filter((dataPoint) => dataPoint.time >= -5),
        ];
    }
    shift_and_fill_graph();

    const data = useMemo(
        () => [
            {
                inputDB: -60,
                outputDB: -60,
                type: CompressorDotType.FIX,
            },
            {
                inputDB: threshold,
                outputDB: threshold,
                type: CompressorDotType.THRESHOLD,
            },
            {
                inputDB: 0,
                outputDB: threshold + -threshold * (1 / ratio),
                type: CompressorDotType.RATIO,
            },
        ],
        [threshold, ratio]
    );

    const [compressorDotPositions, setCompressorDotPositions] = useState({
        [CompressorDotType.THRESHOLD]: {
            cx: null,
            cy: null,
        },
        [CompressorDotType.RATIO]: {
            cx: null,
            cy: null,
        },
    });

    const CompressorGraph = useMemo(
        () => (
            <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
                <ComposedChart
                    data={data}
                    margin={
                        {
                            //left: 0.5 * 16,
                            //right: 2 * 16,
                        }
                    }
                >
                    <CartesianGrid stroke={"#333"} />
                    <XAxis
                        dataKey="inputDB"
                        scale="linear"
                        domain={[-60, 0]}
                        type="number"
                        tickFormatter={(tick) => {
                            return `${tick}dB`;
                        }}
                        ticks={[-60, -50, -40, -30, -20, -10, 0]}
                        tickMargin={0.5 * 16}
                    />
                    <YAxis
                        yAxisId="left"
                        domain={[-60, 0]}
                        dataKey={"outputDB"}
                        allowDataOverflow
                        ticks={[-60, -50, -40, -30, -20, -10, 0]}
                        tickFormatter={(tick) => {
                            return `${tick}dB`;
                        }}
                        tickMargin={0.5 * 16}
                    />
                    <Area
                        yAxisId="left"
                        type="linear"
                        dataKey={"outputDB"}
                        stroke={"green"}
                        fill={`color-mix(in hsl, ${"green"}, transparent 70%)`}
                        strokeWidth={2}
                        name={`Compressor Curve`}
                        dot={false}
                        isAnimationActive={false}
                        baseValue={-60}
                    ></Area>
                    <Scatter
                        yAxisId="left"
                        data={data}
                        fill="red"
                        r={6} // Adjust the size of the dot
                        shape={CustomCircle} // Use custom circle component
                        isAnimationActive={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        ),
        [data]
    );

    const CompressorHistoryChart = useMemo(
        () => (
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    margin={{
                        left: -0.75 * 16,
                        //right: 2 * 16,
                    }}
                >
                    <CartesianGrid stroke={"#333"} />
                    <XAxis
                        dataKey="time"
                        scale="linear"
                        domain={[-5, 0]}
                        type="number"
                        tickFormatter={(tick) => {
                            return `${tick}s`;
                        }}
                        ticks={[-5, -4, -3, -2, -1, 0]}
                        tickMargin={0.5 * 16}
                        fontSize={16 * 0.75}
                    />
                    <YAxis
                        yAxisId="left"
                        domain={[-60, 0]}
                        dataKey={"outputDB"}
                        allowDataOverflow
                        ticks={[-60, -40, -20, 0]}
                        tickFormatter={(tick) => {
                            return `${tick}dB`;
                        }}
                        tickMargin={0.5 * 16}
                        fontSize={16 * 0.75}
                    />
                    {/* <Area
                        yAxisId="left"
                        type="linear"
                        dataKey={"inputDB"}
                        stroke={"#666666"}
                        fill={`color-mix(in hsl, ${"#666666"}, transparent 70%)`}
                        strokeWidth={2}
                        name={`InputDB Curve`}
                        dot={false}
                        isAnimationActive={false}
                        baseValue={-60}
                    ></Area> */}
                    {/* MAKEUP GAIN CHART?: https://youtube.com/shorts/TuwaFYH1wiw */}
                    {/* <Area
                        yAxisId="left"
                        type="linear"
                        dataKey={"outputDB"}
                        stroke={"green"}
                        fill={`color-mix(in hsl, ${"green"}, transparent 70%)`}
                        strokeWidth={2}
                        name={`OutputDB Curve`}
                        dot={false}
                        isAnimationActive={false}
                        baseValue={-60}
                    ></Area> */}
                    {/* <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="compressionDB"
                        stroke="#666666" // Grau für Resultierende Phase
                        strokeWidth={2}
                        name="CompressionDB Curve"
                        dot={false}
                    /> */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="threshold"
                        stroke="white" // Grau für Resultierende Phase
                        strokeWidth={2}
                        name="Threshold Line"
                        dot={false}
                        data={[
                            {
                                time: -5,
                                threshold: threshold,
                            },
                            {
                                time: 0,
                                threshold: threshold,
                            },
                        ]}
                        isAnimationActive={false}
                    />
                    {/* Input Level Chart */}
                    {/* <Line
                        yAxisId="left"
                        //type="monotone"
                        dataKey="dbLevel"
                        stroke="white" // Grau für Resultierende Phase
                        strokeWidth={2}
                        name="Input Level"
                        dot={false}
                        data={inputLevelData}
                        isAnimationActive={false}
                    /> */}
                    <Area
                        yAxisId="left"
                        type="linear"
                        dataKey={"dbLevel"}
                        stroke={"white"}
                        fill={`color-mix(in hsl, ${"white"}, transparent 70%)`}
                        strokeWidth={1}
                        name={`Input Level Curve`}
                        dot={false}
                        data={inputLevelData}
                        isAnimationActive={false}
                        baseValue={-60}
                        /* connectNulls={false} */
                    />
                </ComposedChart>
            </ResponsiveContainer>
        ),
        [threshold, realtimeMonoLevel]
    );

    function mouseMove(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        if (
            !chartRef.current ||
            !mouseDraggingElementRef.current ||
            !mouseDraggingDotTypeRef.current
        )
            return;

        const bandCircle = mouseDraggingElementRef.current;
        if (!bandCircle) return;

        const offset = parseFloat(
            bandCircle.dataset.offset ? bandCircle.dataset.offset : "0"
        );
        const type = mouseDraggingDotTypeRef.current;

        console.log(type, offset);

        const y = e.pageY;

        console.log(chartRef.current);

        const offsetTop = chartRef.current.getBoundingClientRect().y;

        const height = chartRef.current.offsetHeight - 30; // -30 wegen Label Tick Bar

        const dY = y - offsetTop - offset;
        const percentage = 1 - Math.max(Math.min(1 - dY / height, 1), 0);

        console.log(percentage);

        if (type == CompressorDotType.THRESHOLD) {
            const db = Math.max(
                Math.min(Math.round(percentage * -60), -6),
                -54
            );

            setThreshold(db);
        } else if (type == CompressorDotType.RATIO) {
            const db = Math.max(Math.min(percentage * -60, 0), -60);

            const deltaY = Math.min(threshold - db, -0);
            console.log("DELTAY", deltaY);
            const deltaX = threshold;

            const newRatio = ratioRound(
                Math.max(Math.min(1 / (deltaY / deltaX), 20), 1)
            );
            console.log("RATIO:", newRatio);

            setRatio(newRatio);
        }
    }

    function mouseUp() {
        mouseDraggingElementRef.current = null;
        mouseDraggingDotTypeRef.current = null;
    }

    const CompressorDotElements = data.map((dotData) => {
        if (dotData.type == CompressorDotType.FIX) return;

        const dotPosition = compressorDotPositions[dotData.type];

        if (
            dotPosition == null ||
            dotPosition.cx == null ||
            dotPosition.cy == null
        )
            return;

        return (
            <div
                className={styles.compressorDot}
                key={`compressorDot-${dotData.type}`}
                style={
                    {
                        left: `calc(-1rem + ${dotPosition.cx}px)`,
                        top: `calc(-1rem + ${dotPosition.cy}px)`,
                    } as CSSProperties
                }
                onTouchStart={(e) => {
                    const bandCircle = e.currentTarget;

                    const bandCircleHeight = bandCircle.clientHeight;
                    const offset =
                        e.touches.item(0).pageY -
                        bandCircle.getBoundingClientRect().y -
                        bandCircleHeight / 2;

                    bandCircle.dataset.offset = offset.toString();

                    console.log("touchStart", offset, e);
                }}
                onTouchMove={(e) => {
                    if (!chartRef.current) return;

                    const bandCircle = e.currentTarget;

                    const offset = parseFloat(
                        bandCircle.dataset.offset
                            ? bandCircle.dataset.offset
                            : "0"
                    );

                    console.log(dotData.type, offset);

                    const y = e.changedTouches.item(0)?.pageY;

                    console.log(chartRef.current);

                    const offsetTop =
                        chartRef.current.getBoundingClientRect().y;

                    const height = chartRef.current.offsetHeight - 30; // -30 wegen Label Tick Bar

                    const dY = y - offsetTop - offset;
                    const percentage =
                        1 - Math.max(Math.min(1 - dY / height, 1), 0);

                    console.log(percentage);

                    if (dotData.type == CompressorDotType.THRESHOLD) {
                        const db = Math.max(
                            Math.min(Math.round(percentage * -60), -6),
                            -54
                        );

                        setThreshold(db);
                    } else if (dotData.type == CompressorDotType.RATIO) {
                        const db = Math.max(Math.min(percentage * -60, 0), -60);

                        const deltaY = Math.min(threshold - db, -0);
                        console.log("DELTAY", deltaY);
                        const deltaX = threshold;

                        const newRatio = ratioRound(
                            Math.max(Math.min(1 / (deltaY / deltaX), 20), 1)
                        );
                        console.log("RATIO:", newRatio);

                        setRatio(newRatio);
                    }
                }}
                onMouseDown={(e) => {
                    const bandCircle = e.currentTarget;

                    const bandCircleHeight = bandCircle.clientHeight;
                    const offset =
                        e.pageY -
                        bandCircle.getBoundingClientRect().y -
                        bandCircleHeight / 2;

                    bandCircle.dataset.offset = offset.toString();

                    mouseDraggingElementRef.current = bandCircle;
                    mouseDraggingDotTypeRef.current = dotData.type;

                    console.log("mouseDown", offset, e);
                }}
            >
                <div className={styles.circle}>
                    <p
                    /* style={
                            {
                                left: `${dotPosition.cx}px`,
                                top: `${dotPosition.cy}px + 7px`,
                            } as CSSProperties
                        } */
                    >
                        {dotData.type}
                    </p>
                </div>
            </div>
        );
    });

    let LevelDotElement = <></>;

    if (chartRef.current && soloMonoLevel[0] > 0) {
        const height = chartRef.current.offsetHeight - 30;
        const width = chartRef.current.offsetWidth - 3.6 * 16;

        LevelDotElement = (
            <div
                className={styles.compressorLevelDot}
                key={`compressorLevelDot`}
                style={
                    {
                        left: `calc(${width * soloMonoLevel[0] + 3.6 * 16}px)`,
                        top: `calc(${height * (1 - soloMonoLevel[0])}px)`,
                    } as CSSProperties
                }
            >
                <div className={styles.circle}></div>
            </div>
        );
    }

    return (
        <article
            id={styles.compressorTab}
            onMouseMove={(e) => {
                mouseMove(e);
            }}
            onMouseUp={() => {
                mouseUp();
            }}
        >
            <section id={styles.leftPart}>
                {CompressorGraph}
                {CompressorDotElements}
                {LevelDotElement}
            </section>
            <section id={styles.rightPart}>
                <section id={styles.historyChartSection}>
                    {CompressorHistoryChart}
                </section>
                <section id={styles.sliderSection}>
                    <div id={styles.vertical}>
                        <div>
                            <p>
                                Thres<span>{threshold}dB</span>
                            </p>
                            <input
                                min={-54}
                                max={-6}
                                step={1}
                                value={threshold}
                                type={"range"}
                                onChange={(e) => {
                                    const value = parseFloat(
                                        e.currentTarget.value
                                    );
                                    setThreshold(value);
                                }}
                                className={cn(styles.input, styles.fliped)}
                            />
                        </div>

                        <div>
                            <p>
                                Ratio<span>{ratio}</span>
                            </p>
                            <input
                                min={1}
                                max={20}
                                step={0.1}
                                value={ratio}
                                type={"range"}
                                className={styles.input}
                                onChange={(e) => {
                                    const value = parseFloat(
                                        e.currentTarget.value
                                    );
                                    const newRatio = ratioRound(value);
                                    setRatio(newRatio);
                                }}
                            />
                        </div>
                    </div>
                    <div id={styles.horizontal}>
                        <p>
                            Attack<span>{attack}ms</span>
                        </p>
                        <input
                            min={0.3}
                            max={100}
                            step={0.1}
                            type={"range"}
                            className={styles.input}
                            value={attack}
                            onChange={(e) => {
                                const value = parseFloat(e.currentTarget.value);
                                setAttack(attackRound(value));
                            }}
                        />

                        <p>
                            Release<span>{release}ms</span>
                        </p>
                        <input
                            min={5}
                            max={900}
                            step={5}
                            value={release}
                            type={"range"}
                            className={styles.input}
                            onChange={(e) => {
                                const value = parseFloat(e.currentTarget.value);
                                console.log(value);
                                setRelease(releaseRound(value));
                            }}
                        />

                        <p>
                            Makeup Gain<span>+{makeupGain}dB</span>
                        </p>
                        <input
                            min={0}
                            max={24}
                            step={1}
                            value={makeupGain}
                            type={"range"}
                            className={styles.input}
                            onChange={(e) => {
                                const value = parseFloat(e.currentTarget.value);
                                setMakeupGain(value);
                            }}
                        />
                    </div>
                </section>
            </section>
        </article>
    );

    function CustomCircle(props: any) {
        const { cx, cy, payload } = props; // Access `cx` and `cy` for positioning

        if (payload.type == CompressorDotType.FIX) return <></>;

        setCompressorDotPositions((positions) => {
            positions[
                payload.type as
                    | CompressorDotType.THRESHOLD
                    | CompressorDotType.RATIO
            ].cx = cx;
            positions[
                payload.type as
                    | CompressorDotType.THRESHOLD
                    | CompressorDotType.RATIO
            ].cy = cy;
            return { ...positions };
        });

        return <></>;
    }
}

function ratioRound(value: number): number {
    if (value < 1 || value > 20) {
        throw new Error("Value must be between 1 and 20.");
    }

    if (value >= 1 && value < 2) {
        return Math.round(value * 10) / 10; // Runden auf 0.1 Schritte
    } else if (value >= 2 && value < 5) {
        return Math.round(value * 5) / 5; // Runden auf 0.2 Schritte
    } else if (value >= 5 && value < 10) {
        return Math.round(value * 2) / 2; // Runden auf 0.5 Schritte
    } else if (value >= 10 && value <= 20) {
        return Math.round(value); // Runden auf ganze Zahlen
    }

    return value; // Fallback
}

function attackRound(value: number): number {
    if (value >= 0.3 && value < 1) {
        return Math.round(value * 10) / 10; // Runden auf 0.1 Schritte
    } else if (value >= 1 && value < 5) {
        return Math.round(value * 5) / 5; // Runden auf 0.2 Schritte
    } else if (value >= 5 && value < 6.5) {
        return Math.round(value / 1.5) * 1.5; // Runden auf 0.5 Schritte
    } else if (value >= 6.5 && value <= 9.5) {
        return Math.round(value / 2) * 2; // Runden auf ganze Zahlen
    } else if (value >= 9.5 && value <= 12) {
        return Math.round(value / 2.5) * 2.5; // Runden auf ganze Zahlen
    } else if (value >= 12 && value <= 20) {
        return Math.round(value / 2) * 2; // Runden auf ganze Zahlen
    } else if (value >= 20 && value <= 50) {
        return Math.round(value / 5) * 5; // Runden auf ganze Zahlen
    } else if (value >= 50 && value <= 100) {
        return Math.round(value / 10) * 10; // Runden auf ganze Zahlen
    }

    return value; // Fallback
}

function releaseRound(value: number): number {
    if (value >= 5 && value < 60) {
        return Math.round(value / 5) * 5; // Runden auf 0.1 Schritte
    } else if (value >= 60 && value < 200) {
        return Math.round(value / 10) * 10; // Runden auf 0.2 Schritte
    } else if (value >= 200 && value < 500) {
        return Math.round(value / 50) * 50; // Runden auf 0.5 Schritte
    } else if (value >= 500 && value <= 900) {
        return Math.round(value / 100) * 100; // Runden auf ganze Zahlen
    }

    return value; // Fallback
}

/* function shift_and_custum_fill_graph(monoLevel: [number, number]) {
    const newInputLevelData = [];

    for (const inputLevelDataPoint of inputLevelData) {
        newInputLevelData.push({
            time: (inputLevelDataPoint.timestamp - monoLevel[1]) / 1000.0,
            timestamp: inputLevelDataPoint.timestamp,
            dbLevel: inputLevelDataPoint.dbLevel,
        });
    }

    newInputLevelData.push({
        time: 0,
        timestamp: monoLevel[1],
        dbLevel: (1 - monoLevel[0]) * -60,
    });

    inputLevelData = [
        ...newInputLevelData.filter((dataPoint) => dataPoint.time >= -5),
    ];
} */
