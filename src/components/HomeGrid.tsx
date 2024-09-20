"use client";

import { useHomeGridStore } from "@/hooks/useHomeGridStore";
import styles from "@/styles/HomeStyles.module.scss";

type Props = {
    snippetCards: React.JSX.Element[];
};
export default function HomeGrid({ snippetCards }: Props) {
    const collumns = useHomeGridStore((state) => state.collumns);
    const rows = useHomeGridStore((state) => state.rows);
    const setRows = useHomeGridStore((state) => state.setRows);
    const setCollumns = useHomeGridStore((state) => state.setCollumns);

    const gridFieldCount = collumns * rows;
    const gridFields = [];
    for (let i = 0; i < gridFieldCount; i++) {
        gridFields.push(
            <div key={`field-${i}`}>
                {snippetCards[i] ? snippetCards[i] : null}
            </div>
        );
    }

    const Ts = [];
    for (let i = 0; i < rows; i++) {
        Ts.push(<div key={`textInsert-${i}`}>T</div>);

        if (i < rows - 1 || rows < 2) {
            Ts.push(<span key={`placeholder-${i}`}></span>);
        } else {
            Ts.push(
                <div
                    key={`removeRowTag-${i}`}
                    className={styles.removeRowTag}
                    onClick={() => {
                        setRows(rows - 1);
                    }}
                >
                    <i className="fa-solid fa-ban"></i>
                </div>
            );
        }
    }

    Ts.push(
        <div
            key={"addRowTag"}
            className={styles.addRowTag}
            onClick={() => {
                setRows(rows + 1);
            }}
        >
            <i className="fa-solid fa-arrow-turn-down"></i>
        </div>
    );

    return (
        <article id={styles.homeGridWrapper}>
            <section id={styles.sidebarCollumnLeft}>
                <section id={styles.sidebarWrapperLeft}>
                    <section
                        id={styles.sidebarLeft}
                        style={{
                            gridTemplateRows: `repeat(${rows * 2 + 1}, 0px)`,
                        }}
                    >
                        {Ts}
                    </section>
                </section>
            </section>
            <section
                id={styles.homeGrid}
                style={{
                    gridTemplateColumns: `repeat(${collumns}, 7.5rem)`,
                    gridTemplateRows: `repeat(${rows}, 7.5rem)`,
                }}
            >
                {gridFields}
            </section>
            <section id={styles.sidebarCollumnRight}>
                <section id={styles.sidebarWrapperRight}>
                    <section
                        id={styles.sidebarRight}
                        style={{
                            height: `calc(7.5rem * ${rows} + 1rem * ${
                                rows - 1
                            })`,
                        }}
                    >
                        <div
                            className={styles.addCollumnTag}
                            onClick={() => {
                                setCollumns(collumns + 1);
                            }}
                        >
                            <i className="fa-solid fa-arrow-turn-down"></i>
                        </div>
                        {collumns >= 2 ? (
                            <div
                                className={styles.removeCollumnTag}
                                onClick={() => {
                                    setCollumns(collumns - 1);
                                }}
                            >
                                <i className="fa-solid fa-ban"></i>
                            </div>
                        ) : null}
                    </section>
                </section>
            </section>
        </article>
    );
}
