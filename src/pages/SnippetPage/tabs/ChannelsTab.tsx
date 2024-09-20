import ChannelCard from "@/components/ChannelCard";
import { COLORS } from "@/components/ColorCard";
import {
    getFXOutputChannelEnum,
    getMIXOutputChannelEnum,
    getMTXOutputChannelEnum,
    OutputChannelEnum,
    SnippetObjType,
} from "@/components/PopUps/CreateSnippetPopUp";
import SnippetCard from "@/components/SnippetCard";
import TabBar from "@/components/UI/TabBar";
import { useSnippetStore } from "@/hooks/useSnippetStore";

import styles from "@/styles/tabs/ChannelsTabStyles.module.scss";
import { useState } from "react";

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
            Cards.push(
                <ChannelCard
                    id={i}
                    name={"Channel " + i}
                    key={i}
                    selected={selectedChannels[i] != undefined}
                    onClick={() => {
                        if (selectedChannels[i] != undefined) {
                            delete selectedChannels[i];
                            setSnippets(() => [...snippets]);
                        } else {
                            selectedChannels[i] = {
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
                    id={0}
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
                    id={0}
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
                    id={mixID}
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
                    id={mtxID}
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
                    id={fxID}
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
            selectedOutputChannels[outputChannelEnum] = {
                fader: {
                    enabled: false,
                    value: null,
                },
                muted: {
                    enabled: false,
                    value: null,
                },
                channels: {},
            };
            setSnippets(() => [...snippets]);
        }
    }
}
