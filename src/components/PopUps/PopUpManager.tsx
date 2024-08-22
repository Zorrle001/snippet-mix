"use client";

import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import styles from "@/styles/PopUpStyles.module.scss";
import CreateSnippetPopUp from "./CreateSnippetPopUp";

type Props = {};
export default function PopUpManager({}: Props) {
    const openedPopUp = usePopUpStore((state) => state.openedPopUp);
    console.log(openedPopUp, "MNGR");

    return openedPopUp != null ? (
        <article id={styles.popupContainer}>
            {openedPopUp == PopUps.CreatePopUp ? <CreateSnippetPopUp /> : null}
        </article>
    ) : null;
}
