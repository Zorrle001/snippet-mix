import { FontClassName } from "@/app/layout";
import { usePopUpStore } from "@/hooks/usePopUpStore";
import styles from "@/styles/PopUpStyles.module.scss";
import { cn } from "@/utils/Utils";
import { MouseEventHandler, ReactElement, ReactNode } from "react";

type PopUpProps = {
    title: string;
    children: [
        ReactElement<typeof PopUpHeader>,
        ReactElement<typeof PopUpContent>,
        ReactElement<typeof PopUpActions>
    ];
};
type FloatingHeadlessPopUpProps = {
    title: string;
    children: [
        ReactElement<typeof PopUpContent>,
        ReactElement<typeof PopUpActions>
    ];
};

export default function PopUp({ title, children }: PopUpProps) {
    const [Header, Content, Actions] = children;

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    return (
        <article id={styles.popup}>
            <section id={styles.headline}>
                <div></div>
                <h1>{title}</h1>
                <div></div>
            </section>

            <section
                id={styles.closeBtn}
                onClick={() => {
                    setOpenedPopUp(null);
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </section>

            <section id={styles.headerSection}>{Header}</section>

            <section id={styles.contentSection}>{Content}</section>

            <section id={styles.actionSection}>{Actions}</section>
        </article>
    );
}
export function FloatingPopUp({ title, children }: PopUpProps) {
    const [Header, Content, Actions] = children;

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    return (
        <article id={styles.popup} className={styles.floating}>
            <section id={styles.headline}>
                <div></div>
                <h1>{title}</h1>
                <div></div>
            </section>

            <section
                id={styles.closeBtn}
                onClick={() => {
                    setOpenedPopUp(null);
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </section>
            <section id={styles.headerSection}>{Header}</section>
            <section id={styles.contentSection}>{Content}</section>

            <section id={styles.actionSection}>{Actions}</section>
        </article>
    );
}

export function FloatingHeadlessPopUp({
    title,
    children,
}: FloatingHeadlessPopUpProps) {
    const [Content, Actions] = children;

    const setOpenedPopUp = usePopUpStore((state) => state.setOpenedPopUp);

    return (
        <article
            id={styles.popup}
            className={cn(styles.floating, styles.headless)}
        >
            <section id={styles.headline}>
                <div></div>
                <h1>{title}</h1>
                <div></div>
            </section>

            <section
                id={styles.closeBtn}
                onClick={() => {
                    setOpenedPopUp(null);
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </section>
            <section id={styles.contentSection}>{Content}</section>

            <section id={styles.actionSection}>{Actions}</section>
        </article>
    );
}

export function PopUpHeader(props: { children: ReactNode }) {
    return props.children;
}

export function PopUpContent({ children }: { children: ReactNode }) {
    return children;
}
export function PopUpActions({
    confirm,
    cancel,
    onConfirmClick,
    onCancelClick,
}: {
    confirm?: string;
    cancel?: string;
    onConfirmClick?: MouseEventHandler<HTMLButtonElement>;
    onCancelClick?: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <>
            {cancel ? (
                <button
                    className={styles.cancelBtn + " " + FontClassName}
                    onClick={onCancelClick}
                >
                    {cancel}
                </button>
            ) : null}
            {confirm ? (
                <button className={FontClassName} onClick={onConfirmClick}>
                    {confirm}
                </button>
            ) : null}
        </>
    );
}
