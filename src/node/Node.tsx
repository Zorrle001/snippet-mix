"use client";

import { useNodeConnectionManagerStore } from "@/hooks/useNodeConnectionManagerStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import NodeEffect from "./NodeEffect";

export type NodeMessage = {
    id: string;
    data: any;
};

//var serverSnippets: any = [];

export default function Node({}) {
    const setConnected = useNodeConnectionManagerStore(
        (state) => state.setConnected
    );
    const setLoading = useNodeConnectionManagerStore(
        (state) => state.setLoading
    );
    const isLoading = useNodeConnectionManagerStore((state) => state.isLoading);
    const isConnected = useNodeConnectionManagerStore(
        (state) => state.isConnected
    );

    const snippets = useSnippetStore((state) => state.snippets);
    const setSnippets = useSnippetStore((state) => state.setSnippets);

    const [nodeSnippets, setNodeSnippets] = useState<any>([]);

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket("ws://192.168.178.37:8080/", {
        share: true,
        onOpen: () => {
            // MOVED TO Connect Message
            /*setConnected(true);
            setLoading(false);*/
        },
        onClose: () => {
            setConnected(false);
            setLoading(false);
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

        if (message.id === undefined || message.data === undefined) {
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
        } else if (id === "SnippetsUpdate") {
            //setServerSnippets(data);
            setNodeSnippets(data);
            setSnippets(() => structuredClone(data));
        } else {
            console.error("MessageID is invalid");
        }
        console.log("Date Recieved on:", new Date().getTime());
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log("%cSERVER SNIPPETS UPDATE", "color: purple", nodeSnippets);
    }, [nodeSnippets]);

    useEffect(() => {
        console.log(
            snippets == nodeSnippets,
            JSON.stringify(snippets).includes("Orange"),
            JSON.stringify(nodeSnippets).includes("Orange")
        );
        if (objectsEqual(snippets, nodeSnippets)) {
            console.log("%cPrevented loop", "color: red");
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
