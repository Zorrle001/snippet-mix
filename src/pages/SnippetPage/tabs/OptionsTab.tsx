import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { usePagesStore } from "@/hooks/usePagesStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";

import { useSnippetStore } from "@/hooks/useSnippetStore";
import styles from "@/styles/tabs/OptionsTabStyles.module.scss";
import { removeItemAll } from "@/utils/Utils";

type Props = {
    snippets: SnippetObjType[];
    snippetObj: SnippetObjType;
};
export default function OptionsTab({ snippets, snippetObj }: Props) {
    const setSelectedSnippet = useSnippetPageStore(
        (state) => state.setSelectedSnippet
    );
    const setSnippets = useSnippetStore((state) => state.setSnippets);
    const setPages = usePagesStore((state) => state.setPages);

    return (
        <section id={styles.optionsTab}>
            <ul id={styles.optionList}>
                <li
                    onClick={() => {
                        // GET HIGHEST FREE NUMBER
                        let newSnippetID = 1;

                        for (const snippet of snippets) {
                            if (snippet.snippetID >= newSnippetID) {
                                newSnippetID = snippet.snippetID + 1;
                            }
                        }

                        setSnippets((prevSnippets) => {
                            const duplicatedSnippet =
                                structuredClone(snippetObj);
                            duplicatedSnippet.snippetID = newSnippetID;
                            duplicatedSnippet.snippetName = `${duplicatedSnippet.snippetName} - Kopie`;

                            return [...prevSnippets, duplicatedSnippet];
                        });

                        alert(
                            "Snippet wurde dupliziert auf die Snippet-ID: " +
                                newSnippetID
                        );
                    }}
                >
                    Snippet duplizieren
                </li>
                <li
                    onClick={() => {
                        //@ts-ignore
                        if (window.sendJSONMessage === undefined) {
                            alert(
                                "WS not connected! Can't override Snippet Data"
                            );
                            return;
                        }

                        //@ts-ignore
                        window.sendJSONMessage({
                            id: "UPDATE_SNIPPET_OBJECT",
                            data: {
                                emptySnippetObj: snippetObj,
                                outputChannels: [
                                    Object.keys(
                                        snippetObj.snippetOutputChannels
                                    ),
                                ],
                            },
                        });
                    }}
                >
                    Snippet Werte überschreiben
                </li>
                <li
                    onClick={() => {
                        // GET HIGHEST FREE NUMBER

                        setSelectedSnippet(null);
                        setSnippets((prevSnippets) => {
                            const snpObj = prevSnippets.find(
                                (snp) => snp.snippetID === snippetObj.snippetID
                            );
                            if (!snpObj) {
                                alert("ERROR: Couldn't find snippet obj");
                                return prevSnippets;
                            }

                            removeItemAll(prevSnippets, snpObj);

                            return [...prevSnippets];
                        });

                        setPages((prevPages) => {
                            // REMOVE IT
                            for (const page of prevPages) {
                                for (const row in page.data) {
                                    for (const collumn in page.data[row]) {
                                        let snippet = page.data[row][collumn];
                                        if (
                                            snippet.id === snippetObj.snippetID
                                        ) {
                                            delete page.data[row][collumn];
                                        }
                                    }
                                }
                            }

                            return [...prevPages];
                        });

                        alert("Snippet wurde gelöscht!");
                    }}
                >
                    Snippet löschen
                </li>
            </ul>
        </section>
    );
}
