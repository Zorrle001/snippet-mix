import styles from "@/styles/LabelStyles.module.scss";
import { MouseEventHandler } from "react";

type Props = {
    text: string;
    className: string;
    onClick?: MouseEventHandler<HTMLSpanElement>;
    active?: boolean;
    disabled?: boolean;
};
export default function Label({
    text,
    className,
    onClick,
    active,
    disabled,
}: Props) {
    return (
        <label
            id={styles.label}
            className={
                active
                    ? className + " " + styles.active
                    : disabled
                    ? className + " " + styles.disabled
                    : className
            }
        >
            <span id={styles.text} onClick={onClick}>
                {text}
            </span>
            <span id={styles.line}></span>
            <span id={styles.circle}></span>
        </label>
    );
}
