"use client";

import { FontClassName } from "@/app/layout";
import SnippetCard from "@/components/SnippetCard";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import styles from "@/styles/HomeStyles.module.scss";

type Props = {};
export default function HomePage({}: Props) {
    const snippets = useSnippetStore((state) => state.snippets);
    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const snippetCards = snippets.map((snippetObj) => (
        <SnippetCard
            id={snippetObj.snippetID}
            name={snippetObj.snippetName}
            icon={snippetObj.snippetIcon}
            color={snippetObj.snippetColor}
            channelCount={Object.keys(snippetObj.snippetChannels).length}
            faderIndicator={false}
            gainIndicator={false}
        ></SnippetCard>
    ));

    return (
        <article id={styles.home}>
            <nav>
                <section id={styles.logo}>
                    <div></div>
                    <h1>
                        Snippet
                        <br />
                        Mix
                    </h1>
                    <div></div>
                </section>
                <section id={styles.status}>
                    <p>Status</p>
                    <button className={FontClassName} id={styles.online}>
                        Online
                    </button>
                </section>
            </nav>
            {snippetCards}
            <button
                onClick={() => {
                    setOpenedPopUp(PopUps.CreatePopUp);
                    console.log("DONE");
                }}
                id={styles.floatingButton}
            >
                <i className="fa-solid fa-plus"></i>
                <p className={FontClassName}>Snippet Erstellen</p>
            </button>
        </article>
    );
}
