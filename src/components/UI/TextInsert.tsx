import useClickOutside from "@/hooks/useClickOutside";
import {
    PageObjRowDataTextType,
    PageObjType,
    TextTypeEnum,
    usePagesStore,
} from "@/hooks/usePagesStore";
import styles from "@/styles/HomeGridStyles_v2.module.scss";
import { cn } from "@/utils/Utils";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type Props = {
    pages: PageObjType[];
    gridMode: boolean;
    textInsert: PageObjRowDataTextType;
    selected: null | PageObjRowDataTextType;
    setSelected: Dispatch<SetStateAction<PageObjRowDataTextType | null>>;
    onDelete: Function;
};
export default function TextInsert({
    pages,
    gridMode,
    textInsert,
    selected,
    setSelected,
    onDelete,
}: Props) {
    const setPages = usePagesStore((state) => state.setPages);
    //const selected = useState

    const textInsertRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useClickOutside(textInsertRef, textInsert, selected, () => {
        setSelected(null);
        console.log("CLICK OUTSIDE", textInsertRef.current);

        if (inputRef.current) {
            inputRef.current.blur();
        }
    });

    useEffect(() => {
        if (selected) {
            inputRef.current?.focus();
            console.log("ATTACHED FOCUS");
        }
    }, []);

    return (
        <section
            id={styles.textInsertWrapper}
            ref={textInsertRef}
            className={cn(
                styles[textInsert.type],
                gridMode ? styles.editMode : "",
                selected == textInsert ? styles.selected : ""
            )}
            onMouseDown={() => {
                setSelected(textInsert);
            }}
        >
            <span
                onClick={() => {
                    //alert("Hello");

                    if (textInsert.type == TextTypeEnum.H1) {
                        textInsert.type = TextTypeEnum.H2;
                    } else if (textInsert.type == TextTypeEnum.H2) {
                        textInsert.type = TextTypeEnum.H3;
                    } else if (textInsert.type == TextTypeEnum.H3) {
                        textInsert.type = TextTypeEnum.Label;
                    } else if (textInsert.type == TextTypeEnum.Label) {
                        textInsert.type = TextTypeEnum.H1;
                    }
                    setPages(() => [...pages]);
                }}
            >
                {textInsert.type}
            </span>
            <input
                id={styles.textInsertInput}
                ref={inputRef}
                contentEditable={gridMode}
                value={textInsert.text}
                onChange={(e) => {
                    textInsert.text = e.target.value;
                    setPages(() => [...pages]);
                }}
                spellCheck="false"
            />
            <button
                onClick={() => {
                    onDelete();
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </section>
    );
}
