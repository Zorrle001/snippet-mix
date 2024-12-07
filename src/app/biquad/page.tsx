"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {};
export default function BiquadFilterPage({}: Props) {
    if (typeof window === "undefined") {
        return;
    }

    const ctx = new AudioContext();

    const highPassFilter = ctx.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = 80;
    //highPassFilter.Q.value = 0.63;

    const myFrequencyArray = new Float32Array(2000);
    /*     myFrequencyArray[0] = 0;
    myFrequencyArray[1] = 50;
    myFrequencyArray[2] = 80;
    myFrequencyArray[3] = 100;
    myFrequencyArray[4] = 5000; */

    const data = [];

    let index = 0;
    for (let i = 20; i < 20000; i += 10) {
        myFrequencyArray[index] = i;
        index++;
    }

    const magResponseOutput = new Float32Array(2000);
    const phaseResponseOutput = new Float32Array(2000);

    const result = highPassFilter.getFrequencyResponse(
        myFrequencyArray,
        magResponseOutput,
        phaseResponseOutput
    );

    index = 0;
    for (let i = 20; i < 20000; i += 10) {
        //myFrequencyArray[index] = i;

        data.push({
            freq: i,
            value: magResponseOutput[index],
        });
        index++;
    }

    const responseLIs = [];

    for (let i = 0; i <= myFrequencyArray.length - 1; i++) {
        /*const listItem = (
            <li>
                <strong>{myFrequencyArray[i]}Hz</strong>: Magnitude{" "}
                {magResponseOutput[i]}, Phase {phaseResponseOutput[i]} radians.
            </li>
        );*/
        //responseLIs.push(listItem);
    }

    return (
        <>
            {/* <p
                style={{
                    color: "white",
                }}
            >
                BiquadFilterPage: <br />
                Mag: {magResponseOutput} <br />
                Phase: {phaseResponseOutput}
            </p> */}
            {/* <ul>{responseLIs}</ul> */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="freq"
                        scale="log"
                        domain={[20, 20000]}
                        type="number"
                        tickFormatter={(tick) => `${tick} Hz`}
                    />
                    <YAxis domain={[-2, 2]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
