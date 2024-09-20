"use client";

import { FontClassName } from "@/app/layout";
import HomeGrid from "@/components/HomeGrid";
import SnippetCard from "@/components/SnippetCard";
import { useHomeGridStore } from "@/hooks/useHomeGridStore";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import styles from "@/styles/HomeStyles.module.scss";

type Props = {};
export default function HomePage({}: Props) {
    const snippets = useSnippetStore((state) => state.snippets);

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const setSelectedSnippet = useSnippetPageStore(
        (state) => state.setSelectedSnippet
    );

    const collumns = useHomeGridStore((state) => state.collumns);
    const rows = useHomeGridStore((state) => state.rows);
    const setCollumns = useHomeGridStore((state) => state.setCollumns);
    const setRows = useHomeGridStore((state) => state.setRows);

    const snippetCards = snippets.map((snippetObj) => (
        <SnippetCard
            id={snippetObj.snippetID}
            key={snippetObj.snippetID}
            name={snippetObj.snippetName}
            icon={snippetObj.snippetIcon}
            color={snippetObj.snippetColor}
            channelCount={Object.keys(snippetObj.snippetChannels).length}
            faderIndicator={false}
            gainIndicator={false}
            onClick={() => {
                setSelectedSnippet(snippetObj.snippetID);
            }}
        ></SnippetCard>
    ));

    return (
        <article id={styles.home}>
            <nav id={styles.topNav}>
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
                <section id={styles.pages}>
                    {/* <button id={styles.lockGrid}>
                        <i className="fa-solid fa-lock"></i>
                    </button> */}
                    <span className={styles.gridIcon}>
                        <i className="fa-solid fa-grip-vertical"></i>
                    </span>
                    {/* <input
                        type="number"
                        id={styles.pageGridInputX}
                        defaultValue={collumns}
                        className={FontClassName}
                        onChange={(e) => {
                            setCollumns(Number(e.target.value));
                        }}
                    /> */}
                    <p>{collumns}</p>
                    <span>
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                    {/* <input
                        type="number"
                        id={styles.pageGridInputY}
                        defaultValue={rows}
                        className={FontClassName}
                        onChange={(e) => {
                            setRows(Number(e.target.value));
                        }}
                    /> */}
                    <p>{rows}</p>
                    <select>
                        <option>Kleine Besetzung</option>
                        <option>Große Besetzung</option>
                        <option>+ New Page</option>
                    </select>
                </section>
            </nav>
            {/* {snippetCards} */}
            <HomeGrid snippetCards={snippetCards} />
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
