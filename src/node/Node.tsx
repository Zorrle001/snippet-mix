"use client";

import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useNodeConnectionManagerStore } from "@/hooks/useNodeConnectionManagerStore";
import { PageObjType, usePagesStore } from "@/hooks/usePagesStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import NodeEffect from "./NodeEffect";

export type NodeMessage = {
    id: string;
    data: any;
    error?: string;
};

//var serverSnippets: any = [];

export default function Node({}) {
    const setConnected = useNodeConnectionManagerStore(
        (state) => state.setConnected
    );
    const setLoading = useNodeConnectionManagerStore(
        (state) => state.setLoading
    );

    const snippets = useSnippetStore((state) => state.snippets);
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const pages = usePagesStore((state) => state.pages);
    const setPages = usePagesStore((state) => state.setPages);

    const [nodeSnippets, setNodeSnippets] = useState<SnippetObjType[]>([]);
    const [nodePages, setNodePages] = useState<PageObjType[]>([]);

    const [nodeURL, setNodeURL] = useLocalStorage("nodeURL", null);
    const router = useRouter();

    useEffect(() => {
        if (nodeURL == null) {
            router.replace("/nodes");
        }
    }, [nodeURL, router]);

    if (nodeURL == null) {
        return null;
    }

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket("ws://" + nodeURL, {
        share: true,
        onOpen: () => {
            // MOVED TO Connect Message
            /*setConnected(true);
            setLoading(false);*/

            // @ts-ignore
            window.sendJSONMessage = sendJsonMessage;
        },
        onClose: () => {
            setConnected(false);
            setLoading(false);

            // @ts-ignore
            window.sendJSONMessage = undefined;
        },
        onError: (e) => {
            console.error(e);
        },
        onMessage: () => {
            console.log("Message:", new Date().getTime());
        },
    });

    // ON MSG
    useEffect(() => {
        if (lastJsonMessage == null) return;
        console.log("RECIEVED:", lastJsonMessage);

        const message = lastJsonMessage as NodeMessage;

        if (
            message.id === undefined ||
            !(message.data === undefined || message.error === undefined)
        ) {
            console.error("Message structure is invalid");
            return;
        }

        const id = message.id;
        const data = message.data;

        if (id === "Connected") {
            setConnected(true);
            setLoading(false);

            setNodeSnippets(data.snippets);
            setSnippets(() => structuredClone(data.snippets));
            setNodePages(data.pages);
            setPages(() => structuredClone(data.pages));
        } else if (id === "SnippetsUpdate") {
            //setServerSnippets(data);
            setNodeSnippets(data);
            setSnippets(() => structuredClone(data));
        } else if (id === "PagesUpdate") {
            //setServerSnippets(data);
            setNodePages(data);
            setPages(() => structuredClone(data));
        } else if (id === "FILL_SNIPPET_OBJECT_RES") {
            //setServerSnippets(data);
            if (message.error !== undefined) {
                window.alert(
                    "ERROR in backend on Creating Snippet Object: " +
                        message.error
                );
                return;
            }

            setSnippets((prevSnippets) => [...prevSnippets, data]);

            alert("Snippet " + data.snippetName + " successfully created");
        } else if (id === "UPDATE_SNIPPET_OBJECT_RES") {
            //setServerSnippets(data);
            if (message.error !== undefined) {
                window.alert(
                    "ERROR in backend on Updating Snippet Object: " +
                        message.error
                );
                return;
            }

            setSnippets((prevSnippets) => {
                const snp = prevSnippets.find(
                    (snp) => snp.snippetID === data.snippetID
                );
                if (!snp) {
                    alert("Can't set snippet update. Snippet not Found");
                    return prevSnippets;
                }

                snp.snippetOutputChannels = data.snippetOutputChannels;

                alert("Snippet " + data.snippetName + " successfully updated");
                return [...prevSnippets];
            });
        } else {
            console.error("MessageID is invalid");
        }
        console.log("Date Recieved on:", new Date().getTime());
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log("%cSERVER SNIPPETS UPDATE", "color: purple", nodeSnippets);
    }, [nodeSnippets]);

    useEffect(() => {
        if (objectsEqual(snippets, nodeSnippets)) {
            console.log("%cPrevented SNIPPETS loop", "color: red");
            return;
        }

        //serverSnippets = snippets;
        //console.log("SET SERVER SNIPPETS");
        sendJsonMessage({
            id: "SnippetsUpdate",
            data: snippets,
        });

        setNodeSnippets(structuredClone(snippets));

        console.log("Snippets Update");
    }, [snippets]);

    useEffect(() => {
        console.log("%cSERVER PAGES UPDATE", "color: green", nodePages);
    }, [nodePages]);

    useEffect(() => {
        if (objectsEqual(pages, nodePages)) {
            console.log("%cPrevented PAGES loop", "color: red");
            return;
        }

        sendJsonMessage({
            id: "PagesUpdate",
            data: pages,
        });

        setNodePages(structuredClone(pages));

        console.log("Pages Update");
    }, [pages]);

    /*useSnippetStore.subscribe(
        (state) => state.snippets,
        (snippets) => {
            if (objectsEqual(snippets, serverSnippets)) {
                console.log("Prevented loop");
                return;
            } else {
                /*console.warn(
                    snippets,
                    serverSnippets
                    //snippets == serverSnippets,
                    //snippets === serverSnippets
                );*/
    /*}
            sendJsonMessage({
                id: "SnippetsUpdate",
                data: snippets,
            });
            console.log("SEND UPDATE");
        }
    );*/

    return (
        <>
            {/* <h1 style={{ color: "white" }}>
                Loading: {isLoading.toString()} Connected:{" "}
                {isConnected.toString()}
            </h1> */}
        </>
    );
    return (
        <NodeEffect
            lastJsonMessage={lastJsonMessage as NodeMessage | null}
            sendJsonMessage={sendJsonMessage}
        />
    );
}

function objectsEqual(obj1: Object, obj2: Object) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
