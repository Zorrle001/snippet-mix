"use client";

import { FontClassName } from "@/app/layout";
import ColorCard, { COLORS } from "@/components/ColorCard";
import Label from "@/components/Label";
import {
    FloatingPopUp,
    PopUpActions,
    PopUpContent,
    PopUpHeader,
} from "@/components/PopUp";
import SnippetCard from "@/components/SnippetCard";
import colorCardStyles from "@/styles/ColorCardStyles.module.scss";
import labelStyles from "@/styles/LabelStyles.module.scss";
import popupStyles from "@/styles/PopUpStyles.module.scss";
import { useState } from "react";
import { SnippetObjectType } from "../CreateSnippetPopUp";

type Props = {
    onConfirm: (snippetObject: SnippetObjectType) => void;
};
export default function SnippetDesignPopUp({
    snippetID,
    snippetName,
    snippetIcon = "fa-solid fa-cube",
    snippetColor = COLORS.Yellow,
    snippetChannels,
    onConfirm,
}: SnippetObjectType & Props) {
    const [page, setPage] = useState(0);

    const [name, setName] = useState(snippetName);
    const [icon, setIcon] = useState(snippetIcon);
    const [color, setColor] = useState(snippetColor);

    const SnippetPreviewCard = (
        <SnippetCard
            id={snippetID}
            name={name}
            icon={icon}
            color={color}
            channelCount={Object.keys(snippetChannels).length}
            faderIndicator={false}
            gainIndicator={false}
        ></SnippetCard>
    );

    const NamePageContent = (
        <input
            type="text"
            id={popupStyles.nameInput}
            defaultValue={name}
            className={FontClassName}
            onChange={(e) => {
                setName(e.target.value);
            }}
        />
    );

    const ColorPageContent = (
        <>
            <section
                className={colorCardStyles.cardHolder}
                id={popupStyles.colorPage}
            >
                <ColorCard
                    color={COLORS.Purple}
                    active={color == COLORS.Purple}
                    onClick={() => {
                        setColor(COLORS.Purple);
                    }}
                />
                <ColorCard
                    color={COLORS.Magenta}
                    active={color == COLORS.Magenta}
                    onClick={() => {
                        setColor(COLORS.Magenta);
                    }}
                />
                <ColorCard
                    color={COLORS.Red}
                    active={color == COLORS.Red}
                    onClick={() => {
                        setColor(COLORS.Red);
                    }}
                />
                <ColorCard
                    color={COLORS.Orange}
                    active={color == COLORS.Orange}
                    onClick={() => {
                        setColor(COLORS.Orange);
                    }}
                />
                <ColorCard
                    color={COLORS.Yellow}
                    active={color == COLORS.Yellow}
                    onClick={() => {
                        setColor(COLORS.Yellow);
                    }}
                />
            </section>

            <section className={colorCardStyles.cardHolder}>
                <ColorCard
                    color={COLORS.Blue}
                    active={color == COLORS.Blue}
                    onClick={() => {
                        setColor(COLORS.Blue);
                    }}
                />
                <ColorCard
                    color={COLORS.Cyan}
                    active={color == COLORS.Cyan}
                    onClick={() => {
                        setColor(COLORS.Cyan);
                    }}
                />
                <ColorCard
                    color={COLORS.Green}
                    active={color == COLORS.Green}
                    onClick={() => {
                        setColor(COLORS.Green);
                    }}
                />
                <ColorCard
                    color={COLORS.Gray}
                    active={color == COLORS.Gray}
                    onClick={() => {
                        setColor(COLORS.Gray);
                    }}
                />
            </section>
        </>
    );

    const IconPageContent = (
        <section id={popupStyles.iconSection}>
            <i
                className={`fa-solid fa-cube ${
                    icon == "fa-solid fa-cube" ? popupStyles.active : ""
                }`}
                onClick={() => setIcon("fa-solid fa-cube")}
            ></i>
            <i
                className={`fa-solid fa-layer-group ${
                    icon == "fa-solid fa-layer-group" ? popupStyles.active : ""
                }`}
                onClick={() => setIcon("fa-solid fa-layer-group")}
            ></i>
            <i
                className={`fa-regular fa-clipboard ${
                    icon == "fa-regular fa-clipboard" ? popupStyles.active : ""
                }`}
                onClick={() => setIcon("fa-regular fa-clipboard")}
            ></i>
            <i
                className={`fa-solid fa-music ${
                    icon == "fa-solid fa-music" ? popupStyles.active : ""
                }`}
                onClick={() => setIcon("fa-solid fa-music")}
            ></i>
            <i
                className={`fa-solid fa-microphone-lines ${
                    icon == "fa-solid fa-microphone-lines"
                        ? popupStyles.active
                        : ""
                }`}
                onClick={() => setIcon("fa-solid fa-microphone-lines")}
            ></i>
            <i
                className={`fa-regular fa-circle-play ${
                    icon == "fa-regular fa-circle-play"
                        ? popupStyles.active
                        : ""
                }`}
                onClick={() => setIcon("fa-regular fa-circle-play")}
            ></i>
            <i
                className={`fa-solid fa-user-large ${
                    icon == "fa-solid fa-user-large" ? popupStyles.active : ""
                }`}
                onClick={() => setIcon("fa-solid fa-user-large")}
            ></i>
            <i
                className={`fa-regular fa-floppy-disk ${
                    icon == "fa-regular fa-floppy-disk"
                        ? popupStyles.active
                        : ""
                }`}
                onClick={() => setIcon("fa-regular fa-floppy-disk")}
            ></i>
        </section>
    );

    return (
        <FloatingPopUp title="Snippet Design">
            <PopUpHeader>
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
            </PopUpHeader>
            <PopUpContent>
                {page == 0
                    ? NamePageContent
                    : page == 1
                    ? IconPageContent
                    : ColorPageContent}
            </PopUpContent>
            <PopUpActions
                confirm="Weiter"
                onConfirmClick={() => {
                    onConfirm({
                        snippetID,
                        snippetName: name,
                        snippetIcon: icon,
                        snippetColor: color,
                        snippetChannels,
                    });
                }}
            />
        </FloatingPopUp>
    );
}
