"use client";

import { useNodeConnectionManagerStore } from "@/hooks/useNodeConnectionManagerStore";
import { useSnippetPageStore } from "@/hooks/useSnippetPageStore";
import HomePage from "@/pages/HomePage";
import SnippetPage from "@/pages/SnippetPage/SnippetPage";

export default function PageRenderer() {
    const isLoading = useNodeConnectionManagerStore((state) => state.isLoading);
    const isConnected = useNodeConnectionManagerStore(
        (state) => state.isConnected
    );

    const isSnippetPageVisible = useSnippetPageStore((state) =>
        state.isPageVisible()
    );

    //useNodeConnectionManager();
    //console.warn("PAGE RENDERER");

    if (!isConnected && !isLoading)
        return (
            <>
                <h1 style={{ color: "white" }}>
                    ERROR: Loading: {isLoading.toString()} Connected:{" "}
                    {isConnected.toString()}
                </h1>
                <button
                    onClick={() => {
                        location.reload();
                    }}
                >
                    RELOAD
                </button>
                <button
                    onClick={() => {
                        window.location.href =
                            window.location.href.split("?")[0] +
                            "?nocache=" +
                            new Date().getTime();
                    }}
                >
                    FORCE RELOAD
                </button>
            </>
        );

    return !isSnippetPageVisible ? <HomePage /> : <SnippetPage />;
}
