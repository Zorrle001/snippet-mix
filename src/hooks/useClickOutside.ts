"use client";

import { MutableRefObject, RefObject, useEffect } from "react";
import { PageObjRowDataTextType } from "./usePagesStore";

export default function useClickOutside(
    ref: RefObject<HTMLElement>,
    textInsert: PageObjRowDataTextType,
    selected: PageObjRowDataTextType | null,
    callback: Function
) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (selected === textInsert && ref.current) {
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
