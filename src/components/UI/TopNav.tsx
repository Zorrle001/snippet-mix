import { FontClassName } from "@/app/layout";
import { useLocalStorageStore } from "@/hooks/useLocalStorageStore";
import homeStyles from "@/styles/HomeStyles.module.scss";

type Props = {
    buttons?: JSX.Element | null;
    onBack?: () => void;
    hideBack?: boolean;
    backMode?: boolean;
};
export default function TopNav({ buttons, onBack, hideBack, backMode }: Props) {
    const liveMode = useLocalStorageStore((state) => state.liveMode);
    const setLiveMode = useLocalStorageStore((state) => state.setLiveMode);

    const lockMode = useLocalStorageStore((state) => state.lockMode);
    const setLockMode = useLocalStorageStore((state) => state.setLockMode);

    return (
        <nav id={homeStyles.topNav}>
            <section
                id={homeStyles.logo}
                onClick={() => {
                    setLiveMode((state: string) => {
                        if (state === "true") return "false";
                        else return "true";
                    });
                }}
            >
                {/* <div></div> */}
                <h1 id={"Test"}>
                    Snippet
                    <br />
                    Mix
                    <br />
                    {liveMode === "true" && (
                        <span>
                            <i className="fa-solid fa-circle"></i>Live
                        </span>
                    )}
                </h1>
                {/* <div></div> */}
                {/* <img src="TransparentWhiteSlimSnippetMixLogo.png" /> */}
            </section>
            <section id={homeStyles.status}>
                <p>Status</p>
                <button className={FontClassName} id={homeStyles.online}>
                    Online
                </button>
            </section>
            <section id={homeStyles.lockBtnContainer}>
                <button
                    id={lockMode !== "true" ? homeStyles.deleteBtn : ""}
                    onClick={() => {
                        setLockMode((state: string) => {
                            if (state === "true") return "false";
                            else return "true";
                        });
                    }}
                    className={homeStyles.leftBtn}
                >
                    {lockMode === "true" ? (
                        <i className="fa-solid fa-lock"></i>
                    ) : (
                        <i className="fa-solid fa-unlock"></i>
                    )}
                </button>
            </section>
            {buttons}
            {!hideBack && (
                <section id={homeStyles.backBtn}>
                    <button
                        onClick={() => {
                            if (onBack) onBack();
                        }}
                    >
                        <i className="fa-solid fa-house"></i>
                        <p className={FontClassName}>
                            {backMode ? "Zurück" : "Home"}
                        </p>
                    </button>
                </section>
            )}
        </nav>
    );
}
