"use client";

import ChannelCard from "@/components/ChannelCard";
import PopUp, {
    PopUpActions,
    PopUpContent,
    PopUpHeader,
} from "@/components/PopUp";
import SnippetCard from "@/components/SnippetCard";
import { useState } from "react";
import {
    SnippetObjChannelListType,
    SnippetObjType,
} from "../CreateSnippetPopUp";

type Props = {
    onConfirm: (snippetChannels: SnippetObjChannelListType) => void;
    onCancel: (snippetChannels: SnippetObjChannelListType) => void;
};

export default function SnippetInputPopUp({
    snippetID,
    snippetName,
    snippetIcon,
    snippetColor,
    snippetChannels,
    onConfirm,
    onCancel,
}: SnippetObjType & Props) {
    const [selectedChannels, setSelectedChannels] =
        useState<SnippetObjChannelListType>(snippetChannels);

    console.log(selectedChannels);

    // TODO: Card Margin TEMPORALY REMOVED FOR FADERs
    const Cards = [];
    for (let i = 1; i <= 64; i++) {
        Cards.push(
            <ChannelCard
                id={i}
                name={"Channel " + i}
                key={i}
                selected={selectedChannels[i] != undefined}
                onClick={() => {
                    if (selectedChannels[i] != undefined) {
                        setSelectedChannels((channels) => {
                            delete channels[i];
                            console.log("REMOVE", channels);
                            return { ...channels };
                        });
                    } else {
                        setSelectedChannels((channels) => {
                            channels[i] = {
                                fader: {
                                    enabled: false,
                                    value: null,
                                },
                                muted: {
                                    enabled: false,
                                    value: null,
                                },
                                gain: {
                                    enabled: false,
                                    value: null,
                                },
                            };
                            console.log("SET", channels);
                            return { ...channels };
                        });
                    }
                }}
            />
        );
    }

    const SnippetInputPopUp = (
        <PopUp title="Snippet Channels">
            <PopUpHeader>
                <SnippetCard
                    id={snippetID}
                    name={snippetName}
                    icon={snippetIcon}
                    color={snippetColor}
                    channelCount={Object.keys(selectedChannels).length}
                    faderIndicator={false}
                    gainIndicator={false}
                ></SnippetCard>
            </PopUpHeader>
            <PopUpContent>{Cards}</PopUpContent>
            <PopUpActions
                confirm="Speichern"
                onConfirmClick={() => {
                    onConfirm(selectedChannels);
                }}
                cancel="Zurück"
                onCancelClick={() => {
                    onCancel(selectedChannels);
                }}
            />
        </PopUp>
    );

    return SnippetInputPopUp;
}
