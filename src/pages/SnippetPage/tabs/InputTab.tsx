import Fader from "@/components/Fader";
import OutputFader from "@/components/OutputFader";
import {
    getOutputChannelColor,
    getOutputChannelDisplayName,
    OutputChannelEnum,
    SnippetObjType,
    sortOutputChannelEnumArray,
} from "@/components/PopUps/CreateSnippetPopUp";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/tabs/InputTabStyles.module.scss";
import { cn } from "@/utils/Utils";
import { useEffect, useState } from "react";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};

let lastOutputDisplayName = "";
let lastOutputDisplayColor = getOutputChannelColor(OutputChannelEnum.MIX1);

export default function InputTab({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const [activeOutputChannel, setActiveOutputChannel] =
        useState<OutputChannelEnum>(OutputChannelEnum.LR);

    useEffect(() => {
        if (
            snippetObj.snippetOutputChannels[OutputChannelEnum.LR] != undefined
        ) {
            setActiveOutputChannel(OutputChannelEnum.LR);
        } else {
            setActiveOutputChannel(
                sortOutputChannelEnumArray(
                    Object.keys(
                        snippetObj.snippetOutputChannels
                    ) as OutputChannelEnum[]
                )[0]
            );
        }
    }, [snippetObj]);

    const faders = [];
    for (const channelID in snippetObj.snippetChannels) {
        const channelObj = snippetObj.snippetChannels[channelID];

        faders.push(
            <Fader
                channelID={parseInt(channelID)}
                channelObj={channelObj}
                onChange={(value) => {
                    channelObj.fader = {
                        enabled: channelObj.fader.enabled,
                        value,
                    };
                    // TODO: UNSAFE - doesnt use prev state
                    //setSnippets(() => snippets);
                    setSnippets(() => [...snippets]);
                    console.log([...snippets]);
                    //unsubscribedSnippets = [...snippets];
                }}
                onChannelObjUpdate={() => {
                    setSnippets(() => [...snippets]);
                }}
                key={snippetObj.snippetID + "-" + channelID}
                sendsActive={activeOutputChannel !== OutputChannelEnum.LR}
            />
        );
    }

    const outputChannelItems = [];

    if (Object.keys(snippetObj.snippetOutputChannels).length > 1) {
        for (const outputChannelEnum of sortOutputChannelEnumArray(
            Object.keys(snippetObj.snippetOutputChannels) as OutputChannelEnum[]
        )) {
            outputChannelItems.push(
                <li
                    key={`${snippetObj.snippetID}-${outputChannelEnum}`}
                    className={cn(
                        activeOutputChannel === outputChannelEnum
                            ? styles.active
                            : ""
                    )}
                    style={
                        activeOutputChannel === outputChannelEnum
                            ? {
                                  backgroundColor:
                                      getOutputChannelColor(outputChannelEnum),
                                  color:
                                      getOutputChannelColor(
                                          outputChannelEnum
                                      ) == "#e5cf2e"
                                          ? "black"
                                          : undefined,
                              }
                            : undefined
                    }
                    onClick={() => setActiveOutputChannel(outputChannelEnum)}
                >
                    {getOutputChannelDisplayName(outputChannelEnum)}
                </li>
            );
        }
    }

    let outputDisplayName = getOutputChannelDisplayName(activeOutputChannel);

    let outputDisplayColor = getOutputChannelColor(
        activeOutputChannel as OutputChannelEnum
    );

    if (activeOutputChannel == OutputChannelEnum.LR) {
        outputDisplayName = lastOutputDisplayName;
        outputDisplayColor = lastOutputDisplayColor;
    } else {
        lastOutputDisplayName = outputDisplayName;
        lastOutputDisplayColor = outputDisplayColor;
    }

    return (
        <>
            <article id={styles.inputTab}>
                <section id={styles.faderWrapper}>
                    <section id={styles.faderContainer}>
                        <div
                            id={styles.sendsIndicator}
                            className={
                                activeOutputChannel != OutputChannelEnum.LR
                                    ? styles.activeSends
                                    : ""
                            }
                        >
                            <div
                                style={{
                                    maxWidth: `calc(${
                                        faders.length
                                    } * 7.5rem + ${faders.length - 1} * 2px)`,
                                    backgroundColor: outputDisplayColor,
                                }}
                            >
                                {outputDisplayName}
                            </div>
                        </div>
                        <div id={styles.faderContainer2}>{faders}</div>
                    </section>
                </section>
                <section id={styles.masterFaderContainer}>
                    <ul id={styles.outputChannelList}>{outputChannelItems}</ul>
                    <OutputFader
                        outputChannelID={1}
                        outputChannelObj={{
                            fader: {
                                enabled: false,
                                value: 0,
                            },
                            muted: {
                                enabled: false,
                                value: true,
                            },
                        }}
                        onChange={() => {}}
                        onOutputChannelObjUpdate={() => {}}
                    />
                </section>
            </article>
        </>
    );
}

export function InputTabShortcutButtons({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const [
        allFaderPropertiesEnabled,
        allMutePropertiesEnabled,
        allGainPropertiesEnabled,
    ] = allPropertiesEnabledCombined();

    /* function allPropertiesEnabled(property: "fader" | "muted" | "gain") {
        let channelCount = 0;
        let enabledChannels = 0;

        for (const channelID in snippetObj.snippetChannels) {
            const channelObj = snippetObj.snippetChannels[channelID];

            channelCount++;
            if (channelObj[property].enabled == true) {
                enabledChannels++;
            }
        }

        return enabledChannels === channelCount ? true : false;
    } */

    function allPropertiesEnabledCombined() {
        let channelCount = 0;
        let enabledFaderChannels = 0;
        let enabledMuteChannels = 0;
        let enabledGainChannels = 0;

        for (const channelID in snippetObj.snippetChannels) {
            const channelObj = snippetObj.snippetChannels[channelID];

            channelCount++;
            if (channelObj.fader.enabled == true) {
                enabledFaderChannels++;
            }
            if (channelObj.muted.enabled == true) {
                enabledMuteChannels++;
            }
            if (channelObj.gain.enabled == true) {
                enabledGainChannels++;
            }
        }

        const allFaderPropertiesEnabled =
            enabledFaderChannels === channelCount ? true : false;
        const allMutePropertiesEnabled =
            enabledMuteChannels === channelCount ? true : false;
        const allGainPropertiesEnabled =
            enabledGainChannels === channelCount ? true : false;

        return [
            allFaderPropertiesEnabled,
            allMutePropertiesEnabled,
            allGainPropertiesEnabled,
        ];
    }

    return (
        <section id={homeStyles.shortcutBtns}>
            <button
                id={homeStyles.faderSCBtn}
                onClick={() => {
                    setSnippets((snippets) => {
                        for (const channelID in snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetChannels[channelID];

                            if (!allFaderPropertiesEnabled) {
                                channelObj.fader.enabled = true;
                            } else {
                                channelObj.fader.enabled = false;
                            }
                        }

                        return [...snippets];
                    });
                }}
            >
                {!allFaderPropertiesEnabled ? (
                    <i className="fa-regular fa-circle-check"></i>
                ) : (
                    <i className="fa-regular fa-circle"></i>
                )}
            </button>
            <button
                id={homeStyles.muteSCBtn}
                onClick={() => {
                    setSnippets((snippets) => {
                        for (const channelID in snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetChannels[channelID];

                            if (!allMutePropertiesEnabled) {
                                channelObj.muted.enabled = true;
                            } else {
                                channelObj.muted.enabled = false;
                            }
                        }

                        return [...snippets];
                    });
                }}
            >
                {!allMutePropertiesEnabled ? (
                    <i className="fa-regular fa-circle-check"></i>
                ) : (
                    <i className="fa-regular fa-circle"></i>
                )}
            </button>
            <button
                id={homeStyles.gainSCBtn}
                onClick={() => {
                    setSnippets((snippets) => {
                        for (const channelID in snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetChannels[channelID];

                            if (!allGainPropertiesEnabled) {
                                channelObj.gain.enabled = true;
                            } else {
                                channelObj.gain.enabled = false;
                            }
                        }

                        return [...snippets];
                    });
                }}
            >
                {!allGainPropertiesEnabled ? (
                    <i className="fa-regular fa-circle-check"></i>
                ) : (
                    <i className="fa-regular fa-circle"></i>
                )}
            </button>
        </section>
    );
}
