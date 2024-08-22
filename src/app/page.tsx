import PopUpManager from "@/components/PopUps/PopUpManager";
import HomePage from "@/pages/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SnippetMix",
    description:
        "Application to create and manage Snippets for Soundcraft Mixers",
    manifest: "/manifest.json",
};

export default function RootPage() {
    return (
        <>
            <HomePage />
            <PopUpManager />
        </>
    );
}
