import styles from "@/styles/SnippetCardStyles.module.scss";

type Props = {
    id: number;
    name: string;
    icon?: string;
    color: string[];
    channelCount: number;
    faderIndicator: boolean;
    gainIndicator: boolean;
    onClick?: () => void;
};
export default function SnippetCard({
    id,
    name,
    icon = "fa-solid fa-cube",
    color,
    channelCount,
    faderIndicator,
    gainIndicator,
    onClick,
}: Props) {
    return (
        <article
            id={styles.snippedCard}
            className={styles[color[1]]}
            onClick={onClick}
        >
            <i className={icon} id={styles.snippedIcon}></i>
            <p id={styles.snippedID}>Snp {id}</p>
            <p id={styles.snippedName}>{name}</p>
            <section id={styles.snippedInfo}>
                <span className={styles.channelCount}>{channelCount} CH</span>
                {faderIndicator ? (
                    <i
                        className={
                            "fa-solid fa-circle " + styles.faderIndicator
                        }
                    ></i>
                ) : null}
                {gainIndicator ? (
                    <i
                        className={"fa-solid fa-circle " + styles.gainIndicator}
                    ></i>
                ) : null}
            </section>
        </article>
    );
}
