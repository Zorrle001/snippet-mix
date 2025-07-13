import ChannelCard from "@/components/ChannelCard";
import { COLORS } from "@/components/ColorCard";
import {
    getFXOutputChannelEnum,
    getMIXOutputChannelEnum,
    getMTXOutputChannelEnum,
    OutputChannelEnum,
    SnippetObjChannelObjType,
    SnippetObjOutputChannelObjType,
    SnippetObjSendsListType,
    SnippetObjType,
} from "@/components/PopUps/CreateSnippetPopUp";
import SnippetCard from "@/components/SnippetCard";
import TabBar from "@/components/UI/TabBar";
import { useSnippetStore } from "@/hooks/useSnippetStore";

import { removeItemAll } from "@/utils/Utils";
import { useState } from "react";

import styles from "@/styles/tabs/ChannelsTabStyles.module.scss";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};
export default function ChannelsTab({ snippets, snippetObj }: Props) {
    const selectedChannels = snippetObj.snippetChannels;
    const selectedOutputChannels = snippetObj.snippetOutputChannels;

    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const [tab, setTab] = useState(0);

    // TODO: Card Margin TEMPORALY REMOVED FOR FADERs
    const Cards = [];

    if (tab === 0) {
        for (let i = 1; i <= 64; i++) {
            const channelID = `ch${i}`;
            Cards.push(
                <ChannelCard
                    id={channelID}
                    name={"Channel " + i}
                    key={i}
                    selected={selectedChannels.includes(channelID)}
                    onClick={() => {
                        if (selectedChannels.includes(channelID)) {
                            removeItemAll(selectedChannels, channelID);

                            for (const outputChannels in snippetObj.snippetOutputChannels) {
                                const channels =
                                    snippetObj.snippetOutputChannels[
                                        outputChannels
                                    ].sends;

                                delete channels[channelID];
                            }

                            setSnippets(() => [...snippets]);
                        } else {
                            for (const outputChannels in snippetObj.snippetOutputChannels) {
                                const channels =
                                    snippetObj.snippetOutputChannels[
                                        outputChannels
                                    ].sends;

                                channels[channelID] = {
                                    state: {
                                        enabled: false,
                                        value: null,
                                    },
                                    fader: {
                                        enabled: false,
                                        value: null,
                                    },
                                };
                            }
                            /*selectedChannels[i] = {
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
                            selectedChannels.push(channelID);
                            selectedChannels.sort((a, b) => {
                                // Extrahiere die Zahl nach "ch" aus jedem String und konvertiere sie in eine Zahl
                                const numA = parseInt(a.replace("ch", ""));
                                const numB = parseInt(b.replace("ch", ""));

                                // Vergleiche die extrahierten Zahlen
                                return numA - numB;
                            });
                            setSnippets(() => [...snippets]);
                        }
                    }}
                />
            );
        }
    } else {
        Cards.push(
            <div>
                <ChannelCard
                    id={"lr"}
                    name="LR"
                    color={COLORS.Red}
                    icon={"fa-solid fa-square-poll-vertical"}
                    identifier="LR"
                    selected={
                        selectedOutputChannels[OutputChannelEnum.LR] !=
                        undefined
                    }
                    onClick={() => onOutputChannelClick(OutputChannelEnum.LR)}
                />
                <ChannelCard
                    id={"mono"}
                    name="Mono"
                    color={COLORS.Gray}
                    icon={"fa-solid fa-square-poll-vertical"}
                    identifier="Mono"
                    selected={
                        selectedOutputChannels[OutputChannelEnum.MONO] !=
                        undefined
                    }
                    onClick={() => onOutputChannelClick(OutputChannelEnum.MONO)}
                />
            </div>
        );

        const temp = [];
        for (let mixID = 1; mixID <= 14; mixID++) {
            const elementMixID = mixID;
            temp.push(
                <ChannelCard
                    id={`mix${mixID}`}
                    name={"MIX " + mixID}
                    color={COLORS.Yellow}
                    icon={"fa-solid fa-sliders"}
                    iconStyle={{
                        fontSize: "3.25rem",
                    }}
                    identifier={"MIX " + mixID}
                    selected={
                        selectedOutputChannels[
                            getMIXOutputChannelEnum(mixID)
                        ] != undefined
                    }
                    onClick={() =>
                        onOutputChannelClick(
                            getMIXOutputChannelEnum(elementMixID)
                        )
                    }
                />
            );
        }
        Cards.push(<div>{temp}</div>);

        const temp2 = [];
        for (let mtxID = 1; mtxID <= 4; mtxID++) {
            const elementMtxID = mtxID;
            temp2.push(
                <ChannelCard
                    id={`mtx${mtxID}`}
                    name={"MTX " + mtxID}
                    color={COLORS.Orange}
                    icon={"fa-solid fa-gears"}
                    iconStyle={{
                        fontSize: "3rem",
                    }}
                    identifier={"MTX " + mtxID}
                    selected={
                        selectedOutputChannels[
                            getMTXOutputChannelEnum(mtxID)
                        ] != undefined
                    }
                    onClick={() =>
                        onOutputChannelClick(
                            getMTXOutputChannelEnum(elementMtxID)
                        )
                    }
                />
            );
        }
        Cards.push(<div>{temp2}</div>);

        const temp3 = [];
        for (let fxID = 1; fxID <= 4; fxID++) {
            const elementFxID = fxID;
            temp3.push(
                <ChannelCard
                    id={`fx${fxID}`}
                    name={"FX " + fxID}
                    color={COLORS.Cyan}
                    icon={"fa-solid fa-wand-magic-sparkles"}
                    iconStyle={{
                        fontSize: "3rem",
                    }}
                    identifier={"FX " + fxID}
                    selected={
                        selectedOutputChannels[getFXOutputChannelEnum(fxID)] !=
                        undefined
                    }
                    onClick={() =>
                        onOutputChannelClick(
                            getFXOutputChannelEnum(elementFxID)
                        )
                    }
                />
            );
        }
        Cards.push(<div>{temp3}</div>);
    }

    return (
        <section id={styles.channelsTab}>
            <TabBar
                tabs={["Inputs", "Outputs"]}
                activeTab={tab}
                onNavigate={(tabID) => {
                    setTab(tabID);
                }}
            />
            <section id={styles.headSection}>
                <SnippetCard
                    id={snippetObj.snippetID}
                    name={snippetObj.snippetName}
                    icon={snippetObj.snippetIcon}
                    color={snippetObj.snippetColor}
                    channelCount={Object.keys(selectedChannels).length}
                    faderIndicator={false}
                    gainIndicator={false}
                ></SnippetCard>
            </section>
            {tab == 0 ? (
                <section id={styles.contentSection}>{Cards}</section>
            ) : (
                <section id={styles.outputChannelContainer}>{Cards}</section>
            )}
        </section>
    );

    function onOutputChannelClick(outputChannelEnum: OutputChannelEnum) {
        if (selectedOutputChannels[outputChannelEnum] != undefined) {
            delete selectedOutputChannels[outputChannelEnum];
            setSnippets(() => [...snippets]);
        } else {
            let channels: SnippetObjSendsListType = {};

            for (const selectedChannel of selectedChannels) {
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

            selectedOutputChannels[outputChannelEnum] = {
                bus: {
                    fader: {
                        enabled: false,
                        value: null,
                    },
                    state: {
                        enabled: false,
                        value: null,
                    },
                },
                sends: channels,
            } as SnippetObjOutputChannelObjType;

            setSnippets(() => [...snippets]);
        }
    }
}
