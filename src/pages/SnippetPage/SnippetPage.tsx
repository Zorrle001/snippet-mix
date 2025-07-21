"use client";

import { FontClassName } from "@/app/layout";
import FlatSnippetCard from "@/components/FlatSnippetCard";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";

import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/SnippetPageStyle.module.scss";
import ChannelsTab from "./tabs/ChannelsTab";
import DesignTab from "./tabs/DesignTab";
import OptionsTab from "./tabs/OptionsTab";
import OutputTab, { OutputTabShortcutButtons } from "./tabs/OutputTab";
import SendsTab, { SendsTabShortcutButtons } from "./tabs/SendsTab";

type Props = {};

export enum SnippetPageTabs {
    Sends,
    Outputs,
    Channels,
    Fade,
    Groups,
    Design,
    Options,
}

export default function SnippetPage({}: Props) {
    const tab = useSnippetPageStore((state) => state.tab);
    const setTab = useSnippetPageStore((state) => state.setTab);

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
            <nav id={homeStyles.topNav}>
                <section id={homeStyles.logo}>
                    {/* <div></div>
                    <h1 id={"Test"}>
                        Snippet
                        <br />
                        Mix
                    </h1>
                    <div></div> */}
                    <img src="TransparentWhiteSlimSnippetMixLogo.png" />
                </section>
                <section id={homeStyles.status}>
                    <p>Status</p>
                    <button
                        className={FontClassName}
                        id={homeStyles.online}
                        onClick={() => {
                            setOpenedPopUp(PopUps.CreatePopUp);
                        }}
                    >
                        Online
                    </button>
                </section>
                {tab == SnippetPageTabs.Sends ? (
                    <SendsTabShortcutButtons
                        snippets={snippets}
                        snippetObj={snippetObj}
                    />
                ) : tab == SnippetPageTabs.Outputs ? (
                    <OutputTabShortcutButtons
                        snippets={snippets}
                        snippetObj={snippetObj}
                    />
                ) : null}

                <section id={homeStyles.backBtn}>
                    <button
                        onClick={() => {
                            setSelectedSnippet(null);
                        }}
                    >
                        <i className="fa-solid fa-house"></i>
                        <p className={FontClassName}>Home</p>
                    </button>
                </section>
            </nav>
            {tab == SnippetPageTabs.Sends ? (
                <SendsTab snippets={snippets} snippetObj={snippetObj} />
            ) : tab == SnippetPageTabs.Outputs ? (
                <OutputTab snippets={snippets} snippetObj={snippetObj} />
            ) : tab == SnippetPageTabs.Channels ? (
                <ChannelsTab snippets={snippets} snippetObj={snippetObj} />
            ) : tab == SnippetPageTabs.Design ? (
                <DesignTab snippets={snippets} snippetObj={snippetObj} />
            ) : tab == SnippetPageTabs.Options ? (
                <OptionsTab snippets={snippets} snippetObj={snippetObj} />
            ) : (
                <div></div>
            )}
            <nav id={styles.bottomNav}>
                <section id={styles.flatSnippetCardSection}>
                    <FlatSnippetCard
                        id={snippetObj.snippetID}
                        color={snippetObj.snippetColor}
                        name={snippetObj.snippetName}
                        icon={snippetObj.snippetIcon}
                        prevEnabled={selectedSnippet != 1}
                        nextEnabled={snippets.length > selectedSnippet}
                        onPrev={() => {
                            setSelectedSnippet(selectedSnippet - 1);
                        }}
                        onNext={() => {
                            setSelectedSnippet(selectedSnippet + 1);
                        }}
                    />
                </section>
                <section id={styles.tabSection}>
                    <div
                        className={
                            tab == SnippetPageTabs.Sends ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Sends)}
                    >
                        Sends
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Outputs ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Outputs)}
                    >
                        Outputs
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Channels ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Channels)}
                    >
                        Channels
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Fade ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Fade)}
                    >
                        Fade
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Groups ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Groups)}
                    >
                        Groups
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Design ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Design)}
                    >
                        Design
                    </div>
                    <div
                        className={
                            tab == SnippetPageTabs.Options ? styles.active : ""
                        }
                        onClick={() => setTab(SnippetPageTabs.Options)}
                    >
                        Options
                    </div>
                </section>
            </nav>
        </article>
    );
}
