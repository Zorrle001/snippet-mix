import styles from "@/styles/FlatSnippetCardStyles.module.scss";

type Props = {
    id: number | string;
    name: string;
    icon?: string;
    color: string[];
    nextEnabled: boolean;
    prevEnabled: boolean;
    onNext: () => void;
    onPrev: () => void;
};
export default function FlatSnippetCard({
    id,
    name,
    icon = "fa-solid fa-cube",
    color,
    nextEnabled,
    prevEnabled,
    onNext,
    onPrev,
}: Props) {
    return (
        <article id={styles.flatSnippedCard} className={styles[color[1]]}>
            <section
                id={styles.prevSnippet}
                className={prevEnabled ? "" : styles.disabled}
                onClick={() => {
                    if (prevEnabled) onPrev();
                }}
            >
                <i className="fa-solid fa-angle-left"></i>
            </section>
            <i className={icon} id={styles.snippedIcon}></i>
            <p id={styles.snippedID}>
                {typeof id === "number" ? `Snp ${id}` : id}
            </p>
            <p id={styles.snippedName}>{name}</p>
            <section
                id={styles.nextSnippet}
                className={nextEnabled ? "" : styles.disabled}
                onClick={() => {
                    if (nextEnabled) onNext();
                }}
            >
                <i className="fa-solid fa-angle-right"></i>
            </section>
        </article>
    );
}
