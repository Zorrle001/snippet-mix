"use client";

type Props = {};

import useLocalStorage from "@/hooks/useLocalStorage";
import styles from "@/styles/nodes/NodesPageStyles.module.scss";
import { cn } from "@/utils/Utils";
import Link from "next/link";
import { FontClassName } from "../layout";

export default function NodesPage({}: Props) {
    const [nodeURL, setNodeURL] = useLocalStorage("nodeURL", null);

    // ALLOW ADDING AND CONNECTING VON CUSToM

    return (
        <article id={styles.nodesPage}>
            <nav>
                <div>
                    <h1>Node Connections</h1>
                    <p>Wähle eine Node aus, um eine Verbindung herzustellen</p>
                </div>
                <button className={FontClassName}>
                    <i className="fa-solid fa-plus"></i>
                    <p>Hinzufügen</p>
                </button>
            </nav>

            <ul id={styles.connectionList}>
                <li>
                    <div id={styles.leftPart}>
                        <h2>Ethernet Node</h2>
                        <p>192.168.178.37:8080</p>
                    </div>
                    <div id={styles.rightPart}>
                        <Link
                            href="/"
                            className={FontClassName}
                            onClick={() => {
                                setNodeURL("192.168.178.37:8080");
                            }}
                        >
                            <i className="fa-solid fa-link"></i>
                            <p>Verbinden</p>
                        </Link>
                        <button className={cn(FontClassName, styles.smallBtn)}>
                            <i className="fa-solid fa-xmark"></i>
                            <p>Entfernen</p>
                        </button>
                    </div>
                </li>
                <li>
                    <div id={styles.leftPart}>
                        <h2>WLAN Node</h2>
                        <p>192.168.178.68:8080</p>
                    </div>
                    <div id={styles.rightPart}>
                        <Link
                            href="/"
                            className={FontClassName}
                            onClick={() => {
                                setNodeURL("192.168.178.68:8080");
                            }}
                        >
                            <i className="fa-solid fa-link"></i>
                            <p>Verbinden</p>
                        </Link>
                        <button className={cn(FontClassName, styles.smallBtn)}>
                            <i className="fa-solid fa-xmark"></i>
                            <p>Entfernen</p>
                        </button>
                    </div>
                </li>
            </ul>
        </article>
    );
}
