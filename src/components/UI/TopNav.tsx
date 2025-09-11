import { FontClassName } from "@/app/layout";
import homeStyles from "@/styles/HomeStyles.module.scss";

type Props = {
    buttons?: JSX.Element | null;
    onBack?: () => void;
    hideBack?: boolean;
    backMode?: boolean;
};
export default function TopNav({ buttons, onBack, hideBack, backMode }: Props) {
    return (
        <nav id={homeStyles.topNav}>
            <section id={homeStyles.logo}>
                {/* <div></div>
                    <h1 id={"Test"}>
                        Snippet
                        <br />
                        Mix
                    </h1>
                    <div></div> */}
                <img src="TransparentWhiteSlimSnippetMixLogo.png" />
            </section>
            <section id={homeStyles.status}>
                <p>Status</p>
                <button className={FontClassName} id={homeStyles.online}>
                    Online
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
