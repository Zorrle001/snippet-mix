"use client";

import { usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import { CSSProperties, useState } from "react";
import { COLORS } from "../ColorCard";
import SnippetDesignPopUp from "./SubPopUps/SnippetDesignPopUp";
import SnippetInputPopUp from "./SubPopUps/SnippetInputPopUp";

type Props = {};

export type SnippetObjType = {
    snippetID: number;
    snippetName: string;
    snippetIcon: string;
    snippetColor: string[];
    snippetChannels: string[];
    snippetOutputChannels: SnippetObjOutputChannelListType;
};

export type SnippetObjSendsListType = {
    [key: string]: SnippetObjChannelObjType;
};

export enum OutputChannelEnum {
    LR = "lr",
    MONO = "mono",
    MIX1 = "mix1",
    MIX2 = "mix2",
    MIX3 = "mix3",
    MIX4 = "mix4",
    MIX5 = "mix5",
    MIX6 = "mix6",
    MIX7 = "mix7",
    MIX8 = "mix8",
    MIX9 = "mix9",
    MIX10 = "mix10",
    MIX11 = "mix11",
    MIX12 = "mix12",
    MIX13 = "mix13",
    MIX14 = "mix14",
    MTX1 = "mtx1",
    MTX2 = "mtx2",
    MTX3 = "mtx3",
    MTX4 = "mtx4",
    FX1 = "fx1",
    FX2 = "fx2",
    FX3 = "fx3",
    FX4 = "fx4",
}

export enum OutputChannelTypeEnum {
    LR = "lr",
    MONO = "mono",
    MIX = "mix",
    MTX = "mtx",
    FX = "fx",
}

export function getOutputChannelColor(channel: OutputChannelEnum) {
    const type = getOutputChannelType(channel);
    if (type == OutputChannelTypeEnum.LR) {
        return "#d92b2b";
    } else if (type == OutputChannelTypeEnum.MONO) {
        return "#a1a1a5";
    } else if (type == OutputChannelTypeEnum.MIX) {
        return "#e5cf2e";
    } else if (type == OutputChannelTypeEnum.MTX) {
        return "#e5742e";
    } else if (type == OutputChannelTypeEnum.FX) {
        return "#008ae7";
    }
}

export function getOutputChannelType(channel: OutputChannelEnum) {
    if (channel == OutputChannelEnum.LR) {
        return OutputChannelTypeEnum.LR;
    } else if (channel == OutputChannelEnum.MONO) {
        return OutputChannelTypeEnum.MONO;
    } else if (channel.includes("mix")) {
        return OutputChannelTypeEnum.MIX;
    } else if (channel.includes("mtx")) {
        return OutputChannelTypeEnum.MTX;
    } else if (channel.includes("fx")) {
        return OutputChannelTypeEnum.FX;
    }
}

export function getOutputChannelIcon(channel: OutputChannelEnum) {
    const type = getOutputChannelType(channel);
    if (type == OutputChannelTypeEnum.LR) {
        return "fa-solid fa-square-poll-vertical";
    } else if (type == OutputChannelTypeEnum.MONO) {
        return "fa-solid fa-square-poll-vertical";
    } else if (type == OutputChannelTypeEnum.MIX) {
        return "fa-solid fa-sliders";
    } else if (type == OutputChannelTypeEnum.MTX) {
        return "fa-solid fa-gears";
    } else if (type == OutputChannelTypeEnum.FX) {
        return "fa-solid fa-wand-magic-sparkles";
    } else return "fa-solid fa-square-poll-vertical";
}

export function getOutputChannelIconStyles(
    channel: OutputChannelEnum
): CSSProperties {
    const type = getOutputChannelType(channel);
    if (type == OutputChannelTypeEnum.MIX) {
        return { fontSize: "1.85rem" };
    } else if (
        type == OutputChannelTypeEnum.MTX ||
        type == OutputChannelTypeEnum.FX
    ) {
        return { fontSize: "1.75rem" };
    } else return {};
}

export function getOutputChannelDisplayName(enumString: string): string {
    // Finde Zahlen am Ende des Strings und trenne sie vom Rest
    const result = enumString.replace(/(\d+)$/, " $1");

    // In Großbuchstaben umwandeln und zurückgeben
    return result.toUpperCase();
}

export function getMIXOutputChannelEnum(mixID: number) {
    const mixes = [
        OutputChannelEnum.MIX1,
        OutputChannelEnum.MIX2,
        OutputChannelEnum.MIX3,
        OutputChannelEnum.MIX4,
        OutputChannelEnum.MIX5,
        OutputChannelEnum.MIX6,
        OutputChannelEnum.MIX7,
        OutputChannelEnum.MIX8,
        OutputChannelEnum.MIX9,
        OutputChannelEnum.MIX10,
        OutputChannelEnum.MIX11,
        OutputChannelEnum.MIX12,
        OutputChannelEnum.MIX13,
        OutputChannelEnum.MIX14,
    ];
    return mixes[mixID - 1];
}
export function getMTXOutputChannelEnum(mtxID: number) {
    const matrixes = [
        OutputChannelEnum.MTX1,
        OutputChannelEnum.MTX2,
        OutputChannelEnum.MTX3,
        OutputChannelEnum.MTX4,
    ];
    return matrixes[mtxID - 1];
}
export function getFXOutputChannelEnum(fxID: number) {
    const fxs = [
        OutputChannelEnum.FX1,
        OutputChannelEnum.FX2,
        OutputChannelEnum.FX3,
        OutputChannelEnum.FX4,
    ];
    return fxs[fxID - 1];
}

export function sortOutputChannelEnumArray(channels: OutputChannelEnum[]) {
    const sortOrder = [
        OutputChannelTypeEnum.LR,
        OutputChannelTypeEnum.MONO,
        OutputChannelTypeEnum.MIX,
        OutputChannelTypeEnum.MTX,
        OutputChannelTypeEnum.FX,
    ];

    // uses startsWith
    return channels.toSorted((a, b) => {
        // Finde die Priorität (Index) in der Sortierliste für beide Elemente
        const priorityA = sortOrder.findIndex((order) => a.startsWith(order));
        const priorityB = sortOrder.findIndex((order) => b.startsWith(order));

        // Sortiere nach Priorität
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Wenn die Priorität gleich ist, sortiere nach der Nummer
        const numA = parseInt(a.replace(/\D/g, ""), 10) || 0; // Extrahiere die Zahl oder nimm 0, falls keine vorhanden
        const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;

        return numA - numB;
    });
}

export type SnippetObjOutputChannelListType = {
    [key: string]: SnippetObjOutputChannelObjType;
};

export type SnippetObjChannelObjType = {
    state: {
        enabled: boolean;
        value: boolean | null;
    };
    fader: {
        enabled: boolean;
        value: number | null;
    };
};

export type SnippetObjOutputChannelObjType = {
    bus: {
        state: {
            enabled: boolean;
            value: boolean | null;
        };
        fader: {
            enabled: boolean;
            value: number | null;
        };
    };
    sends: SnippetObjSendsListType;
};

export default function CreateSnippetPopUp({}: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);
    const getSnippetCount = useSnippetStore((state) => state.getSnippetCount);
    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const ID = getSnippetCount() + 1;

    const [page, setPage] = useState(0);

    const [snippetObject, setSnippetObject] = useState<SnippetObjType>({
        snippetID: ID,
        snippetName: `Snippet ${ID}`,
        snippetIcon: "fa-solid fa-cube",
        snippetColor: COLORS.Yellow,
        snippetChannels: [],
        snippetOutputChannels: {},
    });

    console.log("RENDER", snippetObject);

    return page == 0 ? (
        <SnippetDesignPopUp
            {...snippetObject}
            onConfirm={(snippetObject) => {
                setSnippetObject({ ...snippetObject });
                setPage(1);
                console.log(snippetObject);
            }}
        />
    ) : (
        <SnippetInputPopUp
            {...snippetObject}
            onConfirm={CREATE_SNIPPET}
            onCancel={(snippetChannels) => {
                setSnippetObject({ ...snippetObject, snippetChannels });
                setPage(0);
            }}
        />
    );

    function CREATE_SNIPPET(snippetChannels: string[]) {
        const sortedChannels = snippetChannels.sort((a, b) => {
            // Extrahiere die Zahl nach "ch" aus jedem String und konvertiere sie in eine Zahl
            const numA = parseInt(a.replace("ch", ""));
            const numB = parseInt(b.replace("ch", ""));

            // Vergleiche die extrahierten Zahlen
            return numA - numB;
        });

        const newSnippetObj = {
            ...snippetObject,
            snippetChannels: sortedChannels,
            snippetOutputChannels: {} as SnippetObjOutputChannelListType,
        };

        // LOAD DATA FROM MIXER!
        // @ts-ignore
        if (window.sendJSONMessage === undefined) {
            alert("WS not connected! Can't load Mixer Data");
            return;
        }

        // @ts-ignore
        window.sendJSONMessage({
            id: "FILL_SNIPPET_OBJECT",
            data: {
                emptySnippetObj: newSnippetObj,
            },
        });
        console.log("REQUESTED SNIPPET FILL");
        setOpenedPopUp(null);
        return;

        const channels = {} as SnippetObjSendsListType;
        for (const selectedChannel of sortedChannels) {
            channels[selectedChannel] = {
                state: {
                    enabled: false,
                    value: null,
                },
                fader: {
                    enabled: false,
                    value: null,
                },
            } as SnippetObjChannelObjType;
        }
        newSnippetObj.snippetOutputChannels[OutputChannelEnum.LR] = {
            bus: {
                fader: {
                    enabled: false,
                    value: 0,
                },
                state: {
                    enabled: false,
                    value: false,
                },
            },
            sends: channels,
        };

        setSnippets((snippets) => [...snippets, newSnippetObj]);
        setSnippetObject(newSnippetObj);
        setOpenedPopUp(null);
    }
}
