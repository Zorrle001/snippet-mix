import styles from "@/styles/ColorCardStyles.module.scss";
import { MouseEventHandler } from "react";

type Props = {
    color: COLORType;
    active?: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
};

export const COLORS = {
    Purple: ["Lila", "purple"],
    Magenta: ["Magenta", "magenta"],
    Red: ["Rot", "red"],
    Orange: ["Orange", "orange"],
    Yellow: ["Gelb", "yellow"],
    Blue: ["Blau", "blue"],
    Cyan: ["Cyan", "cyan"],
    Green: ["Grün", "green"],
    Gray: ["Grau", "gray"],
};
type COLORType = string[];

export default function ColorCard({ color, active, onClick }: Props) {
    return (
        <div
            id={styles.colorCard}
            className={
                active
                    ? styles[color[1]] + " " + styles.active
                    : styles[color[1]]
            }
            onClick={onClick}
        >
            {color[0]}
        </div>
    );
}
