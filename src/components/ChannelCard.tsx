import styles from "@/styles/ChannelCardStyles.module.scss";
import { MouseEventHandler } from "react";

type Props = {
    id: number;
    name: string;
    selected?: boolean;
    onClick: MouseEventHandler<HTMLElement>;
};
export default function ChannelCard({ id, name, selected, onClick }: Props) {
    return (
        <article
            id={styles.channelCard}
            className={selected ? styles.selected : ""}
            onClick={onClick}
        >
            <i
                className="fa-solid fa-arrow-right-to-bracket"
                id={styles.channelIcon}
            ></i>

            <p id={styles.channelID}>CH {id}</p>
            <p id={styles.channelName}>{name}</p>
        </article>
    );
}
