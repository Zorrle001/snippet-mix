import { FontClassName } from "@/app/layout";
import ColorCard, { COLORS } from "@/components/ColorCard";
import Label from "@/components/Label";
import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import SnippetCard from "@/components/SnippetCard";
import { useState } from "react";

import { useSnippetStore } from "@/hooks/useSnippetStore";
import colorCardStyles from "@/styles/ColorCardStyles.module.scss";
import labelStyles from "@/styles/LabelStyles.module.scss";
import styles from "@/styles/tabs/DesignTabStyles.module.scss";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};
export default function DesignTab({ snippets, snippetObj }: Props) {
    const [page, setPage] = useState(0);

    const setSnippets = useSnippetStore((state) => state.setSnippets);

    //const [name, setName] = useState(snippetName);
    //const [icon, setIcon] = useState(snippetIcon);
    //const [color, setColor] = useState(snippetColor);

    const SnippetPreviewCard = (
        <SnippetCard
            id={snippetObj.snippetID}
            name={snippetObj.snippetName}
            icon={snippetObj.snippetIcon}
            color={snippetObj.snippetColor}
            channelCount={Object.keys(snippetObj.snippetChannels).length}
            faderIndicator={false}
            gainIndicator={false}
        ></SnippetCard>
    );

    const NamePageContent = (
        <input
            type="text"
            id={styles.nameInput}
            value={snippetObj.snippetName}
            className={FontClassName}
            onChange={(e) => {
                snippetObj.snippetName = e.target.value;
                setSnippets(() => [...snippets]);
            }}
            onBlur={() => {
                setTimeout(() => window.scrollTo(0, 0), 100);
                window.scrollBy(0, 1);
                window.scrollBy(0, -1);
            }}
        />
    );

    const ColorPageContent = (
        <>
            <section
                className={colorCardStyles.cardHolder}
                id={styles.colorPage}
            >
                <ColorCard
                    color={COLORS.Purple}
                    active={snippetObj.snippetColor == COLORS.Purple}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Purple;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Magenta}
                    active={snippetObj.snippetColor == COLORS.Magenta}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Magenta;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Red}
                    active={snippetObj.snippetColor == COLORS.Red}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Red;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Orange}
                    active={snippetObj.snippetColor == COLORS.Orange}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Orange;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Yellow}
                    active={snippetObj.snippetColor == COLORS.Yellow}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Yellow;
                        setSnippets(() => [...snippets]);
                    }}
                />
            </section>

            <section className={colorCardStyles.cardHolder}>
                <ColorCard
                    color={COLORS.Blue}
                    active={snippetObj.snippetColor == COLORS.Blue}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Blue;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Cyan}
                    active={snippetObj.snippetColor == COLORS.Cyan}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Cyan;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Green}
                    active={snippetObj.snippetColor == COLORS.Green}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Green;
                        setSnippets(() => [...snippets]);
                    }}
                />
                <ColorCard
                    color={COLORS.Gray}
                    active={snippetObj.snippetColor == COLORS.Gray}
                    onClick={() => {
                        snippetObj.snippetColor = COLORS.Gray;
                        setSnippets(() => [...snippets]);
                    }}
                />
            </section>
        </>
    );

    const IconPageContent = (
        <section id={styles.iconSection}>
            <i
                className={`fa-solid fa-cube ${
                    snippetObj.snippetIcon == "fa-solid fa-cube"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-solid fa-cube";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-solid fa-layer-group ${
                    snippetObj.snippetIcon == "fa-solid fa-layer-group"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-solid fa-layer-group";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-regular fa-clipboard ${
                    snippetObj.snippetIcon == "fa-regular fa-clipboard"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-regular fa-clipboard";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-solid fa-music ${
                    snippetObj.snippetIcon == "fa-solid fa-music"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-solid fa-music";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-solid fa-microphone-lines ${
                    snippetObj.snippetIcon == "fa-solid fa-microphone-lines"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-solid fa-microphone-lines";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-regular fa-circle-play ${
                    snippetObj.snippetIcon == "fa-regular fa-circle-play"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-regular fa-circle-play";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-solid fa-user-large ${
                    snippetObj.snippetIcon == "fa-solid fa-user-large"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-solid fa-user-large";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
            <i
                className={`fa-regular fa-floppy-disk ${
                    snippetObj.snippetIcon == "fa-regular fa-floppy-disk"
                        ? styles.active
                        : ""
                }`}
                onClick={() => {
                    snippetObj.snippetIcon = "fa-regular fa-floppy-disk";
                    setSnippets(() => [...snippets]);
                }}
            ></i>
        </section>
    );

    return (
        <section id={styles.designTab}>
            <div id={styles.card}>
                <section id={styles.headSection}>
                    <Label text="ID" className={labelStyles.idLabel} disabled />
                    <Label
                        text="Name"
                        className={labelStyles.nameLabel}
                        active={page == 0}
                        onClick={() => {
                            setPage(0);
                        }}
                    />
                    {SnippetPreviewCard}
                    <Label
                        text="Icon"
                        className={
                            labelStyles.iconLabel + " " + labelStyles.reverse
                        }
                        active={page == 1}
                        onClick={() => {
                            setPage(1);
                        }}
                    />
                    <Label
                        text="Farbe"
                        className={
                            labelStyles.colorLabel + " " + labelStyles.reverse
                        }
                        active={page == 2}
                        onClick={() => {
                            setPage(2);
                        }}
                    />
                </section>
                <section id={styles.contentSection}>
                    {page == 0
                        ? NamePageContent
                        : page == 1
                        ? IconPageContent
                        : ColorPageContent}
                </section>
            </div>
        </section>
    );
}
