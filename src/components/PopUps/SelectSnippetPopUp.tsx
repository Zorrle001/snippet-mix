"use client";

import {
    FloatingHeadlessPopUp,
    PopUpActions,
    PopUpContent,
} from "@/components/PopUp";
import { CardEnum, PageObjRowDataType } from "@/hooks/usePagesStore";
import { usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import SnippetCard from "../SnippetCard";

import styles from "@/styles/SelectSnippetPopUpStyles.module.scss";

export type SelectSnippetPopUpProps = {
    onConfirm: (rowData: PageObjRowDataType) => void;
    onClear: () => void;
    onCancel?: () => void;
};
export default function SelectSnippetPopUp({
    onConfirm,
    onClear,
    onCancel,
}: SelectSnippetPopUpProps) {
    const snippets = useSnippetStore((state) => state.snippets);
    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const clearSlot = (
        <h1
            onClick={() => {
                onClear();
                setOpenedPopUp(null);
            }}
            style={{ color: "white", height: "7.5rem", width: "7.5rem" }}
            id={styles.clearGridFieldBtn}
        >
            CLEAR
        </h1>
    );

    const snippetCards = snippets.map((snippetObj) => {
        return (
            <SnippetCard
                id={snippetObj.snippetID}
                key={snippetObj.snippetID}
                name={snippetObj.snippetName}
                icon={snippetObj.snippetIcon}
                color={snippetObj.snippetColor}
                channelCount={Object.keys(snippetObj.snippetChannels).length}
                faderIndicator={false}
                gainIndicator={false}
                onClick={() => {
                    onConfirm({
                        type: CardEnum.SNIPPET,
                        id: snippetObj.snippetID - 1,
                    });
                    setOpenedPopUp(null);
                }}
            ></SnippetCard>
        );
    });

    return (
        <FloatingHeadlessPopUp title="Snippet Auswählen">
            <PopUpContent>{[clearSlot, ...snippetCards]}</PopUpContent>
            <PopUpActions
                cancel="Abbrechen"
                onCancelClick={() => {
                    if (onCancel) onCancel();
                    setOpenedPopUp(null);
                }}
            />
        </FloatingHeadlessPopUp>
    );
}
