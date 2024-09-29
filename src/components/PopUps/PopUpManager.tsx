"use client";

import { PopUps, usePopUpStore } from "@/hooks/usePopUpStore";
import styles from "@/styles/PopUpStyles.module.scss";
import CreateSnippetPopUp from "./CreateSnippetPopUp";
import SelectSnippetPopUp, {
    SelectSnippetPopUpProps,
} from "./SelectSnippetPopUp";

type Props = {};
export default function PopUpManager({}: Props) {
    const openedPopUp = usePopUpStore((state) => state.openedPopUp);
    const openedPopUpProps = usePopUpStore((state) => state.openedPopUpProps);
    console.log(openedPopUp, "MNGR");

    return openedPopUp != null ? (
        <article id={styles.popupContainer}>
            {openedPopUp == PopUps.CreatePopUp ? (
                <CreateSnippetPopUp />
            ) : openedPopUp == PopUps.SelectSnippetPopUp ? (
                <SelectSnippetPopUp
                    {...(openedPopUpProps as SelectSnippetPopUpProps)}
                />
            ) : null}
        </article>
    ) : null;
}
