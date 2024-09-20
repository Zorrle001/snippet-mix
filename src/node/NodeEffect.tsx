import { useSnippetStore } from "@/hooks/useSnippetStore";
import { useEffect } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { NodeMessage } from "./Node";

type Props = {
    lastJsonMessage: NodeMessage | null;
    sendJsonMessage: SendJsonMessage;
};
export default function NodeEffect({
    lastJsonMessage,
    sendJsonMessage,
}: Props) {
    const snippets = useSnippetStore((state) => state.snippets);

    useEffect(() => {
        console.log("SNIPPETS UPDATE");
    }, [snippets]);

    return <div></div>;
}
