import PageRenderer from "@/components/PageRenderer";
import PopUpManager from "@/components/PopUps/PopUpManager";
import SoloWebRTCAudio from "@/components/Solo/SoloWebRTCAudio";
import Node from "@/node/Node";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "SnippetMix",
    description:
        "Application to create and manage Snippets for Soundcraft Mixers",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 0.55,
    userScalable: false,
};

export default function RootPage() {
    return (
        <>
            <SoloWebRTCAudio />
            <Node />
            <PageRenderer />
            <PopUpManager />
        </>
    );
}
