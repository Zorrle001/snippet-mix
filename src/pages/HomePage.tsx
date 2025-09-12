"use client";

import { FontClassName } from "@/app/layout";
import HomeGrid_v2 from "@/components/HomeGrid v2";
import SnippetCard from "@/components/SnippetCard";
import TopNav from "@/components/UI/TopNav";
import { useLocalStorageStore } from "@/hooks/useLocalStorageStore";
import { fallbackPage, usePagesStore } from "@/hooks/usePagesStore";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import styles from "@/styles/HomeStyles.module.scss";
import { randomBytes } from "crypto";

type Props = {};
export default function HomePage({}: Props) {
    const snippets = useSnippetStore((state) => state.snippets);

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const setSelectedSnippet = useSnippetPageStore(
        (state) => state.setSelectedSnippet
    );

    const setEditMode = usePagesStore((state) => state.setEditMode);
    const editMode = usePagesStore((state) => state.editMode);

    const setGridMode = usePagesStore((state) => state.setGridMode);
    const gridMode = usePagesStore((state) => state.gridMode);

    //const [lockMode, setLockMode] = useLocalStorage("lockMode", "false");
    const lockMode = useLocalStorageStore((state) => state.lockMode);

    //const collumns = usePagesStore((state) => state.legacy_collumns);
    //const rows = usePagesStore((state) => state.legacy_rows);
    //const setCollumns = usePagesStore((state) => state.set_legacy_Collumns);
    //const setRows = usePagesStore((state) => state.set_legacy_Rows);

    const pages = usePagesStore((state) => state.pages);
    const setPages = usePagesStore((state) => state.setPages);
    const activePage = usePagesStore((state) => state.activePage);
    const setActivePage = usePagesStore((state) => state.setActivePage);

    if (pages.length == 0) {
        return <h1 style={{ color: "white" }}>Loading Pages from Node</h1>;
    }

    const pageObj = pages[activePage];

    let index = 0;
    const optionElements = pages.map((pageObj) => {
        const value = index++;
        return (
            <option value={value} key={value}>
                {pageObj.name}
            </option>
        );
    });

    optionElements.push(
        <option value={-1} key={-1}>
            + New Page
        </option>
    );

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
                if (!gridMode && editMode) {
                    // OPEN EDIT PAGE
                    setSelectedSnippet(snippetObj.snippetID);
                }
                if (!gridMode && !editMode) {
                    if (lockMode === "true") {
                        alert("Snippet Loading im Lock Mode ist deaktiviert");
                        return;
                    }
                    // LOAD SNIPPET
                    //@ts-ignore
                    if (window.sendJSONMessage === undefined) {
                        alert("WS not connected! Can't load Snippets");
                        return;
                    }

                    // @ts-ignore
                    window.sendJSONMessage({
                        id: "LOAD_SNIPPET_OBJ",
                        data: {
                            snippetObj,
                        },
                    });
                    console.log("MSG SENT");
                }
            }}
        ></SnippetCard>
    ));

    return (
        <article id={styles.home}>
            <TopNav
                buttons={
                    <>
                        <section id={styles.shortcutBtns}>
                            <button
                                id={
                                    !editMode
                                        ? styles.deleteBtn
                                        : styles.editSCBtn
                                }
                                onClick={() => {
                                    setEditMode((state) => !state);
                                }}
                            >
                                <i className="fa-solid fa-pencil"></i>
                            </button>
                            <button
                                id={
                                    !gridMode
                                        ? styles.deleteBtn
                                        : styles.muteSCBtn
                                }
                                onClick={() => {
                                    setGridMode((state) => !state);
                                }}
                            >
                                <i className="fa-solid fa-grip"></i>
                            </button>

                            {/* <button
                                id={styles.deleteBtn}
                                onClick={() => {
                                    alert("Button currently disabled");
                                    return;
                                    setPages((pages) => {
                                        return pages.toSpliced(activePage, 1);
                                    });
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button> */}
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
                            <p>{pageObj.collumns}</p>
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
                            <p>{pageObj.rows}</p>
                            <button
                                id={styles.pageSettingsBtn}
                                onClick={() => {
                                    alert("Button currently disabled");
                                    return;
                                    pageObj.name = String(randomBytes(4));
                                    setPages(() => [...pages]);
                                }}
                            >
                                <i className="fa-solid fa-gear"></i>
                            </button>
                            <select
                                value={activePage}
                                onChange={(e) => {
                                    const value = parseInt(
                                        e.currentTarget.value
                                    );
                                    if (value == -1) {
                                        const newPage = { ...fallbackPage };
                                        newPage.name =
                                            "Page " + (pages.length + 1);
                                        setPages(() => [...pages, newPage]);
                                        setActivePage(pages.length);
                                        return;
                                    }
                                    setActivePage(value);
                                }}
                                className={FontClassName}
                            >
                                {optionElements}
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                        </section>
                    </>
                }
                onBack={() => {}}
                hideBack={true}
            />
            {/* {snippetCards} */}
            <HomeGrid_v2
                snippetCards={snippetCards}
                pages={pages}
                activePage={activePage}
                gridMode={gridMode}
                editMode={editMode}
            />
            <button
                onClick={() => {
                    setOpenedPopUp(PopUps.CreatePopUp);
                }}
                id={styles.floatingButton}
            >
                <i className="fa-solid fa-plus"></i>
                <p className={FontClassName}>Snippet Erstellen</p>
            </button>
        </article>
    );
}
