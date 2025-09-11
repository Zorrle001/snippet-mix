"use client";

import {
    CardEnum,
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

type Props = {
    snippetCards: React.JSX.Element[];
    pages: PageObjType[];
    activePage: number;
    gridMode: boolean;
    editMode: boolean;
};
export default function HomeGrid_v2({
    snippetCards,
    pages,
    activePage,
    gridMode,
    editMode,
}: Props) {
    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);
    const setOpenedPopUpProps = usePopUpStore(
        (state) => state.setOpenedPopUpProps
    );

    const setPages = usePagesStore((state) => state.setPages);

    const [selected, setSelected] = useState<null | {
        id: number;
        row: number;
    }>(null);

    const pageObj = pages[activePage];
    const gridFields = [];

    // CREATE ALL GRID FIELDS, independant of rows/cols
    let i = 0;
    for (let row = 0; row < pageObj.rows; row++) {
        for (let collumn = 0; collumn < pageObj.collumns; collumn++) {
            let rowData: PageObjRowDataType | undefined =
                pageObj.data[row]?.[collumn];

            let fieldContent = undefined;
            if (rowData != undefined) {
                if (rowData.type == CardEnum.SNIPPET) {
                    const snippetID = rowData.id;
                    fieldContent = snippetCards[snippetID - 1]
                        ? snippetCards[snippetID - 1]
                        : null;
                }
            }

            gridFields.push(
                <div
                    key={`field-${row}-${collumn}`}
                    id={styles.homeGridField}
                    onClick={() => {
                        if (!gridMode) return;

                        // IF IS GRID MODE, OPEN SNIPPET SELECT POPUP
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
                                // TODO: FIX EMPTY ROWS NOT BEEING DELETET
                                if (pageObj.data[row]) {
                                    // @ts-ignore
                                    pageObj.data[row][collumn] = undefined;
                                    setPages(() => [...pages]);
                                }
                            },
                        });
                        setOpenedPopUp(PopUps.SelectSnippetPopUp);
                    }}
                    className={[
                        gridMode ? styles.gridMode : "",
                        editMode ? styles.editMode : "",
                    ].join(" ")}
                >
                    {fieldContent}
                </div>
            );
            i++;
        }
    }

    // SPLIT GRID FIELDS INTO ROWS -> CREATE ROW ELEMENTS: gridRowElements
    const gridRowElements = [];
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
                    gridMode={gridMode}
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
                    key={`textinsert-${textInsert.id}`}
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
                    {gridMode ? (
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

                                let freeID = 0;
                                for (const textInsert of rowData.textInserts) {
                                    if (freeID <= textInsert.id) {
                                        freeID = textInsert.id + 1;
                                    }
                                }

                                rowData.textInserts.push({
                                    type: TextTypeEnum.H1,
                                    text: "Text",
                                    id: freeID,
                                    row: scopedRowID,
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
            {gridRowElements}
            {gridMode === true ? (
                //TEMPORARY
                <>
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
                    <div
                        key={`removeRowTag-${i}`}
                        className={styles.removeRowTag}
                        onClick={() => {
                            pageObj.rows--;
                            setPages(() => [...pages]);
                        }}
                    >
                        <i className="fa-solid fa-ban"></i>
                    </div>
                </>
            ) : null}
        </article>
    );
}
