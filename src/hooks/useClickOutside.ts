"use client";

import { RefObject, useEffect } from "react";
import { PageObjRowDataTextType } from "./usePagesStore";

export default function useClickOutside(
    ref: RefObject<HTMLElement>,
    textInsert: PageObjRowDataTextType,
    selected: null | {
        id: number;
        row: number;
    },
    callback: Function
) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (
                selected?.id === textInsert.id &&
                selected?.row === textInsert.row &&
                ref.current
            ) {
                if (!ref.current.contains(event.target)) {
                    callback();
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selected]);
}
