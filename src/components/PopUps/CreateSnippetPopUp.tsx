"use client";

import { usePopUpStore } from "@/hooks/usePopUpStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import { useState } from "react";
import { COLORS } from "../ColorCard";
import SnippetDesignPopUp from "./SubPopUps/SnippetDesignPopUp";
import SnippetInputPopUp from "./SubPopUps/SnippetInputPopUp";

type Props = {};

export type SnippetObjectType = {
    snippetID: number;
    snippetName: string;
    snippetIcon: string;
    snippetColor: string[];
    snippetChannels: SnippetObjectChannelsType;
};

export type SnippetObjectChannelsType = {
    [key: number]: Object;
};

export default function CreateSnippetPopUp({}: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);
    const getSnippetCount = useSnippetStore((state) => state.getSnippetCount);
    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    const ID = getSnippetCount() + 1;

    const [page, setPage] = useState(0);

    const [snippetObject, setSnippetObject] = useState<SnippetObjectType>({
        snippetID: ID,
        snippetName: `Snippet ${ID}`,
        snippetIcon: "fa-solid fa-cube",
        snippetColor: COLORS.Yellow,
        snippetChannels: {},
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
            onConfirm={(snippetChannels) => {
                setSnippets((snippets) => [
                    ...snippets,
                    { ...snippetObject, snippetChannels },
                ]);
                setSnippetObject({ ...snippetObject, snippetChannels });
                setOpenedPopUp(null);
            }}
            onCancel={(snippetChannels) => {
                setSnippetObject({ ...snippetObject, snippetChannels });
                setPage(0);
            }}
        />
    );
}
