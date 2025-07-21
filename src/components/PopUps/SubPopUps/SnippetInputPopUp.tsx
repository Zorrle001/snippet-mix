"use client";

import ChannelCard from "@/components/ChannelCard";
import PopUp, {
    PopUpActions,
    PopUpContent,
    PopUpHeader,
} from "@/components/PopUp";
import SnippetCard from "@/components/SnippetCard";
import { removeItemAll } from "@/utils/Utils";
import { useState } from "react";
import { SnippetObjType } from "../CreateSnippetPopUp";

import { v4 as uuidv4 } from "uuid";

type Props = {
    onConfirm: (snippetChannels: string[]) => void;
    onCancel: (snippetChannels: string[]) => void;
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
        useState<string[]>(snippetChannels);

    console.log(selectedChannels);

    // TODO: Card Margin TEMPORALY REMOVED FOR FADERs
    const Cards = [];
    for (let i = 1; i <= 64; i++) {
        const channelID = `ch${i}`;
        Cards.push(
            <ChannelCard
                id={channelID}
                name={"Channel " + i}
                key={uuidv4()}
                selected={selectedChannels.includes(channelID)}
                onClick={() => {
                    if (selectedChannels.includes(channelID)) {
                        setSelectedChannels((channels) => {
                            removeItemAll(selectedChannels, channelID);

                            console.log("REMOVE", channels);
                            return [...channels];
                        });
                    } else {
                        setSelectedChannels((channels) => {
                            /*channels[i] = {
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
                            };*/

                            if (channelID === "ch31") {
                                //return [...channels];
                                // TODO: REMOVE
                                return [
                                    "ch31",
                                    "ch32",
                                    "ch33",
                                    "ch34",
                                    "ch35",
                                    "ch36",
                                    "ch37",
                                    "ch38",
                                    "ch39",
                                    "ch40",
                                    "ch41",
                                    "ch42",
                                    "ch43",
                                    "ch44",
                                    "ch45",
                                    "ch46",
                                    "ch47",
                                    "ch48",
                                    "ch49",
                                    "ch50",
                                    "ch51",
                                    "ch52",
                                ];
                            }

                            if (channels.includes(channelID)) {
                                return [...channels];
                            }
                            channels.push(channelID);
                            console.log("SET", channels);
                            return [...channels];
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
                    channelCount={selectedChannels.length}
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
