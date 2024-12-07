"use client";

import {
    CardEnum,
    PageObjRowDataType,
    PageObjType,
    TextTypeEnum,
    usePagesStore,
} from "@/hooks/usePagesStore";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import styles from "@/styles/HomeStyles.module.scss";

type Props = {
    snippetCards: React.JSX.Element[];
    pages: PageObjType[];
    activePage: number;
    editMode: boolean;
};
export default function HomeGrid({
    snippetCards,
    pages,
    activePage,
    editMode,
}: Props) {
    /*const legacy_collumns = usePagesStore((state) => state.legacy_collumns);
    const pageObj.rows = usePagesStore((state) => state.pageObj.rows);
    const set_pageObj.rows = usePagesStore((state) => state.set_pageObj.rows);
    const set_legacy_Collumns = usePagesStore(
        (state) => state.set_legacy_Collumns
    );*/

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);
    const setOpenedPopUpProps = usePopUpStore(
        (state) => state.setOpenedPopUpProps
    );

    const setPages = usePagesStore((state) => state.setPages);

    const pageObj = pages[activePage];

    const gridFieldCount = pageObj.collumns * pageObj.rows;
    const gridFields = [];
    /*for (let i = 0; i < gridFieldCount; i++) {
        gridFields.push(
            <div key={`field-${i}`}>
                {snippetCards[i] ? snippetCards[i] : null}
            </div>
        );
    }*/
    let i = 0;
    for (let row = 0; row < pageObj.rows; row++) {
        for (let collumn = 0; collumn < pageObj.collumns; collumn++) {
            let rowData: PageObjRowDataType | undefined =
                pageObj.data[row]?.[collumn];

            let fieldContent = undefined;
            if (rowData != undefined) {
                if (rowData.type == CardEnum.SNIPPET) {
                    const snippetID = rowData.id;
                    fieldContent = snippetCards[snippetID]
                        ? snippetCards[snippetID]
                        : null;
                    //fieldContent = snippetCards[i] ? snippetCards[i] : null;
                }
            }

            gridFields.push(
                <div
                    key={`field-${row}-${collumn}`}
                    id={styles.homeGridField}
                    onClick={() => {
                        if (!editMode) return;
                        setOpenedPopUpProps({
                            onConfirm(rowData: PageObjRowDataType) {
                                if (!pageObj.data[row]) {
                                    // CREATE EMPTY ROW IF IT DOESNT EXIST
                                    pageObj.data[row] = {
                                        textInserts: [],
                                    };
                                }

                                pageObj.data[row][collumn] = rowData;
                                setPages(() => [...pages]);
                            },
                            onClear() {
                                // EMPTY ROWS NOT BEEING DELETET
                                if (pageObj.data[row]) {
                                    // @ts-ignore
                                    pageObj.data[row][collumn] = undefined;
                                    setPages(() => [...pages]);
                                }
                            },
                        });
                        setOpenedPopUp(PopUps.SelectSnippetPopUp);
                    }}
                    className={editMode ? styles.editMode : ""}
                >
                    {fieldContent}
                </div>
            );
            i++;
        }
    }

    /*const gridBlocks: {
        rows: number;
        data: [];
    }[] = [];*/
    let Ts = [];
    for (let i = 0; i < pageObj.rows; i++) {
        /*const rowData = pageObj.data[i];
        if (rowData != undefined && rowData.textInserts.length > 0) {
        }*/

        if (editMode)
            Ts.push(
                <div
                    key={`textInsert-${i}`}
                    onClick={() => {
                        if (pageObj.data[i] == undefined) {
                            pageObj.data[i] = {
                                textInserts: [],
                            };
                        }
                        pageObj.data[i].textInserts.push({
                            type: TextTypeEnum.H1,
                            text: "Text 1",
                        });
                        setPages(() => [...pages]);
                    }}
                >
                    T
                </div>
            );
        else Ts.push(<span key={`textInsertPlaceholder-${i}`}></span>);

        if (i < pageObj.rows - 1 || pageObj.rows < 2 || !editMode) {
            Ts.push(<span key={`placeholder-${i}`}></span>);
        } else {
            Ts.push(
                <div
                    key={`removeRowTag-${i}`}
                    className={styles.removeRowTag}
                    onClick={() => {
                        pageObj.rows--;
                        setPages(() => [...pages]);
                        //set_pageObj.rows(pageObj.rows - 1);
                    }}
                >
                    <i className="fa-solid fa-ban"></i>
                </div>
            );
        }
    }

    if (editMode) {
        Ts.push(
            <div
                key={"addRowTag"}
                className={styles.addRowTag}
                onClick={() => {
                    pageObj.rows++;
                    setPages(() => [...pages]);
                }}
            >
                <i className="fa-solid fa-arrow-turn-down"></i>
            </div>
        );
    }

    /*const gridBlockElements = (
        <section
            id={styles.homeGrid}
            style={{
                gridTemplateColumns: `repeat(${pageObj.collumns}, 7.5rem)`,
                gridTemplateRows: `repeat(${pageObj.rows}, 7.5rem)`,
            }}
        >
            {gridFields}
        </section>
    );*/

    return (
        <article id={styles.homeGridWrapper}>
            <section id={styles.sidebarCollumnLeft}>
                <section id={styles.sidebarWrapperLeft}>
                    <section
                        id={styles.sidebarLeft}
                        style={{
                            gridTemplateRows: `repeat(${
                                pageObj.rows * 2 + 1
                            }, 0px)`,
                        }}
                    >
                        {Ts}
                    </section>
                </section>
            </section>
            <section
                id={styles.homeGrid}
                style={{
                    gridTemplateColumns: `repeat(${pageObj.collumns}, 7.5rem)`,
                    gridTemplateRows: `repeat(${pageObj.rows}, 7.5rem)`,
                }}
            >
                {gridFields}
            </section>
            <section id={styles.sidebarCollumnRight}>
                <section id={styles.sidebarWrapperRight}>
                    <section
                        id={styles.sidebarRight}
                        style={{
                            height: `calc(7.5rem * ${pageObj.rows} + 1rem * ${
                                pageObj.rows - 1
                            })`,
                        }}
                    >
                        {editMode ? (
                            <>
                                <div
                                    className={styles.addCollumnTag}
                                    onClick={() => {
                                        pageObj.collumns++;
                                        setPages(() => [...pages]);
                                    }}
                                >
                                    <i className="fa-solid fa-arrow-turn-down"></i>
                                </div>
                                {pageObj.collumns >= 2 ? (
                                    <div
                                        className={styles.removeCollumnTag}
                                        onClick={() => {
                                            pageObj.collumns--;
                                            setPages(() => [...pages]);
                                        }}
                                    >
                                        <i className="fa-solid fa-ban"></i>
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </section>
                </section>
            </section>
        </article>
    );
}
