import useClickOutside from "@/hooks/useClickOutside";
import {
    PageObjRowDataTextType,
    PageObjType,
    TextTypeEnum,
    usePagesStore,
} from "@/hooks/usePagesStore";
import styles from "@/styles/HomeGridStyles_v2.module.scss";
import { cn } from "@/utils/Utils";
import { Dispatch, SetStateAction, useMemo, useRef } from "react";

type Props = {
    pages: PageObjType[];
    gridMode: boolean;
    textInsert: PageObjRowDataTextType;
    selected: null | {
        id: number;
        row: number;
    };
    setSelected: Dispatch<
        SetStateAction<null | {
            id: number;
            row: number;
        }>
    >;
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

    let tempValue = "";

    useClickOutside(textInsertRef, textInsert, selected, () => {
        setSelected(null);
        console.log("CLICK OUTSIDE", textInsertRef.current);

        if (inputRef.current) {
            inputRef.current.blur();
            //inputRef.current.setAttribute("readonly", "");
        }
    });

    /* useEffect(() => {
        if (selected === textInsert.id) {
            //inputRef.current?.removeAttribute("readonly");
            //inputRef.current?.click();
            inputRef.current?.focus();
            console.log("ATTACHED FOCUS");
        }
    }, []); */

    const INPUT = useMemo(
        () => (
            <input
                id={styles.textInsertInput}
                ref={inputRef}
                contentEditable={gridMode}
                value={textInsert.text}
                onChange={(e) => {
                    textInsert.text = e.target.value;
                    tempValue = e.target.value;
                    //inputRef.current.value = tempValue;
                    setPages(() => [...pages]);
                }}
                spellCheck="false"
                readOnly={
                    selected?.id === textInsert.id &&
                    selected?.row === textInsert.row
                        ? false
                        : true
                }
            />
        ),
        [selected, textInsert.text]
    );

    return (
        <section
            id={styles.textInsertWrapper}
            ref={textInsertRef}
            className={cn(
                styles[textInsert.type],
                gridMode ? styles.gridMode : "",
                selected?.id == textInsert.id &&
                    selected?.row === textInsert.row
                    ? styles.selected
                    : ""
            )}
            onMouseDown={() => {
                console.log("SELECT");
                setSelected({
                    id: textInsert.id,
                    row: textInsert.row,
                });
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
            {INPUT}
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
