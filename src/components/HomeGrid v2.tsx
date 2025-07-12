"use client";

import {
    CardEnum,
    PageObjRowDataTextType,
    PageObjRowDataType,
    PageObjType,
    TextTypeEnum,
    usePagesStore,
} from "@/hooks/usePagesStore";
import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import styles from "@/styles/HomeGridStyles_v2.module.scss";
import { removeItemOnce, splitArrayIntoChunks } from "@/utils/Utils";
import { Fragment, useState } from "react";
import TextInsert from "./UI/TextInsert";

import { v4 as uuidv4 } from "uuid";

type Props = {
    snippetCards: React.JSX.Element[];
    pages: PageObjType[];
    activePage: number;
    editMode: boolean;
};
export default function HomeGrid_v2({
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

    const [selected, setSelected] = useState<null | PageObjRowDataTextType>(
        null
    );

    /*useEffect(() => {
        document.addEventListener("mousedown", mouseDown);

        function mouseDown(e: MouseEvent) {
            setSelected(null);
        }

        return () => {
            document.removeEventListener("mousedown", mouseDown);
        };
    });*/

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
    /*let Ts = [];
    for (let i = 0; i < pageObj.rows; i++) {
        /*const rowData = pageObj.data[i];
        if (rowData != undefined && rowData.textInserts.length > 0) {
        }*/

    /*if (editMode)
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
    }*/

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

    const gridRowElements = [];
    //let fieldID = 0;
    let rowID = 0;
    for (const rowGridFields of splitArrayIntoChunks(
        gridFields,
        pageObj.collumns
    )) {
        let scopedRowID = rowID;
        let rowData = pageObj.data[rowID];
        let textInsertElements: JSX.Element[] = [];
        if (rowData != undefined) {
            textInsertElements = rowData.textInserts.map((textInsert) => (
                <TextInsert
                    pages={pages}
                    editMode={editMode}
                    textInsert={textInsert}
                    selected={selected}
                    setSelected={setSelected}
                    onDelete={() => {
                        removeItemOnce(
                            pageObj.data[scopedRowID].textInserts,
                            textInsert
                        );
                        setPages(() => [...pages]);
                        setSelected(null);
                    }}
                    key={uuidv4()}
                />
            ));
        }

        gridRowElements.push(
            <Fragment key={rowID}>
                {textInsertElements.length > 0 ? (
                    <section
                        id={styles.textInsertBox}
                        style={{
                            width: `calc(7.5rem * ${pageObj.collumns} +  ${
                                pageObj.collumns - 1
                            } * 1rem)`,
                        }}
                    >
                        {textInsertElements}
                    </section>
                ) : null}
                <section id={styles.gridRow}>
                    {editMode ? (
                        <div
                            key={`textInsert-${i}`}
                            onClick={() => {
                                console.log(scopedRowID, rowData);
                                if (rowData === undefined) {
                                    rowData = {
                                        textInserts: [],
                                    };
                                    pages[activePage].data[scopedRowID] =
                                        rowData;
                                }
                                console.log(rowData, pages);
                                rowData.textInserts.push({
                                    type: TextTypeEnum.H1,
                                    text: "Text 1",
                                });

                                setPages(() => [...pages]);
                            }}
                            id={styles.textInsert}
                        >
                            T
                        </div>
                    ) : null}
                    {rowGridFields}
                </section>
            </Fragment>
        );

        rowID++;
    }

    return (
        <article id={styles.homeGridWrapper}>
            {/* <section
                id={styles.homeGrid}
                style={{
                    gridTemplateColumns: `repeat(${pageObj.collumns}, 7.5rem)`,
                    gridTemplateRows: `repeat(${pageObj.rows}, 7.5rem)`,
                }}
            > */}
            {/* {gridFields} */}
            {gridRowElements}
            {/*  </section> */}
        </article>
    );
}
