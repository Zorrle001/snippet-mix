"use client";

import { useNodeConnectionManagerStore } from "@/hooks/useNodeConnectionManagerStore";
import { useSnippetStore } from "@/hooks/useSnippetStore";

var preventStrictConnect = false;

export default function useNodeConnectionManager() {
    const socket = useNodeConnectionManagerStore((state) => state.socket);
    const setSocket = useNodeConnectionManagerStore((state) => state.setSocket);
    const isLoading = useNodeConnectionManagerStore((state) => state.isLoading);
    const setLoading = useNodeConnectionManagerStore(
        (state) => state.setLoading
    );

    //useWebSocket();

    if (socket === null && isLoading === false) connect();

    function connect() {
        const NodeIP = 8080;
        setLoading(true);

        const AppSocket = new WebSocket(`ws://localhost:${NodeIP}/`);

        AppSocket.onopen = () => {
            log("AppSocket connected");
            setLoading(false);
            setSocket(AppSocket);
        };

        AppSocket.onmessage = (e) => {
            log("Recieved:", e.data);
        };

        AppSocket.onclose = () => {
            log("AppSocket closed");
            setSocket(null);
            setLoading(false);
        };

        AppSocket.onerror = (e) => {
            error("AppSocket Error:", e);
        };
    }

    function send(obj: Object) {
        if (!socket) return;
        socket.send(JSON.stringify(socket));
    }

    useSnippetStore.subscribe(
        (state) => state.snippets,
        (snippets) => {
            if (!socket) return;
            send({
                id: "snippetsUpdate",
                data: snippets,
            });
        }
    );
}

function log(...log: any[]) {
    console.log(
        "%cAppSocket",
        "color:black; background: lightgreen; font-weight: bold; padding: 0.1rem 0.25rem; border-radius: 0.25rem",
        ...log
    );
}
function error(...log: any[]) {
    console.error(
        "%c[AppSocket]",
        "color:black; background: lightgreen; font-weight: bold; padding: 0.1rem 0.25rem; border-radius: 0.25rem",
        ...log
    );
}
