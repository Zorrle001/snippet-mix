"use client";

import FlatSnippetCard from "@/components/FlatSnippetCard";
import { usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";

import { COLORS } from "@/components/ColorCard";
import TopNav from "@/components/UI/TopNav";
import { useChannelPageStore } from "@/hooks/useChannelPageStore";
import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/SnippetPageStyle.module.scss";
import CompressorTab from "./tabs/CompressorTab";
import EqualizerTab from "./tabs/EqualizerTab";

type Props = {};

export enum ChannelPageTabs {
    Input,
    EQ,
    Gate,
    Comp,
    SendTo,
    Design,
}

export default function ChannelPage({}: Props) {
    const tab = useChannelPageStore((state) => state.tab);
    const setTab = useChannelPageStore((state) => state.setTab);

    const selectedChannelID = useChannelPageStore(
        (state) => state.selectedChannelID
    );
    const setSelectedChannelID = useChannelPageStore(
        (state) => state.setSelectedChannelID
    );

    const selectedChannelObj = useChannelPageStore(
        (state) => state.selectedChannelObj
    );
    const setSelectedChannelObj = useChannelPageStore(
        (state) => state.setSelectedChannelObj
    );

    if (!selectedChannelID || !selectedChannelObj)
        return <h1 style={{ color: "white" }}>ERROR: No selected Channel</h1>;

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const selectedSnippet = useSnippetPageStore(
        (state) => state.selectedSnippet
    );
    const setSelectedSnippet = useSnippetPageStore(
        (state) => state.setSelectedSnippet
    );

    const snippets = useSnippetStore((state) => state.snippets);
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    if (!selectedSnippet || !snippets[selectedSnippet - 1]) {
        return (
            <h1
                style={{ color: "white" }}
                onClick={() => {
                    setSelectedSnippet(null);
                }}
            >
                No Snippet found!
            </h1>
        );
    }

    const snippetObj = snippets[selectedSnippet - 1];

    return (
        <article id={styles.snippetPage} className={homeStyles.snippetPage}>
            {/* CHECK IF NEW TOPNAV WORKS */}
            <TopNav
                onBack={() => {
                    setSelectedChannelID(null);
                    setSelectedChannelObj(null);
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
