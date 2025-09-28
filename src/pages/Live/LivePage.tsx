import SlimChannelCard from "@/components/SlimChannelCard";
import SoloControls from "@/components/Solo/SoloControls";
import TopNav from "@/components/UI/TopNav";
import { useChannelPageStore } from "@/hooks/useChannelPageStore";

import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/Live/LivePageStyles.module.scss";

type Props = {};

export default function LivePage({}: Props) {
    const meterCardElements = [];

    const setSelectedChannelID = useChannelPageStore(
        (state) => state.setSelectedChannelID
    );
    const setSelectedChannelObj = useChannelPageStore(
        (state) => state.setSelectedChannelObj
    );

    for (let i = 1; i <= 24; i++) {
        meterCardElements.push(
            <div
                className={
                    i == 12 || i == 2
                        ? [styles.channelMeterCard, styles.solo].join(" ")
                        : styles.channelMeterCard
                }
            >
                <div id={styles.meterContainer}>
                    <div id={styles.gainMeter} className={styles.meter}>
                        <b>IN</b>
                    </div>
                    <div id={styles.outMeter} className={styles.meter}>
                        <b>OUT</b>
                    </div>
                    <div id={styles.gateGRMeter} className={styles.meter}>
                        <b>GT</b>
                    </div>
                    <div id={styles.compGRMeter} className={styles.meter}>
                        <b>CP</b>
                    </div>
                </div>
                <SlimChannelCard
                    id={"ch" + i}
                    name={"CH " + i}
                    onClick={() => {
                        setSelectedChannelID("ch" + i);

                        /*
                        export type SnippetObjChannelObjType = {
                            state: {
                                enabled: boolean;
                                value: boolean | null;
                            };
                            fader: {
                                enabled: boolean;
                                value: number | null;
                            };
                        };
                        */
                        setSelectedChannelObj({
                            state: { enabled: false, value: true },
                            fader: {
                                enabled: true,
                                value: 1,
                            },
                        });
                    }}
                />
            </div>
        );
    }

    return (
        <article id={styles.livePage}>
            <TopNav
                buttons={
                    <section id={homeStyles.shortcutBtns}>
                        {/* <button
                            id={homeStyles.deleteBtn}
                            onClick={() => {}}
                            className={FontClassName}
                        >
                            <p>PFL</p>
                        </button>
                        <button
                            id={homeStyles.deleteBtn}
                            onClick={() => {}}
                            className={FontClassName}
                        >
                            <p>AFL</p>
                        </button> */}
                        <SoloControls />
                    </section>
                }
                hideBack={true}
                hideLock={true}
            />
            {meterCardElements}
        </article>
    );
}
