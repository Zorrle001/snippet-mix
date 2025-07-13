import OutputFader from "@/components/OutputFader";
import {
    getOutputChannelColor,
    OutputChannelEnum,
    SnippetObjType,
    sortOutputChannelEnumArray,
} from "@/components/PopUps/CreateSnippetPopUp";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import homeStyles from "@/styles/HomeStyles.module.scss";
import styles from "@/styles/tabs/InputTabStyles.module.scss";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};

let activeOutputChannel = OutputChannelEnum.LR;
let lastActiveOutputChannel: OutputChannelEnum | null = null;
let lastOutputDisplayName = "";
let lastOutputDisplayColor = getOutputChannelColor(OutputChannelEnum.MIX1);

let llaoc: null | OutputChannelEnum = null;

export default function OutputTab({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const faders = [];
    for (const outputChannelID of sortOutputChannelEnumArray(
        Object.keys(snippetObj.snippetOutputChannels) as OutputChannelEnum[]
    )) {
        const outputChannelObj =
            snippetObj.snippetOutputChannels[outputChannelID];
        console.log(outputChannelObj);

        faders.push(
            <OutputFader
                outputChannelEnum={outputChannelID as OutputChannelEnum}
                outputChannelObj={outputChannelObj}
                onChange={(value: number) => {
                    outputChannelObj.bus.fader = {
                        enabled: outputChannelObj.bus.fader.enabled,
                        value,
                    };
                    setSnippets(() => [...snippets]);
                    console.log([...snippets]);
                }}
                onOutputChannelObjUpdate={() => {
                    setSnippets(() => [...snippets]);
                }}
                glowColor={
                    outputChannelID !== OutputChannelEnum.LR
                        ? getOutputChannelColor(outputChannelID)
                        : undefined
                }
                key={outputChannelID}
            />
        );
    }

    return (
        <>
            <article id={styles.inputTab} className={styles.noMasterSection}>
                <section id={styles.faderWrapper}>
                    <section id={styles.faderContainer}>
                        <div id={styles.faderContainer2}>{faders}</div>
                    </section>
                </section>
            </article>
        </>
    );
}

export function OutputTabShortcutButtons({ snippets, snippetObj }: Props) {
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const [allFaderPropertiesEnabled, allMutePropertiesEnabled] =
        allPropertiesEnabledCombined();

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

        for (const outputChannelID of Object.keys(
            snippetObj.snippetOutputChannels
        )) {
            const outputChannelObj =
                snippetObj.snippetOutputChannels[outputChannelID];

            channelCount++;
            if (outputChannelObj.bus.fader.enabled == true) {
                enabledFaderChannels++;
            }
            if (outputChannelObj.bus.state.enabled == true) {
                enabledMuteChannels++;
            }
        }

        const allFaderPropertiesEnabled =
            enabledFaderChannels === channelCount ? true : false;
        const allMutePropertiesEnabled =
            enabledMuteChannels === channelCount ? true : false;

        return [allFaderPropertiesEnabled, allMutePropertiesEnabled];
    }

    return (
        <section id={homeStyles.shortcutBtns}>
            <button
                id={homeStyles.faderSCBtn}
                onClick={() => {
                    setSnippets((snippets) => {
                        for (const outputChannelID of Object.keys(
                            snippetObj.snippetOutputChannels
                        )) {
                            const outputChannelObj =
                                snippetObj.snippetOutputChannels[
                                    outputChannelID
                                ];

                            if (!allFaderPropertiesEnabled) {
                                outputChannelObj.bus.fader.enabled = true;
                            } else {
                                outputChannelObj.bus.fader.enabled = false;
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
                        for (const outputChannelID of Object.keys(
                            snippetObj.snippetOutputChannels
                        )) {
                            const outputChannelObj =
                                snippetObj.snippetOutputChannels[
                                    outputChannelID
                                ];

                            if (!allMutePropertiesEnabled) {
                                outputChannelObj.bus.state.enabled = true;
                            } else {
                                outputChannelObj.bus.state.enabled = false;
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
        </section>
    );
}
