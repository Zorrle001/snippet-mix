import Fader from "@/components/Fader";
import OutputFader from "@/components/OutputFader";
import {
    getOutputChannelColor,
    getOutputChannelDisplayName,
    OutputChannelEnum,
    SnippetObjType,
    sortOutputChannelEnumArray,
} from "@/components/PopUps/CreateSnippetPopUp";
import { useInputTabStore } from "@/hooks/useInputTabStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/tabs/InputTabStyles.module.scss";
import { cn } from "@/utils/Utils";
import { useMemo, useState } from "react";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};

let activeOutputChannel = OutputChannelEnum.LR;
let lastActiveOutputChannel: OutputChannelEnum | null = null;
let lastOutputDisplayName = "";
let lastOutputDisplayColor = getOutputChannelColor(OutputChannelEnum.MIX1);

let llaoc: null | OutputChannelEnum = null;

export default function InputTab({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);
    const setActiveOutputChannel_GLOBAL = useInputTabStore(
        (state) => state.setActiveOutputChannel
    );
    const setLastActiveOutputChannel_GLOBAL = useInputTabStore(
        (state) => state.setLastActiveOutputChannel
    );

    //const [activeOutputChannel, setActiveOutputChannel] =
    //useState<OutputChannelEnum>(OutputChannelEnum.LR);
    function setActiveOutputChannel(channel: OutputChannelEnum) {
        lastActiveOutputChannel = activeOutputChannel;
        activeOutputChannel = channel;
        toggleRerender((count) => ++count);
        setActiveOutputChannel_GLOBAL(channel);
    }

    /*useEffect(() => {
        setActiveOutputChannel_GLOBAL(activeOutputChannel);
    }, [snippetObj]);*/

    const [rerender, toggleRerender] = useState(0);
    const [startingStyles, reloadStartingStyles] = useState(0);

    if (snippetObj.snippetOutputChannels[activeOutputChannel] == undefined) {
        setActiveOutputChannel(
            sortOutputChannelEnumArray(
                Object.keys(
                    snippetObj.snippetOutputChannels
                ) as OutputChannelEnum[]
            )[0]
        );
    }
    /*useEffect(() => {
        //if (lastSnippetID == snippetObj.snippetID) {
        //return;
        //}
        //lastSnippetID = snippetObj.snippetID;
        let newActiveOutputChannel = OutputChannelEnum.LR;
        if (
            snippetObj.snippetOutputChannels[OutputChannelEnum.LR] != undefined
        ) {
            setActiveOutputChannel(OutputChannelEnum.LR);
            toggleRerender((count) => ++count);
        } else {
            setActiveOutputChannel(
                sortOutputChannelEnumArray(
                    Object.keys(
                        snippetObj.snippetOutputChannels
                    ) as OutputChannelEnum[]
                )[0]
            );
            toggleRerender((count) => ++count);
            newActiveOutputChannel = sortOutputChannelEnumArray(
                Object.keys(
                    snippetObj.snippetOutputChannels
                ) as OutputChannelEnum[]
            )[0];
        }
        if (
            newActiveOutputChannel !== activeOutputChannel &&
            lastSnippetObj != null
        ) {
            snippetObj = lastSnippetObj;
        } else {
            lastSnippetObj = snippetObj;
        }
    }, [snippetObj]);*/

    /*if (snippetObj.snippetOutputChannels[activeOutputChannel] == undefined) {
        return <p>Loading</p>;
    }*/

    const [aoc, laoc] = useMemo(() => {
        const res = [activeOutputChannel, llaoc];
        llaoc = activeOutputChannel;
        console.log(res);
        return res;
    }, [snippetObj, startingStyles]);

    const faders = [];
    for (const channelID of snippetObj.snippetChannels) {
        const channelObj =
            snippetObj.snippetOutputChannels[activeOutputChannel].channels[
                channelID
            ];

        /*console.log(
            channelObj,
            snippetObj.snippetOutputChannels,
            activeOutputChannel,
            channelID
        );*/

        faders.push(
            <Fader
                channelID={channelID}
                channelObj={channelObj}
                onChange={(value: number) => {
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
                key={channelID}
                sendsActive={activeOutputChannel !== OutputChannelEnum.LR}
                glowColor={
                    activeOutputChannel !== OutputChannelEnum.LR
                        ? getOutputChannelColor(activeOutputChannel)
                        : undefined
                }
                // STARTS SMALL
                sendsActiveStartingStyle={
                    // ACTIVE IS LR & LAST WAS NOT LR
                    /*(aoc == OutputChannelEnum.LR &&
                        laoc != OutputChannelEnum.LR &&
                        laoc !== null) ||
                    (aoc !== OutputChannelEnum.LR &&
                        laoc !== OutputChannelEnum.LR &&
                        laoc !== null)*/
                    laoc !== OutputChannelEnum.LR && laoc !== null
                }
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
                    onClick={() => {
                        setActiveOutputChannel(outputChannelEnum);
                        reloadStartingStyles((count) => ++count);
                    }}
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

    /*if (save == true) {
        lastActiveOutputChannel = activeOutputChannel;
    }*/

    //lastActiveOutputChannel = activeOutputChannel;

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
                        outputChannelEnum={activeOutputChannel}
                        outputChannelObj={
                            snippetObj.snippetOutputChannels[
                                activeOutputChannel
                            ]
                        }
                        onChange={(value: number) => {
                            const outputChannelObj =
                                snippetObj.snippetOutputChannels[
                                    activeOutputChannel
                                ];
                            outputChannelObj.bus.fader = {
                                enabled: outputChannelObj.bus.fader.enabled,
                                value,
                            };
                            console.log(outputChannelObj);
                            // TODO: UNSAFE - doesnt use prev state
                            //setSnippets(() => snippets);
                            setSnippets(() => [...snippets]);
                            console.log([...snippets]);
                            //unsubscribedSnippets = [...snippets];
                        }}
                        onOutputChannelObjUpdate={() => {
                            setSnippets(() => [...snippets]);
                        }}
                        glowColor={
                            activeOutputChannel !== OutputChannelEnum.LR
                                ? getOutputChannelColor(activeOutputChannel)
                                : undefined
                        }
                    />
                </section>
            </article>
        </>
    );
}

export function InputTabShortcutButtons({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const activeOutputChannel = useInputTabStore(
        (state) => state.activeOutputChannel
    );

    if (snippetObj.snippetOutputChannels[activeOutputChannel] == undefined) {
        return;
    }

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

    // TODO: FIX WITH GLOBAL ACTIVE OUTPUT CHANNEL
    function allPropertiesEnabledCombined() {
        let channelCount = 0;
        let enabledFaderChannels = 0;
        let enabledMuteChannels = 0;
        let enabledGainChannels = 0;

        for (const channelID of snippetObj.snippetChannels) {
            const channelObj =
                snippetObj.snippetOutputChannels[activeOutputChannel].channels[
                    channelID
                ];

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
                        for (const channelID of snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetOutputChannels[
                                    activeOutputChannel
                                ].channels[channelID];

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
                        for (const channelID of snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetOutputChannels[
                                    activeOutputChannel
                                ].channels[channelID];

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
                        for (const channelID of snippetObj.snippetChannels) {
                            const channelObj =
                                snippetObj.snippetOutputChannels[
                                    activeOutputChannel
                                ].channels[channelID];

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
