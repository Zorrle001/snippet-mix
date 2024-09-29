import styles from "@/styles/SlimChannelCardStyles.module.scss";
import { cn } from "@/utils/Utils";
import { CSSProperties, MouseEventHandler } from "react";

type Props = {
    id: string;
    name: string;
    selected?: boolean;
    onClick: MouseEventHandler<HTMLElement>;
    sendsActive?: boolean;
    color?: string;
    sendsActiveStartingStyle?: boolean;
    icon?: string;
    iconStyle?: CSSProperties;
};
export default function ChannelCard({
    id,
    name,
    selected,
    onClick,
    sendsActive = false,
    color = undefined,
    sendsActiveStartingStyle: lastSendsActive = false,
    icon = undefined,
    iconStyle = undefined,
}: Props) {
    return (
        <article
            id={styles.slimChannelCard}
            className={cn(
                selected ? styles.selected : "",
                sendsActive == true
                    ? styles.sendsActive
                    : styles.sendsNotActive,
                lastSendsActive == true
                    ? styles.lastSendsActive
                    : styles.lastSendsNotActive
                /* lastSendsActive == true
                    ? styles.sendsActiveStartingStyle
                    : styles.sendsInactiveStartingStyle */
            )}
            onClick={onClick}
            style={
                color
                    ? ({
                          "--channelColor": color,
                      } as CSSProperties)
                    : undefined
            }
        >
            <i
                className={icon ? icon : "fa-solid fa-arrow-right-to-bracket"}
                id={styles.channelIcon}
                style={iconStyle}
            ></i>

            <p id={styles.channelID}>
                {/* CH  */}
                {id}
            </p>
            <p id={styles.channelName}>{name}</p>
        </article>
    );
}
