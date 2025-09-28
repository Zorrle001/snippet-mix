"use client";

import FlatSnippetCard from "@/components/FlatSnippetCard";

import { COLORS } from "@/components/ColorCard";
import SoloControls from "@/components/Solo/SoloControls";
import TopNav from "@/components/UI/TopNav";
import { useChannelPageStore } from "@/hooks/useChannelPageStore";
import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/SnippetPageStyle.module.scss";
import CompressorTab from "../ChannelPage/tabs/CompressorTab";
import EqualizerTab from "../ChannelPage/tabs/EqualizerTab";

type Props = {};

export enum ChannelPageTabs {
    Input,
    EQ,
    Gate,
    Comp,
    SendTo,
    Design,
}

export default function LiveChannelPage({}: Props) {
    const tab = useChannelPageStore((state) => state.tab);
    const setTab = useChannelPageStore((state) => state.setTab);

    const selectedChannelID = useChannelPageStore(
        (state) => state.selectedChannelID
    );
    const setSelectedChannelID = useChannelPageStore(
        (state) => state.setSelectedChannelID
    );

    /* const selectedChannelObj = useChannelPageStore(
        (state) => state.selectedChannelObj
    );
    const setSelectedChannelObj = useChannelPageStore(
        (state) => state.setSelectedChannelObj
    ); */

    if (!selectedChannelID)
        return (
            <h1 style={{ color: "white" }}>ERROR: No selected Channel ID</h1>
        );

    return (
        <article id={styles.snippetPage} className={homeStyles.snippetPage}>
            {/* CHECK IF NEW TOPNAV WORKS */}
            <TopNav
                buttons={
                    <section id={homeStyles.shortcutBtns}>
                        <SoloControls hideSettings={true} />
                    </section>
                }
                onBack={() => {
                    setSelectedChannelID(null);
                    //setSelectedChannelObj(null);
                }}
            />
            {tab == ChannelPageTabs.EQ ? (
                <EqualizerTab />
            ) : tab == ChannelPageTabs.Comp ? (
                <CompressorTab />
            ) : (
                <div></div>
            )}
            <nav id={styles.bottomNav}>
                <section id={styles.flatSnippetCardSection}>
                    <FlatSnippetCard
                        id={selectedChannelID}
                        color={COLORS.Cyan}
                        name={selectedChannelID}
                        icon={"fa-solid fa-arrow-right-to-bracket"}
                        prevEnabled={selectedChannelID != "ch1"}
                        nextEnabled={selectedChannelID != "ch64"}
                        onPrev={() => {
                            //setSelectedSnippet(selectedSnippet - 1);
                        }}
                        onNext={() => {
                            //setSelectedSnippet(selectedSnippet + 1);
                        }}
                    />
                </section>

                <section id={styles.tabSection}>
                    <div
                        className={
                            tab == ChannelPageTabs.Input ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.Input)}
                    >
                        Input
                    </div>
                    <div
                        className={
                            tab == ChannelPageTabs.EQ ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.EQ)}
                    >
                        EQ
                    </div>
                    <div
                        className={
                            tab == ChannelPageTabs.Gate ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.Gate)}
                    >
                        Gate
                    </div>
                    <div
                        className={
                            tab == ChannelPageTabs.Comp ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.Comp)}
                    >
                        Comp
                    </div>
                    <div
                        className={
                            tab == ChannelPageTabs.SendTo ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.SendTo)}
                    >
                        Send To
                    </div>
                    <div
                        className={
                            tab == ChannelPageTabs.Design ? styles.active : ""
                        }
                        onClick={() => setTab(ChannelPageTabs.Design)}
                    >
                        Design
                    </div>
                </section>
            </nav>
        </article>
    );
}
