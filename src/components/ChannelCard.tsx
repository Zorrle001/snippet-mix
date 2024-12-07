import styles from "@/styles/ChannelCardStyles.module.scss";
import { cn } from "@/utils/Utils";
import { CSSProperties, MouseEventHandler } from "react";
import { COLORS } from "./ColorCard";

type Props = {
    id: string;
    name: string;
    selected?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
    icon?: string;
    iconStyle?: CSSProperties;
    color?: string[];
    identifier?: string;
};
export default function ChannelCard({
    id,
    name,
    selected,
    onClick,
    icon = "fa-solid fa-arrow-right-to-bracket",
    iconStyle,
    color = COLORS.Cyan,
    identifier,
}: Props) {
    return (
        <article
            id={styles.channelCard}
            className={
                selected
                    ? cn(styles.selected, styles[color[1]])
                    : styles[color[1]]
            }
            onClick={onClick}
        >
            <i className={icon} id={styles.channelIcon} style={iconStyle}></i>

            <p id={styles.channelID}>{identifier ? identifier : id}</p>
            <p id={styles.channelName}>{name}</p>
        </article>
    );
}
