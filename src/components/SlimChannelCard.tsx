import styles from "@/styles/SlimChannelCardStyles.module.scss";
import { cn } from "@/utils/Utils";
import { MouseEventHandler } from "react";

type Props = {
    id: number;
    name: string;
    selected?: boolean;
    onClick: MouseEventHandler<HTMLElement>;
    sendsActive?: boolean;
};
export default function ChannelCard({
    id,
    name,
    selected,
    onClick,
    sendsActive = false,
}: Props) {
    return (
        <article
            id={styles.slimChannelCard}
            className={cn(
                selected ? styles.selected : "",
                sendsActive ? styles.sendsActive : ""
            )}
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
